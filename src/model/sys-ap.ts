import { Devices } from "./devices";
import { Floors } from "./floors";
import { Users } from "./users";

/**
 * Describes a system access point
 *
 * @interface
 */
export interface SysAP {
  devices: Devices;
  floorplan: { floors: Floors };
  sysapName: string;
  users: Users;
  error?: Error;
}
