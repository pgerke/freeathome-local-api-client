import type { ITypeSuite } from "ts-interface-checker";
import { array, iface, indexKey } from "ts-interface-checker";

const Users = iface([], {
  [indexKey]: iface([], {
    enabled: "boolean",
    flags: array("string"),
    grantedPermissions: array("string"),
    jid: "string",
    name: "string",
    requestedPermissions: array("string"),
    role: "string",
  }),
});

export const UsersTypeSuite: ITypeSuite = {
  Users,
};
