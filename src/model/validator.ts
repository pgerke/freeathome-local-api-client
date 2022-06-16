import {
  ChannelTypeSuite,
  DeviceTypeSuite,
  DevicesTypeSuite,
  InOutPutTypeSuite,
  ScenesTriggeredTypeSuite,
  WebSocketMessageTypeSuite,
  DeviceListTypeSuite,
  SetDataPointResponseTypeSuite,
  GetDataPointResponseTypeSuite,
  ConfigurationTypeSuite,
  FloorsTypeSuite,
  RoomsTypeSuite,
  SysApTypeSuite,
  UsersTypeSuite,
  ErrorTypeSuite,
  DeviceResponseTypeSuite,
  VirtualDeviceResponseTypeSuite,
} from "./validation";
import { Checker, createCheckers } from "ts-interface-checker";
import { WebSocketMessage as Message } from "./websocket-message";
import { Configuration as Config } from "./configuration";
import { Channel as Chan } from "./channel";
import { Device as Dev } from "./device";
import { DeviceList as DevList } from "./device-list";
import { DeviceResponse as DevResponse } from "./device-response";
import { GetDataPointResponse as GetResponse } from "./get-data-point-response";
import { SetDataPointResponse as SetResponse } from "./set-data-point-response";
import { VirtualDeviceResponse as VDeviceResponse } from "./virtual-device-response";
import { Logger } from "./logger";

const { Channel } = createCheckers(ChannelTypeSuite, InOutPutTypeSuite);

const { Configuration } = createCheckers(
  ConfigurationTypeSuite,
  DevicesTypeSuite,
  DeviceTypeSuite,
  ChannelTypeSuite,
  InOutPutTypeSuite,
  FloorsTypeSuite,
  RoomsTypeSuite,
  SysApTypeSuite,
  UsersTypeSuite,
  ErrorTypeSuite
);

const { Device } = createCheckers(
  DeviceTypeSuite,
  ChannelTypeSuite,
  InOutPutTypeSuite
);

const { DeviceList } = createCheckers(DeviceListTypeSuite);

const { DeviceResponse } = createCheckers(
  DeviceResponseTypeSuite,
  DevicesTypeSuite,
  DeviceTypeSuite,
  ChannelTypeSuite,
  InOutPutTypeSuite
);

const { GetDataPointResponse } = createCheckers(GetDataPointResponseTypeSuite);

const { SetDataPointResponse } = createCheckers(SetDataPointResponseTypeSuite);

const { VirtualDeviceResponse } = createCheckers(
  VirtualDeviceResponseTypeSuite
);

const { WebSocketMessage } = createCheckers(
  WebSocketMessageTypeSuite,
  DevicesTypeSuite,
  DeviceTypeSuite,
  ChannelTypeSuite,
  InOutPutTypeSuite,
  ScenesTriggeredTypeSuite
);

function check(
  obj: unknown,
  checker: Checker,
  logger: Logger,
  verbose: boolean
): boolean {
  if (verbose) {
    try {
      checker.check(obj);
      return true;
    } catch (error) {
      logger.error("Object validation failed!", error);
      return false;
    }
  }

  return checker.test(obj);
}

/**
 * Determines whether the specified object is a web socket message.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a web socket message.
 */
export function isWebSocketMessage(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is Message {
  return check(obj, WebSocketMessage, logger, verbose);
}

/**
 * Determines whether the specified object is a configuration.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a configuration.
 */
export function isConfiguration(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is Config {
  return check(obj, Configuration, logger, verbose);
}

/**
 * Determines whether the specified object is a device list.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a device list.
 */
export function isDeviceList(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is DevList {
  return check(obj, DeviceList, logger, verbose);
}

/**
 * Determines whether the specified object is a device response.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a device response.
 */
export function isDeviceResponse(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is DevResponse {
  return check(obj, DeviceResponse, logger, verbose);
}

/**
 * Determines whether the specified object is a valid response to a get data point request.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a response to a get data point request.
 */
export function isGetDataPointResponse(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is GetResponse {
  return check(obj, GetDataPointResponse, logger, verbose);
}

/**
 * Determines whether the specified object is a valid response to a set data point request.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a response to a set data point request.
 */
export function isSetDataPointResponse(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is SetResponse {
  return check(obj, SetDataPointResponse, logger, verbose);
}

/**
 * Determines whether the specified object is a virtual device response.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a response to a virtual device request.
 */
export function isVirtualDeviceResponse(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is VDeviceResponse {
  return check(obj, VirtualDeviceResponse, logger, verbose);
}

/**
 * Determines whether the specified object is a channel.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a channel.
 */
export function isChannel(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is Chan {
  return check(obj, Channel, logger, verbose);
}

/**
 * Determines whether the specified object is a device.
 * @param obj {object} The object to be tested
 * @param logger {Logger} The logger instance to be used.
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a device.
 */
export function isDevice(
  obj: unknown,
  logger: Logger,
  verbose = false
): obj is Dev {
  return check(obj, Device, logger, verbose);
}
