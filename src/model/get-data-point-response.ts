/** Describes the response to a query requesting a data point. */
export interface GetDataPointResponse {
  /** The response to the data points requested by the system access point identified by the key. */
  [key: string]: {
    /** The array of responses. */
    values: Array<string>;
  };
}
