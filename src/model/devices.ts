import { Device } from "./device";

/** Describes a list of Devices identified by their serial. */
export interface Devices {
  /**
   * The device connected to the system access point identified by the key.
   */
  [key: string]: Device;
}
