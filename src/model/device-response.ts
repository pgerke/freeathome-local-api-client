import { type Devices } from "./devices";

/** Describes the response to a device request. */
export interface DeviceResponse {
  /**
   * The requested devices connected to the system access point identified by the key.
   */
  [key: string]: {
    devices: Devices;
  };
}
