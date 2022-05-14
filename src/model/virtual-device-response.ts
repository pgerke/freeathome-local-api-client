/** Describes a response to a request creating a new virtual device. */
export interface VirtualDeviceResponse {
  /** The response to a virtual device request for the system access point identified by the key. */
  [key: string]: {
    /** The devices */
    devices: {
      /** The created device identified by the key. */
      [key: string]: {
        /** The device serial. */
        serial: string;
      };
    };
  };
}
