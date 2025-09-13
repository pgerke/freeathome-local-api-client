import type { ITypeSuite } from "ts-interface-checker";
import { iface, indexKey, opt } from "ts-interface-checker";

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
  parameters: opt(
    iface([], {
      [indexKey]: "string",
    })
  ),
});

export const DeviceTypeSuite: ITypeSuite = {
  Device,
};
