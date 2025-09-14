import type { ITypeSuite } from "ts-interface-checker";
import { iface, opt } from "ts-interface-checker";

const SysAP = iface([], {
  devices: "Devices",
  floorplan: iface([], {
    floors: "Floors",
  }),
  sysapName: "string",
  users: "Users",
  error: opt("Error"),
});

export const SysApTypeSuite: ITypeSuite = {
  SysAP,
};
