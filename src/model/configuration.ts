import { SysAP } from "./sys-ap";

/**
 * Describes a system access point configuration
 *
 * @interface
 */
export interface Configuration {
  [key: string]: SysAP;
}
