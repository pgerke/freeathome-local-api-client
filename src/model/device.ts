import { type Channel } from "./channel";

/** Describes a device */
export interface Device {
  /** The device display name */
  displayName?: string;
  /** The room to which the device is mapped. */
  room?: string;
  /** The floor to which the device is mapped. */
  floor?: string;
  /** The device interface. */
  interface?: string;
  /** The device's native identifier. */
  nativeId?: string;
  /** The channels provided by the device. */
  channels?: {
    /** The channel identified by a string key. */
    [key: string]: Channel;
  };
  /** The device parameters. */
  parameters?: {
    /** The parameter identified by a string key. */
    [key: string]: string;
  };
}
