import type { ITypeSuite } from "ts-interface-checker";
import { iface, indexKey } from "ts-interface-checker";

const Devices = iface([], {
  [indexKey]: "Device",
});

export const DevicesTypeSuite: ITypeSuite = {
  Devices,
};
