import { iface, indexKey, ITypeSuite } from "ts-interface-checker";

const VirtualDeviceResponse = iface([], {
  [indexKey]: iface([], {
    devices: iface([], {
      [indexKey]: iface([], {
        serial: "string",
      }),
    }),
  }),
});

export const VirtualDeviceResponseTypeSuite: ITypeSuite = {
  VirtualDeviceResponse,
};
