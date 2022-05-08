import { iface, opt, ITypeSuite } from "ts-interface-checker";

const InOutPut = iface([], {
  value: opt("string"),
  pairingID: opt("number"),
});

export const InOutPutTypeSuite: ITypeSuite = {
  InOutPut,
};
