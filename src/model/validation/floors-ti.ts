import { iface, indexKey, ITypeSuite } from "ts-interface-checker";

const Floors = iface([], {
  [indexKey]: iface([], {
    name: "string",
    rooms: "Rooms",
  }),
});

export const FloorsTypeSuite: ITypeSuite = {
  Floors,
};
