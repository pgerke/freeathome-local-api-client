import { iface, indexKey, ITypeSuite } from "ts-interface-checker";

const Rooms = iface([], {
  [indexKey]: iface([], {
    name: "string",
  }),
});

export const RoomsTypeSuite: ITypeSuite = {
  Rooms,
};
