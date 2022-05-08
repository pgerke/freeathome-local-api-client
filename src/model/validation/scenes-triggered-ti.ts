import { iface, indexKey, ITypeSuite } from "ts-interface-checker";

const ScenesTriggered = iface([], {
  [indexKey]: iface([], {
    channels: iface([], {
      [indexKey]: iface([], {
        outputs: iface([], {
          [indexKey]: iface([], {
            value: "string",
            pairingID: "number",
          }),
        }),
      }),
    }),
  }),
});

export const ScenesTriggeredTypeSuite: ITypeSuite = {
  ScenesTriggered,
};
