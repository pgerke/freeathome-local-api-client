import type { ITypeSuite } from "ts-interface-checker";
import { iface, indexKey } from "ts-interface-checker";

const SetDataPointResponse = iface([], {
  [indexKey]: iface([], {
    [indexKey]: "string",
  }),
});

export const SetDataPointResponseTypeSuite: ITypeSuite = {
  SetDataPointResponse,
};
