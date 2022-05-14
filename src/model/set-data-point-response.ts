/** Describes a response to a request setting a new value for a data point. */
export interface SetDataPointResponse {
  /** The response to the data point request for the system access point identified by the key. */
  [key: string]: {
    /** The response to the requested datra point identified by the key. */
    [key: string]: string;
  };
}
