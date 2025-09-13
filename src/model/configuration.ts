import { type SysAP } from "./sys-ap";

/** Describes system access point configurations. */
export interface Configuration {
  /** The system access point identified by it's UUID. */
  [key: string]: SysAP;
}
