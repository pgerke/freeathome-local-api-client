import { Subject, Subscription } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { RawData, WebSocket } from "ws";
import { SystemAccessPoint } from "../src";
import {
  Configuration,
  DeviceResponse,
  GetDataPointResponse,
  Logger,
  SetDataPointResponse,
  VirtualDeviceResponse,
  VirtualDeviceType,
  WebSocketMessage,
} from "../src/model";
import { originalTimeout } from "../test";

const logger: Logger = {
  debug: jasmine.createSpy(),
  error: jasmine.createSpy(),
  log: jasmine.createSpy(),
  warn: jasmine.createSpy(),
};

describe("System Access Point", () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  afterAll(() => {
    // Restore the default Jasmine timeout after the test suite.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should use the console logger by default", () => {
    const sysAp = new SystemAccessPoint("ap", "username", "password");
    const instance = sysAp as unknown as { logger: Logger };
    expect(instance.logger).toEqual(console);
  });

  it("should use a custom logger", () => {
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      undefined,
      undefined,
      logger
    );
    const instance = sysAp as unknown as { logger: Logger };
    expect(instance.logger).toEqual(logger);
  });

  it("should throw an error if the connection is requested and the web socket is already open", () => {
    const sysAp = new SystemAccessPoint("ap", "username", "password");
    const instance = sysAp as unknown as { webSocket?: WebSocket };
    expect(instance.webSocket).toBeUndefined();
    instance.webSocket = { readyState: WebSocket.OPEN } as WebSocket;
    expect(() => sysAp.connectWebSocket()).toThrowError(
      "Web socket is already connected"
    );
  });

  it("should create a new web socket instance on connect", () => {
    spyOn(WebSocket.prototype, "send");
    const spy = spyOn(console, "warn");
    const sysAp = new SystemAccessPoint("localhost", "username", "password");
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      webSocketKeepaliveSubscription: Subscription | undefined;
    };
    expect(instance.webSocket).toBeUndefined();
    expect(instance.webSocketKeepaliveSubscription).toBeUndefined();
    sysAp.connectWebSocket(true);
    expect(spy).not.toHaveBeenCalled();
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
    expect(instance.webSocketKeepaliveSubscription).toBeDefined();
  });

  it("should send ping frame when keepalive timer expires and the web socket is open", () => {
    spyOn(WebSocket.prototype, "send");
    const mockWebSocket = {
      readyState: WebSocket.OPEN,
      ping: jasmine.createSpy(),
    };
    const sysAp = new SystemAccessPoint(
      "localhost",
      "username",
      "password",
      undefined,
      undefined,
      logger,
      testScheduler
    );
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      webSocketKeepaliveTimerReset$: Subject<void>;
      createWebSocket: (certificateVerification: boolean) => WebSocket;
    };
    spyOn(instance, "createWebSocket").and.returnValue(
      mockWebSocket as unknown as WebSocket
    );
    expect(instance.webSocket).toBeUndefined();

    sysAp.connectWebSocket(true);
    expect(instance.webSocket).toBeDefined();
    expect(instance.webSocket?.readyState).toEqual(WebSocket.OPEN);
    testScheduler.run(() => {
      instance.webSocketKeepaliveTimerReset$.next();
      testScheduler.maxFrames = 100_000;
      testScheduler.flush();
      expect(mockWebSocket.ping).toHaveBeenCalledTimes(3);
    });
  });

  it("should not send ping frame when keepalive timer expires and the web socket is not open", () => {
    spyOn(WebSocket.prototype, "send");
    const mockWebSocket = {
      readyState: WebSocket.CLOSED,
      ping: jasmine.createSpy(),
    };
    const sysAp = new SystemAccessPoint(
      "localhost",
      "username",
      "password",
      undefined,
      undefined,
      logger,
      testScheduler
    );
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      webSocketKeepaliveTimerReset$: Subject<void>;
      createWebSocket: (certificateVerification: boolean) => WebSocket;
    };
    spyOn(instance, "createWebSocket").and.returnValue(
      mockWebSocket as unknown as WebSocket
    );
    expect(instance.webSocket).toBeUndefined();

    sysAp.connectWebSocket(true);
    expect(instance.webSocket).toBeDefined();
    expect(instance.webSocket?.readyState).toEqual(WebSocket.CLOSED);
    testScheduler.run(() => {
      instance.webSocketKeepaliveTimerReset$.next();
      testScheduler.maxFrames = 100_000;
      testScheduler.flush();
      expect(mockWebSocket.ping).not.toHaveBeenCalled();
    });
  });

  it("should warn if certificate verification is disabled", () => {
    spyOn(WebSocket.prototype, "send");
    const sysAp = new SystemAccessPoint(
      "localhost",
      "username",
      "password",
      undefined,
      undefined,
      logger
    );
    const instance = sysAp as unknown as { webSocket?: WebSocket };
    expect(instance.webSocket).toBeUndefined();
    sysAp.connectWebSocket(false);
    expect(logger.warn).toHaveBeenCalledWith(
      "TLS certificate verification is disabled! This poses a security risk, activating certificate verification is strictly recommended."
    );
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
  });

  it("should call web socket event handlers", () => {
    spyOn(WebSocket.prototype, "send");
    spyOn(WebSocket.prototype, "pong");
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      false,
      undefined,
      logger
    );
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      processWebSocketMessage: (data: RawData, isBinary: boolean) => void;
    };
    sysAp.connectWebSocket();
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
    const error = new Error("Test Error");
    instance.webSocket?.emit("error", error);
    expect(logger.error).toHaveBeenCalledWith("Error received", error);
    (logger.error as jasmine.Spy).calls.reset();
    instance.webSocket?.emit("unexpected-response");
    expect(logger.error).toHaveBeenCalledWith("Unexpected response received");
    instance.webSocket?.emit("open");
    expect(logger.log).toHaveBeenCalledWith("Connection opened");
    (logger.log as jasmine.Spy).calls.reset();
    instance.webSocket?.emit("close");
    expect(logger.log).toHaveBeenCalledWith("Connection closed");
    const data = Buffer.from("Test", "ascii");
    instance.webSocket?.emit("ping", data);
    expect(logger.debug).toHaveBeenCalledWith("Ping received", "Test");
    (logger.debug as jasmine.Spy).calls.reset();
    instance.webSocket?.emit("pong", data);
    expect(logger.debug).toHaveBeenCalledWith("Pong received", "Test");
    (logger.debug as jasmine.Spy).calls.reset();
    instance.webSocket?.emit("upgrade", data);
    expect(logger.debug).toHaveBeenCalledWith("Upgrade request received");
    const spy = spyOn(instance, "processWebSocketMessage");
    instance.webSocket?.emit("message", {}, true);
    expect(spy).toHaveBeenCalled();
  });

  it("should throw an error if there is no web socket to close on disconnect", () => {
    const sysAp = new SystemAccessPoint("ap", "username", "password");
    const instance = sysAp as unknown as { webSocket?: WebSocket };
    expect(instance.webSocket).toBeUndefined();
    expect(() => sysAp.disconnectWebSocket()).toThrowError(
      "Web socket is not open"
    );
  });

  it("should throw an error if the web socket is not open on disconnect", () => {
    const sysAp = new SystemAccessPoint("ap", "username", "password");
    const instance = sysAp as unknown as { webSocket?: WebSocket };
    instance.webSocket = { readyState: WebSocket.CLOSED } as WebSocket;
    expect(() => sysAp.disconnectWebSocket()).toThrowError(
      "Web socket is not open"
    );
  });

  it("should terminate the web socket if disconnect is called with force parameter", () => {
    const sysAp = new SystemAccessPoint("ap", "username", "password");
    const instance = sysAp as unknown as { webSocket?: WebSocket };
    instance.webSocket = {
      readyState: WebSocket.OPEN,
      terminate: jasmine.createSpy(),
      close: jasmine.createSpy(),
    } as unknown as WebSocket;
    sysAp.disconnectWebSocket(true);
    /* eslint-disable @typescript-eslint/unbound-method */
    expect(instance.webSocket.close).not.toHaveBeenCalled();
    expect(instance.webSocket.terminate).toHaveBeenCalled();
    /* eslint-enable @typescript-eslint/unbound-method */
  });

  it("should close the web socket if disconnect is called without force parameter", () => {
    const sysAp = new SystemAccessPoint("ap", "username", "password");
    const instance = sysAp as unknown as { webSocket?: WebSocket };
    instance.webSocket = {
      readyState: WebSocket.OPEN,
      terminate: jasmine.createSpy(),
      close: jasmine.createSpy(),
    } as unknown as WebSocket;
    sysAp.disconnectWebSocket();
    /* eslint-disable @typescript-eslint/unbound-method */
    expect(instance.webSocket.close).toHaveBeenCalled();
    expect(instance.webSocket.terminate).not.toHaveBeenCalled();
    /* eslint-enable @typescript-eslint/unbound-method */
  });

  it("should not process binary messages", () => {
    spyOn(WebSocket.prototype, "send");
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      false,
      undefined,
      logger
    );
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      webSocketMessageSubject: Subject<WebSocketMessage>;
    };
    const nextSpy = spyOn(instance.webSocketMessageSubject, "next");
    sysAp.connectWebSocket();
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
    instance.webSocket?.emit("message", Buffer.from("Test", "ascii"), true);
    expect(nextSpy).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      "Binary message received. Binary messages are not processed."
    );
  });

  it("should not process unknown non-binary messages", () => {
    spyOn(WebSocket.prototype, "send");
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      false,
      undefined,
      logger
    );
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      webSocketMessageSubject: Subject<WebSocketMessage>;
    };
    const nextSpy = spyOn(instance.webSocketMessageSubject, "next");
    sysAp.connectWebSocket();
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
    const obj = { isTest: true };
    const message = JSON.stringify(obj);
    instance.webSocket?.emit("message", Buffer.from(message, "ascii"), false);
    expect(nextSpy).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      "Received message has an unexpected type!",
      message
    );
  });

  it("should notify subscribers about received messages", (done) => {
    spyOn(WebSocket.prototype, "send");
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    const message: WebSocketMessage = {
      Test: {
        datapoints: {},
        devices: {},
        devicesAdded: [],
        devicesRemoved: [],
        scenesTriggered: {},
      },
    };
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
    };
    sysAp.connectWebSocket();
    const subscription = sysAp.getWebSocketMessages().subscribe((msg) => {
      expect(msg).toEqual(message);
      subscription.unsubscribe();
      done();
    });
    instance.webSocket?.emit(
      "message",
      Buffer.from(JSON.stringify(message), "ascii"),
      false
    );
  });

  it("should throw an error if received message fails to pass type guard", async () => {
    const obj = {
      Test: {
        key: "value",
      },
    };
    const response = {
      status: 200,
      json: () => Promise.resolve(obj),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      undefined,
      undefined,
      logger
    );
    try {
      await sysAp.getDeviceList();
      fail();
    } catch (error) {
      expect(error).toEqual(
        new Error("Received message has an unexpected type!")
      );
    }
    expect(logger.error).toHaveBeenCalledWith(
      "Received message has an unexpected type!",
      obj
    );
  });

  it("should process unauthorized response", async () => {
    const response = { status: 401 } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      undefined,
      undefined,
      logger
    );
    try {
      await sysAp.getDeviceList();
      fail();
    } catch (error) {
      expect(error).toEqual(
        new Error("Authentication information is missing or invalid.")
      );
    }
    expect(logger.error).toHaveBeenCalledWith(
      "Authentication information is missing or invalid."
    );
  });

  it("should process bad gateway response", async () => {
    const response = {
      status: 502,
      text: () => Promise.resolve("Test Error"),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      undefined,
      undefined,
      logger
    );
    try {
      await sysAp.getDeviceList();
      fail();
    } catch (error) {
      expect(error).toEqual(new Error("Test Error"));
    }
    expect(logger.error).toHaveBeenCalledWith("Test Error");
  });

  it("should process unexpected error response", async () => {
    const response = {
      status: 403,
      text: () => Promise.resolve("Test Error"),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      undefined,
      undefined,
      logger
    );
    try {
      await sysAp.getDeviceList();
      fail();
    } catch (error) {
      expect(error).toEqual(
        new Error("Received HTTP 403 status code unexpectedly: Test Error")
      );
    }
    expect(logger.error).toHaveBeenCalledWith(
      "Received HTTP 403 status code unexpectedly: Test Error"
    );
  });

  it("should create virtual device via REST endpoint", async () => {
    const obj: VirtualDeviceResponse = {
      "00000000-0000-0000-0000-000000000000": {
        devices: {
          abcd12345: {
            serial: "6000D2CB27B2",
          },
        },
      },
    };
    const response = {
      status: 200,
      json: () => Promise.resolve(obj),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    expect(
      await sysAp.createVirtualDevice("", "", { type: VirtualDeviceType.RTC })
    ).toEqual(obj);
  });

  it("should get Configuration from REST endpoint", async () => {
    const obj: Configuration = {
      Test: {
        devices: {},
        floorplan: {
          floors: {},
        },
        sysapName: "Test System Access Point",
        users: {},
      },
    };
    const response = {
      status: 200,
      json: () => Promise.resolve(obj),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    expect(await sysAp.getConfiguration()).toEqual(obj);
  });

  it("should get Device from REST endpoint", async () => {
    const obj: DeviceResponse = {
      Test: {
        devices: {},
      },
    };
    const response = {
      status: 200,
      json: () => Promise.resolve(obj),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    expect(await sysAp.getDevice("", "")).toEqual(obj);
  });

  it("should get data point from REST endpoint", async () => {
    const obj: GetDataPointResponse = {
      Test: {
        values: ["Value 1", "Value 2"],
      },
    };
    const response = {
      status: 200,
      json: () => Promise.resolve(obj),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    expect(await sysAp.getDatapoint("", "", "", "")).toEqual(obj);
  });

  it("should set data point via REST endpoint", async () => {
    const obj: SetDataPointResponse = {
      Test: {
        key1: "Value 1",
        key2: "Value 2",
      },
    };
    const response = {
      status: 200,
      json: () => Promise.resolve(obj),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    expect(await sysAp.setDatapoint("", "", "", "", "")).toEqual(obj);
  });

  it("should trigger proxy device via REST endpoint", async () => {
    const obj: DeviceResponse = {
      Test: {
        devices: {},
      },
    };
    const response = {
      status: 200,
      json: () => Promise.resolve(obj),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    expect(await sysAp.triggerProxyDevice("", "", "", "")).toEqual(obj);
  });

  it("should set value for proxy device via REST endpoint", async () => {
    const obj: DeviceResponse = {
      Test: {
        devices: {},
      },
    };
    const response = {
      status: 200,
      json: () => Promise.resolve(obj),
    } as Response;
    globalThis.fetch = jasmine.createSpy().and.resolveTo(response);
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    expect(await sysAp.setProxyDeviceValue("", "", "", "")).toEqual(obj);
  });
});
