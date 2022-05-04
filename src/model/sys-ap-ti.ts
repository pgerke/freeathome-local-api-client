/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const SysAP = t.iface([], {
  devices: "Devices",
  floorplan: t.iface([], {
    floors: "Floors",
  }),
  sysapName: "string",
  users: "Users",
  error: t.opt("Error"),
});

const exportedTypeSuite: t.ITypeSuite = {
  SysAP,
};
export default exportedTypeSuite;
