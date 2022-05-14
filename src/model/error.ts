/** Describes an error. */
export interface Error {
  /**
   * The error code
   * @example "2010"
   */
  code: string;
  /**
   * A detailed message describing the error
   * @example "FreeAtHome connection timeout"
   */
  detail: string;
  /**
   * The title for the error
   * @example "Connection Error"
   */
  title: string;
}
