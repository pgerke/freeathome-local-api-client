import { Channel } from "./channel";

/**
 * Describes a device
 *
 * @interface
 */
export interface Device {
  displayName?: string;
  room?: string;
  floor?: string;
  interface?: string;
  nativeId?: string;
  channels?: {
    [key: string]: Channel;
  };
}
