import { array, iface, indexKey, ITypeSuite } from "ts-interface-checker";

const WebSocketMessage = iface([], {
  [indexKey]: iface([], {
    datapoints: iface([], {
      [indexKey]: "string",
    }),
    devices: iface([], {
      [indexKey]: "Devices",
    }),
    devicesAdded: array("string"),
    devicesRemoved: array("string"),
    scenesTriggered: "ScenesTriggered",
  }),
});

export const WebSocketMessageTypeSuite: ITypeSuite = {
  WebSocketMessage,
};
