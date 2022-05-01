import { Device } from "./device";

/**
 * Describes a list of Devices identified by their serial.
 *
 * @interface
 */
export interface Devices {
  [key: string]: Device;
}
