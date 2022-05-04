import { SystemAccessPoint } from "../src";
import { originalTimeout } from "../test";
import { RawData, WebSocket } from "ws";
import { WebSocketMessage } from "../src/model";
import { Subject } from "rxjs";
import fetch from "node-fetch";

describe("System Access Point", () => {
  afterAll(() => {
    // Restore the default Jasmine timeout after the test suite.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should warn if certificate verification is disabled", () => {
    const spy = spyOn(console, "warn");
    const sysAp = new SystemAccessPoint(
      "ap",
      "username",
      "password",
      true,
      false
    );
    expect(spy).toHaveBeenCalledWith(
      "TLS certificate verification is disabled! This poses a security risk, activating certificate verification is strictly recommended."
    );
    expect(sysAp.hostName).toBe("ap");
    expect(sysAp.basicAuthKey).toEqual(
      Buffer.from("username:password", "utf8").toString("base64")
    );
    expect(sysAp.tlsEnabled).toBeTrue();
    expect(sysAp.certificateVerification).toBeFalse();
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
    const sysAp = new SystemAccessPoint("ap", "username", "password");
    const instance = sysAp as unknown as { webSocket?: WebSocket };
    expect(instance.webSocket).toBeUndefined();
    sysAp.connectWebSocket();
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
  });

  it("should call web socket event handlers", () => {
    spyOn(WebSocket.prototype, "send");
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      processWebSocketMessage: (data: RawData, isBinary: boolean) => void;
    };
    sysAp.connectWebSocket();
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
    let spy = spyOn(console, "error");
    const error = new Error("Test Error");
    instance.webSocket?.emit("error", error);
    expect(spy).toHaveBeenCalledWith("Error received", error);
    spy.calls.reset();
    instance.webSocket?.emit("unexpected-response");
    expect(spy).toHaveBeenCalledWith("Unexpected response received");
    spy = spyOn(console, "log");
    instance.webSocket?.emit("open");
    expect(spy).toHaveBeenCalledWith("Connection opened");
    spy.calls.reset();
    instance.webSocket?.emit("close");
    expect(spy).toHaveBeenCalledWith("Connection closed");
    spy = spyOn(console, "debug");
    const data = Buffer.from("Test", "ascii");
    instance.webSocket?.emit("ping", data);
    expect(spy).toHaveBeenCalledWith("Ping received", "Test");
    spy.calls.reset();
    instance.webSocket?.emit("pong", data);
    expect(spy).toHaveBeenCalledWith("Pong received", "Test");
    spy.calls.reset();
    instance.webSocket?.emit("upgrade", data);
    expect(spy).toHaveBeenCalledWith("Upgrade request received");
    spy = spyOn(instance, "processWebSocketMessage");
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
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      webSocketMessageSubject: Subject<WebSocketMessage>;
    };
    const nextSpy = spyOn(instance.webSocketMessageSubject, "next");
    const warnSpy = spyOn(console, "warn");
    sysAp.connectWebSocket();
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
    instance.webSocket?.emit("message", Buffer.from("Test", "ascii"), true);
    expect(nextSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      "Binary message received. Binary messages are not processed."
    );
  });

  it("should not process unknown non-binary messages", () => {
    spyOn(WebSocket.prototype, "send");
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    const instance = sysAp as unknown as {
      webSocket?: WebSocket;
      webSocketMessageSubject: Subject<WebSocketMessage>;
    };
    const nextSpy = spyOn(instance.webSocketMessageSubject, "next");
    const errorSpy = spyOn(console, "error");
    sysAp.connectWebSocket();
    expect(instance.webSocket).toBeInstanceOf(WebSocket);
    const obj = { isTest: true };
    const message = JSON.stringify(obj);
    instance.webSocket?.emit("message", Buffer.from(message, "ascii"), false);
    expect(nextSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      "Received message has an unexpected type!",
      message
    );
  });

  it("should notify subscribers about received messages", (done) => {
    spyOn(WebSocket.prototype, "send");
    const sysAp = new SystemAccessPoint("ap", "username", "password", false);
    const message: WebSocketMessage = {
      systemAccessPoint: {
        Test: {
          datapoints: {},
          devices: {},
          devicesAdded: [],
          devicesRemoved: [],
          scenesTriggeres: {},
        },
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

  fit("should get configuration", async () => {
    window.fetch = fetch;
    const sysAp = new SystemAccessPoint(
      "sysap",
      "0dc87fa4-9f60-42e8-8b51-09f583abfdb6",
      "MS5free@home",
      true,
      false
    );
    const config = await sysAp.getConfiguration();
    console.log(config);
    expect(config).toBeDefined();
  });
});
