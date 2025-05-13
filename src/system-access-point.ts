import { EventEmitter } from "events";
import {
  interval,
  Observable,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
} from "rxjs";
import { ClientOptions, RawData, WebSocket } from "ws";
import {
  Configuration,
  DeviceList,
  DeviceResponse,
  GetDataPointResponse,
  isConfiguration,
  isDeviceList,
  isDeviceResponse,
  isGetDataPointResponse,
  isSetDataPointResponse,
  isWebSocketMessage,
  Logger,
  SetDataPointResponse,
  VirtualDevice,
  VirtualDeviceResponse,
  WebSocketMessage,
} from "./model";
import { isVirtualDeviceResponse } from "./model/validator";

/** The HTTP request method */
type HttpRequestMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

/** The class representing a System Access Point. */
export class SystemAccessPoint extends EventEmitter {
  /** The basic authentication key used for requests. */
  public readonly basicAuthKey: string;
  /** The host name of the system access point. */
  public readonly hostName: string;
  /** Determines whether requests to the system access point will use TLS. */
  public readonly tlsEnabled: boolean;
  private readonly logger: Logger;
  private readonly verboseErrors: boolean;
  private webSocket?: WebSocket;
  private readonly webSocketMessageSubject = new Subject<WebSocketMessage>();
  private readonly webSocketKeepaliveTimerReset$ = new Subject<void>();
  private readonly webSocketKeepaliveTimer$ =
    this.webSocketKeepaliveTimerReset$.pipe(
      switchMap(() =>
        interval(30000).pipe(takeUntil(this.webSocketKeepaliveTimerReset$))
      )
    );
  private webSocketKeepaliveSubscription?: Subscription;

  /**
   * Constructs a new SystemAccessPoint instance
   *
   * @constructor
   * @param hostName {string} The system access point host name.
   * @param userName {string} The user name that shall be used to authenticate with the system access point.
   * @param password {string} The password that shall be used to authenticate with the system access point.
   * @param tlsEnabled {boolean} Determines whether the communication with the system access point shall be protected by TLS.
   * @param verboseErrors {boolean} Determines whether verbose error messages shall be used, for example for message validation.
   * @param logger {Logger} The logger instance to be used. If no explicit implementation is provided, the this.logger will be used for logging.
   */
  constructor(
    hostName: string,
    userName: string,
    password: string,
    tlsEnabled = true,
    verboseErrors = false,
    logger?: Logger
  ) {
    super();
    // Configure logging
    this.logger = logger ?? console;

    // Create Basic Authentication key
    this.basicAuthKey = Buffer.from(`${userName}:${password}`, "utf8").toString(
      "base64"
    );
    this.hostName = hostName;
    this.tlsEnabled = tlsEnabled;
    this.verboseErrors = verboseErrors;
  }

