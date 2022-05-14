/**
 * Describes a system access point device list.
 * @interface
 */
export interface DeviceList {
  /**
   * An array of the device serials connected to the system access point identified by the key.
   */
  [key: string]: Array<string>;
}
