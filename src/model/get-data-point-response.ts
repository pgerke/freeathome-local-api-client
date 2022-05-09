/**
 * Describes the response to a query requesting a data point
 *
 * @interface
 */
export interface GetDataPointResponse {
  [key: string]: {
    values: Array<string>;
  };
}
