import { Observable, Subject } from "rxjs";
import { ClientOptions, RawData, WebSocket } from "ws";
import { WebSocketMessage } from "./model";

/**
 * The class representing a System Access Point.
 *
 * @class
 */
export class SystemAccessPoint {
  private readonly basicAuthKey: string;
  private readonly hostName: string;
  /** Determines whether requests to the system access point will use TLS. */
  public readonly tlsEnabled: boolean;
  private webSocket?: WebSocket;
  private readonly webSocketMessageSubject = new Subject<WebSocketMessage>();
  private verifyCertificate: boolean;

  /**
   * Constructs a new SystemAccessPoint instance
   */
  constructor(
    hostName: string,
    userName: string,
    password: string,
    tlsEnabled = true,
    verifyCertificate = true
  ) {
    // Create Basic Authentication key
    this.basicAuthKey = Buffer.from(`${userName}:${password}`, "utf8").toString(
      "base64"
    );
    this.hostName = hostName;
    this.tlsEnabled = tlsEnabled;
    this.verifyCertificate = verifyCertificate;
    if (!verifyCertificate) {
      console.warn(
        "TLS Certificate verification is disabled! This poses a security risk, activating certificate verification is strictly recommended."
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
      rejectUnauthorized: this.verifyCertificate,
      headers: {
        Authorization: `Basic ${this.basicAuthKey}`,
      },
    };
    const webSocket = new WebSocket(url, options);
    webSocket.on("open", () => {
      console.log("Connection opened");
    });
    webSocket.on("close", () => console.log("Connection closed"));
    webSocket.on("message", (data: RawData, isBinary: boolean) => {
      if (isBinary) {
        console.log("--- Binary Data --- ");
        return;
      }

      const serialized = data.toString();
      const message = JSON.parse(serialized) as WebSocketMessage;
      if (!message) {
        console.error(
          "Web Socket Message could not be deserialized!",
          serialized
        );
        return;
      }
      this.webSocketMessageSubject.next(message);
    });

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
}
