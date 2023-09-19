import { array, iface, indexKey, ITypeSuite, opt } from "ts-interface-checker";

const WebSocketMessage = iface([], {
  [indexKey]: iface([], {
    datapoints: iface([], {
      [indexKey]: "string",
    }),
    devices: "Devices",
    devicesAdded: array("string"),
    devicesRemoved: array("string"),
    scenesTriggered: "ScenesTriggered",
    parameters: opt(
      iface([], {
        [indexKey]: "string",
      })
    ),
  }),
});

export const WebSocketMessageTypeSuite: ITypeSuite = {
  WebSocketMessage,
};
