import { Observable, Subject } from "rxjs";
import { ClientOptions, RawData, WebSocket } from "ws";
import {
  Configuration,
  DeviceList,
  DeviceResponse,
  GetDataPointResponse,
  isDeviceList,
  isDeviceResponse,
  isWebSocketMessage,
  isGetDataPointResponse,
  isSetDataPointResponse,
  isConfiguration,
  SetDataPointResponse,
  WebSocketMessage,
  VirtualDevice,
  VirtualDeviceResponse,
} from "./model";
import { isVirtualDeviceResponse } from "./model/validator";

type HttpRequestMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

/**
 * The class representing a System Access Point.
 *
 * @class
 */
export class SystemAccessPoint {
  /** The basic authentication key used for requests. */
  public readonly basicAuthKey: string;
  /** The host name of the system access point. */
  public readonly hostName: string;
  /** Determines whether requests to the system access point will use TLS. */
  public readonly tlsEnabled: boolean;
  private verboseErrors: boolean;
  private webSocket?: WebSocket;
  private readonly webSocketMessageSubject = new Subject<WebSocketMessage>();

  /**
   * Constructs a new SystemAccessPoint instance
   *
   * @constructor
   * @param hostName The system access point host name.
   * @param userName The user name that shall be used to authenticate with the system access point.
   * @param password The password that shall be used to authenticate with the system access point.
   * @param tlsEnabled Determines whether the communication with the system access point shall be protected by TLS. Defaults to true
   * @param verboseErrors Determines whether verbose error messages shall be used, for example for message validation. Defaults to false.
   */
  constructor(
    hostName: string,
    userName: string,
    password: string,
    tlsEnabled = true,
    verboseErrors = false
  ) {
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
   *
   * @function
   * @param certificateVerification Determines whether the TLS certificate presented by the server will be verified.
   */
  public connectWebSocket(certificateVerification = true): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      throw new Error("Web socket is already connected");
    }

    this.webSocket = this.createWebSocket(certificateVerification);
  }

  /**
   * Creates a new virtual device.
   * @param sysApUuid The UUID identifying the system access point
   * @param deviceSerial The serial number to be assigned to the device.
   * @param virtualDevice The virtual device to be created.
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
    return await this.processRestResponse(response, isVirtualDeviceResponse);
  }

  private createWebSocket(certificateVerification: boolean): WebSocket {
    // Disabling certificate verification is discouraged, issue a warning
    if (this.tlsEnabled && !certificateVerification) {
      console.warn(
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
    webSocket.on("error", (error: Error) =>
      console.error("Error received", error)
    );
    webSocket.on("ping", (data: Buffer) =>
      console.debug("Ping received", data.toString("ascii"))
    );
    webSocket.on("pong", (data: Buffer) =>
      console.debug("Pong received", data.toString("ascii"))
    );
    webSocket.on("unexpected-response", () =>
      console.error("Unexpected response received")
    );
    webSocket.on("upgrade", () => console.debug("Upgrade request received"));
    webSocket.on("open", () => console.log("Connection opened"));
    webSocket.on("close", () => console.log("Connection closed"));
    webSocket.on("message", (data: RawData, isBinary: boolean) =>
      this.processWebSocketMessage(data, isBinary)
    );
    return webSocket;
  }

  /**
   * Disconnects from the System Access Point web socket.
   *
   * @function
   * @param force Determines whether or not the connection will be closed forcibly
   */
  public disconnectWebSocket(force = false): void {
    if (!this.webSocket || this.webSocket.readyState === WebSocket.CLOSED) {
      throw new Error("Web socket is not open");
    }

    if (force) {
      this.webSocket.terminate();
    } else {
      this.webSocket.close();
    }
  }

  /**
   * Gets the configuration from the system access point
   * @returns The @see Configuration
   */
  public async getConfiguration(): Promise<Configuration> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest(
      "GET",
      "configuration"
    );

    // Process response
    return await this.processRestResponse(response, isConfiguration);
  }

  /**
   * Gets the device list from the system access point.
   * @returns The @see DeviceList
   */
  public async getDeviceList(): Promise<DeviceList> {
    // Get response from system access point
    const response: Response = await this.fetchDataViaRest("GET", "devicelist");

    // Process response
    return await this.processRestResponse(response, isDeviceList);
  }

  /**
   * Gets the specified device from the system access point
   * @param sysApUuid The UUID identifying the system access point
   * @param deviceSerial The device serial number
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
    return await this.processRestResponse(response, isDeviceResponse);
  }

  /**
   * Gets the specified data point from the system access point.
   * @param sysApUuid The UUID idenfifying the system access point
   * @param deviceSerial The device serial number
   * @param channel The channel identifier
   * @param dataPoint The datapoint identifier
   * @returns The requested @see GetDataPointResponse
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
    return await this.processRestResponse(response, isGetDataPointResponse);
  }

  /**
   * Gets the web socket messages.
   *
   * @returns An observable that is updated with the messages received from the web socket.
   */
  public getWebSocketMessages(): Observable<WebSocketMessage> {
    return this.webSocketMessageSubject.asObservable();
  }
  /**
   * Sets a new value for the specificed data point.
   * @param sysApUuid The UUID idenfifying the system access point
   * @param deviceSerial The device serial number
   * @param channel The channel identifier
   * @param dataPoint The datapoint identifier
   * @param value The new value to be set
   * @returns A @see SetDataPointResponse describing the result of the operation
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
    return await this.processRestResponse(response, isSetDataPointResponse);
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
    return await fetch(info, init);
  }

  private async processRestResponse<TResponse>(
    response: Response,
    typeGuard: (obj: unknown, verbose: boolean) => obj is TResponse
  ): Promise<TResponse> {
    let body: unknown;
    let message: string;

    // Process response
    switch (response.status) {
      case 200:
        body = await response.json();
        if (!typeGuard(body, this.verboseErrors)) {
          message = "Received message has an unexpected type!";
          console.error(message, body);
          throw new Error(message);
        }

        return body;
      case 401:
        message = "Authentication information is missing or invalid.";
        console.error(message);
        throw new Error(message);
      case 502:
        message = await response.text();
        console.error(message);
        throw new Error(message);
      default:
        message = `Received HTTP ${
          response.status
        } status code unexpectedly: ${await response.text()}`;
        console.error(message);
        throw new Error(message);
    }
  }

  private processWebSocketMessage(data: RawData, isBinary: boolean): void {
    // Do not process binary messages
    if (isBinary) {
      console.warn(
        "Binary message received. Binary messages are not processed."
      );
      return;
    }

    console.debug("Message received");
    /*
     * Deserialize the message.
     * The message is expected to be deserializable as a web socket message.
     * If that is not the case, that's an error case.
     */
    const serialized = data.toString();
    const message: unknown = JSON.parse(serialized);

    if (isWebSocketMessage(message, this.verboseErrors)) {
      this.webSocketMessageSubject.next(message);
      return;
    }

    console.error("Received message has an unexpected type!", serialized);
  }
}
