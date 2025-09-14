import { type Devices } from "./devices";
import { type Floors } from "./floors";
import { type Users } from "./users";

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
