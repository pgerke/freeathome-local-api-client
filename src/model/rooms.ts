/** Describes the rooms collection. */
export interface Rooms {
  /** The room names on the floor identified by the key. */
  [key: string]: {
    /** The room name. */
    name: string;
  };
}
