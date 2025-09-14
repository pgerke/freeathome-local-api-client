import type { ITypeSuite } from "ts-interface-checker";
import { array, iface, indexKey } from "ts-interface-checker";

const GetDataPointResponse = iface([], {
  [indexKey]: iface([], {
    values: array("string"),
  }),
});

export const GetDataPointResponseTypeSuite: ITypeSuite = {
  GetDataPointResponse,
};
