import { iface, ITypeSuite } from "ts-interface-checker";

const Error = iface([], {
  code: "string",
  detail: "string",
  title: "string",
});

export const ErrorTypeSuite: ITypeSuite = {
  Error,
};
