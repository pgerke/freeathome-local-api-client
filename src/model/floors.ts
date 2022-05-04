import { Rooms } from "./rooms";

/**
 * Describes the floor collection
 *
 * @interface
 */
export interface Floors {
  [key: string]: {
    name: string;
    rooms: Rooms;
  };
}
