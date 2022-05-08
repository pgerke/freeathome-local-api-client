/**
 * Describes a response to a request setting a new value for a data point.
 *
 * @interface
 */
export interface SetDataPointResponse {
  [key: string]: {
    [key: string]: string;
  };
}
