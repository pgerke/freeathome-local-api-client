/**
 * Describes the ScenesTriggered object that is included in the web socket message.
 * @see WebSocketMessage
 */
export interface ScenesTriggered {
  /** The channels affected by the scene identified by the key. */
  [key: string]: {
    /** The channel */
    channels: {
      /** The outputs affected by the channel identified by the key. */
      [key: string]: {
        /** The outputs */
        outputs: {
          /** The output value and pairing ID affected by the output identified by the key. */
          [key: string]: {
            /** The output value. */
            value: string;
            /** The pairing ID. */
            pairingID: number;
          };
        };
      };
    };
  };
}
