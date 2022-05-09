/**
 * Describes a response to a request creating a new virtual device.
 *
 * @interface
 */
export interface VirtualDeviceResponse {
  [key: string]: {
    devices: {
      [key: string]: {
        serial: string;
      };
    };
  };
}
