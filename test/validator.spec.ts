import {
  Configuration,
  DeviceList,
  DeviceResponse,
  GetDataPointResponse,
  isConfiguration,
  isDeviceList,
  isDeviceResponse,
  isGetDataPointResponse,
  isSetDataPointResponse,
  isWebSocketMessage,
  SetDataPointResponse,
  WebSocketMessage,
} from "../src/model";
import { originalTimeout } from "../test";

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
    expect(isWebSocketMessage(obj, true)).toBeTrue();
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
    expect(isWebSocketMessage(obj)).toBeFalse();
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
    expect(isWebSocketMessage(obj, true)).toBeFalse();
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
    expect(isConfiguration(obj, true)).toBeTrue();
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
    expect(isConfiguration(obj)).toBeFalse();
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
    expect(isConfiguration(obj, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });

  it("should verify a valid device list", () => {
    const obj: DeviceList = {
      Test: ["Device1", "Device2", "Device3"],
    };
    expect(isDeviceList(obj, true)).toBeTrue();
  });

  it("should fail verification for an invalid device list", () => {
    const obj = {
      Test: {
        key: "value",
      },
    };
    expect(isDeviceList(obj)).toBeFalse();
  });

  it("should throw an error during verification for an invalid device list in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        key: "value",
      },
    };
    expect(isDeviceList(obj, true)).toBeFalse();
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
    expect(isDeviceResponse(obj, true)).toBeTrue();
  });

  it("should fail verification for an invalid device response", () => {
    const obj = {
      Test: {
        device: {},
      },
    };
    expect(isDeviceResponse(obj)).toBeFalse();
  });

  it("should throw an error during verification for an invalid device response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        device: {},
      },
    };
    expect(isDeviceResponse(obj, true)).toBeFalse();
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
    expect(isGetDataPointResponse(obj, true)).toBeTrue();
  });

  it("should fail verification for an invalid get data point response", () => {
    const obj = {
      Test: {
        values: {},
      },
    };
    expect(isGetDataPointResponse(obj)).toBeFalse();
  });

  it("should throw an error during verification for an invalid get data point response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        values: {},
      },
    };
    expect(isGetDataPointResponse(obj, true)).toBeFalse();
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
    expect(isSetDataPointResponse(obj, true)).toBeTrue();
  });

  it("should fail verification for an invalid set data point response", () => {
    const obj = {
      Test: {
        key1: 1,
        key2: 2,
      },
    };
    expect(isSetDataPointResponse(obj)).toBeFalse();
  });

  it("should throw an error during verification for an invalid set data point response in verbose mode", () => {
    const spy = spyOn(console, "error");
    const obj = {
      Test: {
        key1: 1,
        key2: 2,
      },
    };
    expect(isSetDataPointResponse(obj, true)).toBeFalse();
    expect(spy).toHaveBeenCalledWith(
      "Object validation failed!",
      jasmine.anything()
    );
  });
});
