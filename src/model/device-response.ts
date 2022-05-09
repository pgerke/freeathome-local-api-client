import { Devices } from "./devices";

/**
 * Describes the response to a device request
 *
 * @interface
 */
export interface DeviceResponse {
  [key: string]: {
    devices: Devices;
  };
}
