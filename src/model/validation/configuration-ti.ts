import { iface, indexKey, ITypeSuite } from "ts-interface-checker";

const Configuration = iface([], {
  [indexKey]: "SysAP",
});

export const ConfigurationTypeSuite: ITypeSuite = {
  Configuration,
};
