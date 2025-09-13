import type { ITypeSuite } from "ts-interface-checker";
import { iface, indexKey } from "ts-interface-checker";

const DeviceResponse = iface([], {
  [indexKey]: iface([], {
    devices: "Devices",
  }),
});

export const DeviceResponseTypeSuite: ITypeSuite = {
  DeviceResponse,
};
