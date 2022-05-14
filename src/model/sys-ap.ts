import { Devices } from "./devices";
import { Floors } from "./floors";
import { Users } from "./users";

/** Describes a system access point. */
export interface SysAP {
  /** The devices connected to the system access point. */
  devices: Devices;
  /** The floorplan */
  floorplan: { floors: Floors };
  /** The name of the system access point. */
  sysapName: string;
  /** The users. */
  users: Users;
  /** An error, if an error is available for the system access point. */
  error?: Error;
}