  /**
   * Connects to the System Access Point web socket.
   * @param certificateVerification {boolean} Determines whether the TLS certificate presented by the server will be verified.
   */
  public connectWebSocket(certificateVerification: boolean = true): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      throw new Error("Web socket is already connected");
    }

    this.webSocket = this.createWebSocket(certificateVerification);
    this.webSocketKeepaliveSubscription =
      this.webSocketKeepaliveTimer$.subscribe(() => {
        if (!(this.webSocket && this.webSocket.readyState === WebSocket.OPEN))
          return;

        this.logger.log("keepalive timer expired, sending ping message...");
        this.webSocket.ping();
      });
  }

  /**
   * Creates a new virtual device.
   * @param sysApUuid {string} The UUID identifying the system access point.
   * @param deviceSerial {string} The serial number to be assigned to the device.
   * @param virtualDevice {VirtualDevice} The virtual device to be created.
   * @returns {Promise.<VirtualDeviceResponse>} The response to the virtual device request.
   */
  public async createVirtualDevice(
    sysApUuid: string,
    deviceSerial: string,
    virtualDevice: VirtualDevice
  ): Promise<VirtualDeviceResponse> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest(
      "PUT",
      `virtualdevice/${sysApUuid}/${deviceSerial}`,
      JSON.stringify(virtualDevice)
    );

    // Process response
    return this.processRestResponse(response, isVirtualDeviceResponse);
  }

  private createWebSocket(certificateVerification: boolean): WebSocket {
    // Disabling certificate verification is discouraged, issue a warning
    if (this.tlsEnabled && !certificateVerification) {
      this.logger.warn(
        "TLS certificate verification is disabled! This poses a security risk, activating certificate verification is strictly recommended."
      );
    }

    const url = `${this.tlsEnabled ? "wss" : "ws"}://${
      this.hostName
    }/fhapi/v1/api/ws`;
    const options: ClientOptions = {
      rejectUnauthorized: this.tlsEnabled && certificateVerification,
      headers: {
        Authorization: `Basic ${this.basicAuthKey}`,
      },
    };
    const webSocket = new WebSocket(url, options);
    webSocket.on("error", (error: Error) => {
      this.emit("websocket-error", error);
      this.logger.error("Error received", error);
    });
    webSocket.on("ping", (data: Buffer) => {
      this.emit("websocket-ping", data);
      this.logger.debug("Ping received", data.toString("ascii"));
    });
    webSocket.on("pong", (data: Buffer) => {
      this.emit("websocket-pong", data);
      this.logger.debug("Pong received", data.toString("ascii"));
    });
    webSocket.on("unexpected-response", (request, response) => {
      this.emit("websocket-unexpected-response", request, response);
      this.logger.error("Unexpected response received");
    });
    webSocket.on("upgrade", (request) => {
      this.emit("websocket-upgrade", request);
      this.logger.debug("Upgrade request received");
    });
    webSocket.on("open", () => {
      this.emit("websocket-open");
      this.logger.log("Connection opened");
    });
    webSocket.on("close", (code, reason) => {
      this.emit("websocket-close", code, reason);
      this.logger.log("Connection closed");
    });
    webSocket.on("message", (data: RawData, isBinary: boolean) => {
      this.emit("websocket-message", data, isBinary);
      this.webSocketKeepaliveTimerReset$.next();
      this.processWebSocketMessage(data, isBinary);
    });
    return webSocket;
  }

  /**
   * Disconnects from the System Access Point web socket.
   * @param force {boolean} Determines whether or not the connection will be closed forcibly.
   */
  public disconnectWebSocket(force: boolean = false): void {
    if (!this.webSocket || this.webSocket.readyState === WebSocket.CLOSED) {
      throw new Error("Web socket is not open");
    }

    this.webSocketKeepaliveSubscription?.unsubscribe();
    this.webSocketKeepaliveSubscription = undefined;
    if (force) {
      this.webSocket.terminate();
    } else {
      this.webSocket.close();
    }
  }

  /**
   * Gets the configuration from the system access point.
   * @returns {Promise.<Configuration>} The system access point configuration.
   */
  public async getConfiguration(): Promise<Configuration> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest(
      "GET",
      "configuration"
    );

    // Process response
    return this.processRestResponse(response, isConfiguration);
  }

  /**
   * Gets the device list from the system access point.
   * @returns {Promise.<DeviceList>} The requested device list.
   */
  public async getDeviceList(): Promise<DeviceList> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest("GET", "devicelist");

    // Process response
    return this.processRestResponse(response, isDeviceList);
  }

  /**
   * Gets the specified device from the system access point.
   * @param sysApUuid {string} The UUID identifying the system access point.
   * @param deviceSerial {string} The device serial number.
   * @returns {Promise.<DeviceResponse>} The response to the device request.
   */
  public async getDevice(
    sysApUuid: string,
    deviceSerial: string
  ): Promise<DeviceResponse> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest(
      "GET",
      `device/${sysApUuid}/${deviceSerial}`
    );

    // Process response
    return this.processRestResponse(response, isDeviceResponse);
  }

  /**
   * Gets the specified data point from the system access point.
   * @param sysApUuid {string} The UUID idenfifying the system access point.
   * @param deviceSerial {string} The device serial number.
   * @param channel {string} The channel identifier.
   * @param dataPoint {string} The datapoint identifier.
   * @returns {Promise.<GetDataPointResponse>} The response to the get data point request.
   */
  public async getDatapoint(
    sysApUuid: string,
    deviceSerial: string,
    channel: string,
    dataPoint: string
  ): Promise<GetDataPointResponse> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest(
      "GET",
      `datapoint/${sysApUuid}/${deviceSerial}.${channel}.${dataPoint}`
    );

    // Process response
    return this.processRestResponse(response, isGetDataPointResponse);
  }

  /**
   * Gets the web socket messages.
   * @returns {Observable.<WebSocketMessage>} An observable that is updated with the messages received from the web socket.
   */
  public getWebSocketMessages(): Observable<WebSocketMessage> {
    return this.webSocketMessageSubject.asObservable();
  }

  /**
   * Sets a new value for the specificed data point.
   * @param sysApUuid {string} The UUID idenfifying the system access point.
   * @param deviceSerial {string} The device serial number.
   * @param channel {string} The channel identifier.
   * @param dataPoint {string} The datapoint identifier.
   * @param value {string} The new value to be set.
   * @returns {Promise.<SetDataPointResponse>} The response to the set data point request.
   */
  public async setDatapoint(
    sysApUuid: string,
    deviceSerial: string,
    channel: string,
    dataPoint: string,
    value: string
  ): Promise<SetDataPointResponse> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest(
      "PUT",
      `datapoint/${sysApUuid}/${deviceSerial}.${channel}.${dataPoint}`,
      value
    );

    // Process response
    return this.processRestResponse(response, isSetDataPointResponse);
  }

  /**
   * Triggeres the given action for the specified proxy device. Please note that this method is part of the experimental API!
   * @param sysApUuid {string} The UUID idenfifying the system access point.
   * @param deviceClass {string} The device class.
   * @param deviceSerial {string} The device serial number.
   * @param action {string} The action to be triggered.
   * @returns {Promise.<DeviceResponse>} The response to the request.
   */
  public async triggerProxyDevice(
    sysApUuid: string,
    deviceClass: string,
    deviceSerial: string,
    action: string
  ): Promise<DeviceResponse> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest(
      "GET",
      `proxydevice/${sysApUuid}/${deviceClass}/${deviceSerial}/action/${action}`
    );

    // Process response
    return this.processRestResponse(response, isDeviceResponse);
  }

  /**
   * Sets the given value for the specified proxy device. Please note that this method is part of the experimental API!
   * @param sysApUuid {string} The UUID idenfifying the system access point.
   * @param deviceClass {string} The device class.
   * @param deviceSerial {string} The device serial number.
   * @param value {string} The value to be set.
   * @returns {Promise.<DeviceResponse>} The response to the request.
   */
  public async setProxyDeviceValue(
    sysApUuid: string,
    deviceClass: string,
    deviceSerial: string,
    value: string
  ): Promise<DeviceResponse> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest(
      "PUT",
      `proxydevice/${sysApUuid}/${deviceClass}/${deviceSerial}/value/${value}`
    );

    // Process response
    return this.processRestResponse(response, isDeviceResponse);
  }

  private async fetchDataViaRest(
    method: HttpRequestMethod,
    route: string,
    body: BodyInit | null | undefined = undefined
  ): Promise<Response> {
    // Set up request info
    const info: RequestInfo = `${this.tlsEnabled ? "https" : "http"}://${
      this.hostName
    }/fhapi/v1/api/rest/${route}`;

    // Set up request init
    const init: RequestInit = {
      method: method,
      headers: {
        Authorization: `Basic ${this.basicAuthKey}`,
      },
      body: body,
    };

    // Get response from system access point
    return fetch(info, init);
  }

  private async processRestResponse<TResponse>(
    response: Response,
    typeGuard: (
      obj: unknown,
      logger: Logger,
      verbose: boolean
    ) => obj is TResponse
  ): Promise<TResponse> {
    let body: unknown;
    let message: string;

    // Process response
    switch (response.status) {
      case 200:
        body = await response.json();
        if (!typeGuard(body, this.logger, this.verboseErrors)) {
          message = "Received message has an unexpected type!";
          this.logger.error(message, body);
          throw new Error(message);
        }

        return body;
      case 401:
        message = "Authentication information is missing or invalid.";
        this.logger.error(message);
        throw new Error(message);
      case 502:
        message = await response.text();
        this.logger.error(message);
        throw new Error(message);
      default:
        message = `Received HTTP ${
          response.status
        } status code unexpectedly: ${await response.text()}`;
        this.logger.error(message);
        throw new Error(message);
    }
  }

  private processWebSocketMessage(data: RawData, isBinary: boolean): void {
    // Do not process binary messages
    if (isBinary) {
      this.logger.warn(
        "Binary message received. Binary messages are not processed."
      );
      return;
    }

    this.logger.debug("Message received");
    /*
     * Deserialize the message.
     * The message is expected to be deserializable as a web socket message.
     * If that is not the case, that's an error case.
     */
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const serialized = data.toString();
    const message: unknown = JSON.parse(serialized);

    if (isWebSocketMessage(message, this.logger, this.verboseErrors)) {
      this.webSocketMessageSubject.next(message);
      return;
    }

    this.logger.error("Received message has an unexpected type!", serialized);
  }
}
