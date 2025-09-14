import { type Devices } from "./devices";
import { type ScenesTriggered } from "./scenes-triggered";

/**
 * Represents a message that was received from the System Access Point web socket.
 */
export interface WebSocketMessage {
  /** The update message for the system access point identified by the key. */
  [key: string]: {
    /** The data points. */
    datapoints: {
      /** The value of the data point identified by the key. */
      [key: string]: string;
    };
    /** The devices. */
    devices: Devices;
    /** The array of device serials representing the devices added to the system access point. */
    devicesAdded: Array<string>;
    /** The array of device serials representing the devices removed from the system access point. */
    devicesRemoved: Array<string>;
    /** The triggered scenes. */
    scenesTriggered: ScenesTriggered;
    /** The message parameters. */
    parameters?: {
      [key: string]: string;
    };
  };
}
