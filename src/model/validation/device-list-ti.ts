import type { ITypeSuite } from "ts-interface-checker";
import { array, iface, indexKey } from "ts-interface-checker";

const DeviceList = iface([], {
  [indexKey]: array("string"),
});

export const DeviceListTypeSuite: ITypeSuite = {
  DeviceList,
};
