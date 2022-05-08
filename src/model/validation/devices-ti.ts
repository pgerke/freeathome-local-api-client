import { iface, indexKey, ITypeSuite } from "ts-interface-checker";

const Devices = iface([], {
  [indexKey]: "Device",
});

export const DevicesTypeSuite: ITypeSuite = {
  Devices,
};
