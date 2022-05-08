import { Devices } from "./devices";
import { ScenesTriggered } from "./scenes-triggered";

/**
 * Represents a message that was received from the System Access Point web socket.
 *
 * @interface
 */
export interface WebSocketMessage {
  [key: string]: {
    datapoints: {
      [key: string]: string;
    };
    devices: {
      [key: string]: Devices;
    };
    devicesAdded: Array<string>;
    devicesRemoved: Array<string>;
    scenesTriggeres: ScenesTriggered;
  };
}
