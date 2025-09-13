import type { ITypeSuite } from "ts-interface-checker";
import { iface, indexKey } from "ts-interface-checker";

const Rooms = iface([], {
  [indexKey]: iface([], {
    name: "string",
  }),
});

export const RoomsTypeSuite: ITypeSuite = {
  Rooms,
};
