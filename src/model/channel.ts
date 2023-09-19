import { InOutPut } from "./in-out-put";

/** Describes a device channel */
export interface Channel {
  /** The channel display name. */
  displayName?: string;
  /** The function identifier. */
  functionID?: string;
  /** The room to which the channel is mapped. */
  room?: string;
  /** The floor to which the channel is mapped.  */
  floor?: string;
  /** The inputs provided by the channel. */
  inputs?: {
    /** The input identified by a string key. */
    [key: string]: InOutPut;
  };
  /** The output provided by the channel. */
  outputs?: {
    /** The output identified by a string key. */
    [key: string]: InOutPut;
  };
  /** The channel parameters. */
  parameters?: {
    /** The channel parameters identified by a string key. */
    [key: string]: string;
  };
  /** The channel type. */
  type?: string;
}
