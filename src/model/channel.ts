import { InOutPut } from "./in-out-put";

/**
 * Describes a device channel
 *
 * @interface
 */
export interface Channel {
  displayName?: string;
  functionID?: string;
  room?: string;
  floor?: string;
  inputs?: {
    [key: string]: InOutPut;
  };
  outputs?: {
    [key: string]: InOutPut;
  };
  type?: string;
}
