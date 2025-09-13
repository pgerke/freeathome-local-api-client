import type { ITypeSuite } from "ts-interface-checker";
import { iface, indexKey } from "ts-interface-checker";

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
