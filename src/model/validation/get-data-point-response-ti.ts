import { array, iface, indexKey, ITypeSuite } from "ts-interface-checker";

const GetDataPointResponse = iface([], {
  [indexKey]: iface([], {
    values: array("string"),
  }),
});

export const GetDataPointResponseTypeSuite: ITypeSuite = {
  GetDataPointResponse,
};
