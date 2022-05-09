import { iface, indexKey, ITypeSuite } from "ts-interface-checker";

const SetDataPointResponse = iface([], {
  [indexKey]: iface([], {
    [indexKey]: "string",
  }),
});

export const SetDataPointResponseTypeSuite: ITypeSuite = {
  SetDataPointResponse,
};
