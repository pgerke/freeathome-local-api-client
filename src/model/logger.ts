/** Describes the interface a logger has to provide to be usable for the library. */
export interface Logger {
  /**
   * Logs a debug message.
   * @param message The message to be logged.
   * @param optionalParams An optional array of parameters to be included in the log entry.   *
   */
  debug: (message?: unknown, ...optionalParams: unknown[]) => void;

  /**
   * Logs a error message.
   * @param message The message to be logged.
   * @param optionalParams An optional array of parameters to be included in the log entry.   *
   */
  error: (message?: unknown, ...optionalParams: unknown[]) => void;
  /**
   * Logs a informational message.
   * @param message The message to be logged.
   * @param optionalParams An optional array of parameters to be included in the log entry.   *
   */
  log: (message?: unknown, ...optionalParams: unknown[]) => void;

  /**
   * Logs a warning message.
   * @param message The message to be logged.
   * @param optionalParams An optional array of parameters to be included in the log entry.   *
   */
  warn: (message?: unknown, ...optionalParams: unknown[]) => void;
}
