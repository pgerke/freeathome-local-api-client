import { iface, indexKey, ITypeSuite } from "ts-interface-checker";

const DeviceResponse = iface([], {
  [indexKey]: iface([], {
    devices: "Devices",
  }),
});

export const DeviceResponseTypeSuite: ITypeSuite = {
  DeviceResponse,
};
