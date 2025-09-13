import type { ITypeSuite } from "ts-interface-checker";
import { iface, indexKey } from "ts-interface-checker";

const Configuration = iface([], {
  [indexKey]: "SysAP",
});

export const ConfigurationTypeSuite: ITypeSuite = {
  Configuration,
};
