import { type Rooms } from "./rooms";

/** Describes the floor collection. */
export interface Floors {
  /** The floor identified by the key. */
  [key: string]: {
    /** The floor name. */
    name: string;
    /** The rooms on the floor. */
    rooms: Rooms;
  };
}
