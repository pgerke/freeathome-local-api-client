import { iface, indexKey, opt, ITypeSuite } from "ts-interface-checker";

const Device = iface([], {
  displayName: opt("string"),
  room: opt("string"),
  floor: opt("string"),
  interface: opt("string"),
  nativeId: opt("string"),
  channels: opt(
    iface([], {
      [indexKey]: "Channel",
    })
  ),
});

export const DeviceTypeSuite: ITypeSuite = {
  Device,
};
