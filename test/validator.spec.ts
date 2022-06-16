import {
  Channel,
  Configuration,
  Device,
  DeviceList,
  DeviceResponse,
  GetDataPointResponse,
  isConfiguration,
  isDeviceList,
  isDeviceResponse,
  isGetDataPointResponse,
  isSetDataPointResponse,
  isWebSocketMessage,
  Logger,
  SetDataPointResponse,
  VirtualDeviceResponse,
  WebSocketMessage,
} from "../src/model";
import {
  isChannel,
  isDevice,
  isVirtualDeviceResponse,
} from "../src/model/validator";
import { originalTimeout } from "../test";

const logger: Logger = console;

describe("Validator", () => {
  afterAll(() => {
    // Restore the default Jasmine timeout after the test suite.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should verify a valid web socket message", () => {
    const obj: WebSocketMessage = {
      Test: {
        datapoints: {},
        devices: {},
        devicesAdded: [],
        devicesRemoved: [],
        scenesTriggered: {},
      },
    };
    expect(isWebSocketMessage(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid web socket message", () => {
    const obj = {
      Test: {
        devices: {},
        devicesAdded: [],
        devicesRemoved: [],
        scenesTriggered: {},
      },
    };
    expect(isWebSocketMessage(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid web socket message in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        devices: {},
        devicesAdded: [],
        devicesRemoved: [],
        scenesTriggered: {},
      },
    };
    expect(isWebSocketMessage(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid configuration", () => {
    const obj: Configuration = {
      Test: {
        devices: {},
        floorplan: {
          floors: {},
        },
        sysapName: "Test System Access Point",
        users: {},
      },
    };
    expect(isConfiguration(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid configuration", () => {
    const obj = {
      Test: {
        floorplan: {
          floors: {},
        },
        sysapName: "Test System Access Point",
        users: {},
      },
    };
    expect(isConfiguration(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid configuration in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        devices: {},
        devicesAdded: [],
        devicesRemoved: [],
        scenesTriggered: {},
      },
    };
    expect(isConfiguration(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid device list", () => {
    const obj: DeviceList = {
      Test: ["Device1", "Device2", "Device3"],
    };
    expect(isDeviceList(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid device list", () => {
    const obj = {
      Test: {
        key: "value",
      },
    };
    expect(isDeviceList(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid device list in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        key: "value",
      },
    };
    expect(isDeviceList(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid device response", () => {
    const obj: DeviceResponse = {
      Test: {
        devices: {},
      },
    };
    expect(isDeviceResponse(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid device response", () => {
    const obj = {
      Test: {
        device: {},
      },
    };
    expect(isDeviceResponse(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid device response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        device: {},
      },
    };
    expect(isDeviceResponse(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid get data point response", () => {
    const obj: GetDataPointResponse = {
      Test: {
        values: ["Value 1", "Value 2"],
      },
    };
    expect(isGetDataPointResponse(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid get data point response", () => {
    const obj = {
      Test: {
        values: {},
      },
    };
    expect(isGetDataPointResponse(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid get data point response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        values: {},
      },
    };
    expect(isGetDataPointResponse(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid set data point response", () => {
    const obj: SetDataPointResponse = {
      Test: {
        key1: "Value 1",
        key2: "Value 2",
      },
    };
    expect(isSetDataPointResponse(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid set data point response", () => {
    const obj = {
      Test: {
        key1: 1,
        key2: 2,
      },
    };
    expect(isSetDataPointResponse(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid set data point response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        key1: 1,
        key2: 2,
      },
    };
    expect(isSetDataPointResponse(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid virtual device response", () => {
    const obj: VirtualDeviceResponse = {
      "00000000-0000-0000-0000-000000000000": {
        devices: {
          abcd12345: {
            serial: "6000D2CB27B2",
          },
        },
      },
    };
    expect(isVirtualDeviceResponse(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid virtual device response", () => {
    const obj = {
      "00000000-0000-0000-0000-000000000000": {
        device: {
          abcd12345: {
            serial: "6000D2CB27B2",
          },
        },
      },
    };
    expect(isVirtualDeviceResponse(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid virtual device response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      "00000000-0000-0000-0000-000000000000": {
        device: {
          abcd12345: {
            serial: "6000D2CB27B2",
          },
        },
      },
    };
    expect(isVirtualDeviceResponse(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid channel", () => {
    const obj: Channel = {
      displayName: "Test Channel",
      functionID: "1",
    };
    expect(isChannel(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid channel", () => {
    const obj = {
      displayName: "Test Channel",
      functionID: "1",
      floor: 1,
    };
    expect(isChannel(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid virtual device response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      displayName: "Test Channel",
      functionID: "1",
      floor: 1,
    };
    expect(isChannel(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid device", () => {
    const obj: Device = {
      displayName: "Test Device",
    };
    expect(isDevice(obj, logger, true)).toBeTrue();
  });

  it("should fail verification for an invalid channel", () => {
    const obj = {
      displayName: "Test Device",
      floor: 1,
    };
    expect(isDevice(obj, logger)).toBeFalse();
  });

  it("should throw an error during verification for an invalid virtual device response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      displayName: "Test Device",
      floor: 1,
    };
    expect(isDevice(obj, logger, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });
});
