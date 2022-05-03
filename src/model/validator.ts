import ChannelTI from "./channel-ti";
import DeviceTI from "./device-ti";
import DevicesTI from "./devices-ti";
import InOutPutTI from "./in-out-put-ti";
import ScenesTriggeredTI from "./scenes-triggered-ti";
import WebSocketMessageTI from "./websocket-message-ti";
import { WebSocketMessage as Message } from "./websocket-message";
import { createCheckers } from "ts-interface-checker";

const { WebSocketMessage } = createCheckers(
  WebSocketMessageTI,
  DevicesTI,
  DeviceTI,
  ChannelTI,
  InOutPutTI,
  ScenesTriggeredTI
);

export function isWebSocketMessage(obj: unknown): obj is Message {
  return WebSocketMessage.test(obj);
}
