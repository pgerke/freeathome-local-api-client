/**
 * Describes a system access point device list.
 *
 * @interface
 */
export interface DeviceList {
  [key: string]: {
    deviceSerialNumber: Array<string>;
  };
}
