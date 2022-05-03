import { Observable, Subject } from "rxjs";
import { ClientOptions, RawData, WebSocket } from "ws";
import { isWebSocketMessage } from "./model/validator";
import { WebSocketMessage } from "./model";

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
  private webSocket?: WebSocket;
  private readonly webSocketMessageSubject = new Subject<WebSocketMessage>();
  /** Determines whether the TLS certificate will be verified. */
  public readonly certificateVerification: boolean;

  /**
   * Constructs a new SystemAccessPoint instance
   */
  constructor(
    hostName: string,
    userName: string,
    password: string,
    tlsEnabled = true,
    certificateVerification = true
  ) {
    // Create Basic Authentication key
    this.basicAuthKey = Buffer.from(`${userName}:${password}`, "utf8").toString(
      "base64"
    );
    this.hostName = hostName;
    this.tlsEnabled = tlsEnabled;
    this.certificateVerification = certificateVerification;

    // Disabling certificate verification is discouraged, issue a warning
    if (tlsEnabled && !certificateVerification) {
      console.warn(
        "TLS certificate verification is disabled! This poses a security risk, activating certificate verification is strictly recommended."
      );
    }
  }

  /**
   * Connects to the System Access Point web socket.
   *
   * @function
   */
  public connectWebSocket(): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      throw new Error("Web socket is already connected");
    }

    this.webSocket = this.createWebSocket();
  }

  private createWebSocket(): WebSocket {
    const url = `${this.tlsEnabled ? "wss" : "ws"}://${
      this.hostName
    }/fhapi/v1/api/ws`;
    const options: ClientOptions = {
      rejectUnauthorized: this.tlsEnabled && this.certificateVerification,
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

  // public getConfiguration() {}
  // public getDeviceList() {}
  // public getDevice(sysApUuid, deviceSerial) {}
  // public getDatapoint(sysApUuid, deviceSerial, channel, dataPoint) {}

  /**
   * Gets the web socket messages.
   *
   * @returns An observable that is updated with the messages received from the web socket.
   */
  public getWebSocketMessages(): Observable<WebSocketMessage> {
    return this.webSocketMessageSubject.asObservable();
  }
  // public setDatapoint(sysApUuid, deviceSerial, channel, dataPoint) {}

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

    if (isWebSocketMessage(message)) {
      this.webSocketMessageSubject.next(message);
      return;
    }

    console.error("Received message has an unexpected type!", serialized);
  }
}
