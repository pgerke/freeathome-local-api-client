import { array, iface, indexKey, ITypeSuite } from "ts-interface-checker";

const DeviceList = iface([], {
  [indexKey]: array("string"),
});

export const DeviceListTypeSuite: ITypeSuite = {
  DeviceList,
};
