import { array, enumtype, iface, opt, ITypeSuite } from "ts-interface-checker";

const VirtualDevice = iface([], {
  type: "VirtualDeviceType",
  properties: opt(
    iface([], {
      ttl: opt("string"),
      displayname: opt("string"),
      flavor: opt("string"),
      capabilities: opt(array("number")),
    })
  ),
});

export const VirtualDeviceType = enumtype({
  BinarySensor: "BinarySensor",
  BlindActuator: "BlindActuator",
  SwitchingActuator: "SwitchingActuator",
  CeilingFanActuator: "CeilingFanActuator",
  RTC: "RTC",
  DimActuator: "DimActuator",
  EVCharging: "evcharging",
  WindowSensor: "WindowSensor",
  SimpleDoorlock: "simple_doorlock",
  ShutterActuator: "ShutterActuator",
  WeatherStation: "WeatherStation",
  WeatherTemperatureSensor: "Weather-TemperatureSensor",
  WeatherWindSensor: "Weather-WindSensor",
  WeatherBrightnessSensor: "Weather-BrightnessSensor",
  WeatherRainSensor: "Weather-RainSensor",
  WindowActuator: "WindowActuator",
  CODetector: "CODetector",
  FireDetector: "FireDetector",
  KNXSwitchSensor: "KNX-SwitchSensor",
  MediaPlayer: "MediaPlayer",
  EnergyBattery: "EnergyBattery",
  EnergyInverter: "EnergyInverter",
  EnergyMeter: "EnergyMeter",
  EnergyInverterBattery: "EnergyInverterBattery",
  EnergyInverterMeter: "EnergyInverterMeter",
  EnergyInverterMeterBattery: "EnergyInverterMeterBattery",
  EnergyMeterBattery: "EnergyMeterBattery",
  AirQualityCO2: "AirQualityCO2",
  AirQualityCO: "AirQualityCO",
  AirQualityFull: "AirQualityFull",
  AirQualityHumidity: "AirQualityHumidity",
  AirQualityNO2: "AirQualityNO2",
  AirQualityO3: "AirQualityO3",
  AirQualityPM10: "AirQualityPM10",
  AirQualityPM25: "AirQualityPM25",
  AirQualityPressure: "AirQualityPressure",
  AirQualityTemperature: "AirQualityTemperature",
  AirQualityVOC: "AirQualityVOC",
  EnergyMeterV2: "EnergyMeterv2",
  HomeApplianceLaundry: "HomeAppliance-Laundry",
  HVAC: "HVAC",
  SplitUnit: "SplitUnit",
});

export const VirtualDeviceTypeSuite: ITypeSuite = {
  VirtualDevice,
  VirtualDeviceType,
};
