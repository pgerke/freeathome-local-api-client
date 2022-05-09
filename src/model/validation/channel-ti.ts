import { ITypeSuite, iface, indexKey, opt } from "ts-interface-checker";

const Channel = iface([], {
  displayName: opt("string"),
  functionID: opt("string"),
  room: opt("string"),
  floor: opt("string"),
  inputs: opt(
    iface([], {
      [indexKey]: "InOutPut",
    })
  ),
  outputs: opt(
    iface([], {
      [indexKey]: "InOutPut",
    })
  ),
  type: opt("string"),
});

export const ChannelTypeSuite: ITypeSuite = {
  Channel,
};
