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
import { DeviceList as DevList } from "./device-list";
import { DeviceResponse as DevResponse } from "./device-response";
import { GetDataPointResponse as GetResponse } from "./get-data-point-response";
import { SetDataPointResponse as SetResponse } from "./set-data-point-response";
import { VirtualDeviceResponse as VDeviceResponse } from "./virtual-device-response";

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

function check(obj: unknown, checker: Checker, verbose: boolean): boolean {
  if (verbose) {
    try {
      checker.check(obj);
      return true;
    } catch (error) {
      console.error("Object validation failed!", error);
      return false;
    }
  }

  return checker.test(obj);
}

/**
 * Determines whether the specified object is a web socket message.
 * @param obj {object} The object to be tested
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a web socket message.
 */
export function isWebSocketMessage(
  obj: unknown,
  verbose = false
): obj is Message {
  return check(obj, WebSocketMessage, verbose);
}

/**
 * Determines whether the specified object is a configuration.
 * @param obj {object} The object to be tested
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a configuration.
 */
export function isConfiguration(obj: unknown, verbose = false): obj is Config {
  return check(obj, Configuration, verbose);
}

/**
 * Determines whether the specified object is a device list.
 * @param obj {object} The object to be tested
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a device list.
 */
export function isDeviceList(obj: unknown, verbose = false): obj is DevList {
  return check(obj, DeviceList, verbose);
}

/**
 * Determines whether the specified object is a device response.
 * @param obj {object} The object to be tested
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a device response.
 */
export function isDeviceResponse(
  obj: unknown,
  verbose = false
): obj is DevResponse {
  return check(obj, DeviceResponse, verbose);
}

/**
 * Determines whether the specified object is a valid response to a get data point request.
 * @param obj {object} The object to be tested
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a response to a get data point request.
 */
export function isGetDataPointResponse(
  obj: unknown,
  verbose = false
): obj is GetResponse {
  return check(obj, GetDataPointResponse, verbose);
}

/**
 * Determines whether the specified object is a valid response to a set data point request.
 * @param obj {object} The object to be tested
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a response to a set data point request.
 */
export function isSetDataPointResponse(
  obj: unknown,
  verbose = false
): obj is SetResponse {
  return check(obj, SetDataPointResponse, verbose);
}

/**
 * Determines whether the specified object is a virtual device response.
 * @param obj {object} The object to be tested
 * @param verbose {boolean} Determines whether validation errors shall be logged. Default value is false.
 * @returns {boolean} A value indicating whether the specified object is a response to a virtual device request.
 */
export function isVirtualDeviceResponse(
  obj: unknown,
  verbose = false
): obj is VDeviceResponse {
  return check(obj, VirtualDeviceResponse, verbose);
}
