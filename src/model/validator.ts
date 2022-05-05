import ChannelTI from "./channel-ti";
import ConfigurationTI from "./configuration-ti";
import DeviceTI from "./device-ti";
import DevicesTI from "./devices-ti";
import DeviceListTI from "./device-list-ti";
import DeviceResponseTI from "./device-response-ti";
import ErrorTI from "./error-ti";
import FloorsTI from "./floors-ti";
import InOutPutTI from "./in-out-put-ti";
import RoomsTI from "./rooms-ti";
import ScenesTriggeredTI from "./scenes-triggered-ti";
import SysAPTI from "./sys-ap-ti";
import UsersTI from "./users-ti";
import WebSocketMessageTI from "./websocket-message-ti";
import { WebSocketMessage as Message } from "./websocket-message";
import { Configuration as Config } from "./configuration";
import { DeviceList as DevList } from "./device-list";
import { DeviceResponse as DevResponse } from "./device-response";
import { createCheckers } from "ts-interface-checker";

const { Configuration } = createCheckers(
  ConfigurationTI,
  DevicesTI,
  DeviceTI,
  ChannelTI,
  InOutPutTI,
  FloorsTI,
  RoomsTI,
  SysAPTI,
  UsersTI,
  ErrorTI
);

const { DeviceList } = createCheckers(DeviceListTI);

const { DeviceResponse } = createCheckers(
  DeviceResponseTI,
  DevicesTI,
  DeviceTI,
  ChannelTI,
  InOutPutTI
);

const { WebSocketMessage } = createCheckers(
  WebSocketMessageTI,
  DevicesTI,
  DeviceTI,
  ChannelTI,
  InOutPutTI,
  ScenesTriggeredTI
);

/**
 * Determines whether the specified object is a web socket message.
 * @param obj The object to be tested
 * @returns A boolean value indicating whether the specified object is a @see Message.
 */
export function isWebSocketMessage(obj: unknown): obj is Message {
  return WebSocketMessage.test(obj);
}

/**
 * Determines whether the specified object is a configuration.
 * @param obj The object to be tested
 * @returns A boolean value indicating whether the specified object is a @see Config.
 */
export function isConfiguration(obj: unknown): obj is Config {
  return Configuration.test(obj);
}

/**
 * Determines whether the specified object is a device list.
 * @param obj The object to be tested
 * @returns A boolean value indicating whether the specified object is a @see DevList.
 */
export function isDeviceList(obj: unknown): obj is DevList {
  return DeviceList.test(obj);
}

/**
 * Determines whether the specified object is a device response.
 * @param obj The object to be tested
 * @returns A boolean value indicating whether the specified object is a @see DevResponse.
 */
export function isDeviceResponse(obj: unknown): obj is DevResponse {
  return DeviceResponse.test(obj);
}
