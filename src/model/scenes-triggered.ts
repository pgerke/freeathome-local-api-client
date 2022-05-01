/**
 * Describes the ScenesTriggered object that is included in the @see WebSocketMessage.
 *
 * @interface
 */
export interface ScenesTriggered {
  [key: string]: {
    channels: {
      [key: string]: {
        outputs: {
          [key: string]: {
            value: string;
            pairingID: number;
          };
        };
      };
    };
  };
}
