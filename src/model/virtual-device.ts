/** Defines a virtual device. */
export interface VirtualDevice {
  /** The virtual device type. */
  type: VirtualDeviceType;
  /** The virtual device properties */
  properties?: {
    /** The time to live value indicates the number of seconds the system access point will wait for a message before it assumes the device to be unresponsive. */
    ttl?: string;
    /** The display name for the virtual device. */
    displayname?: string;
    /** The virtual device flavor. */
    flavor?: string;
    /** The virtual device capabilities. */
    capabilities?: Array<number>;
  };
}

/** Defines the possible types of virtual devices. */
export enum VirtualDeviceType {
  /** A binary sensor */
  BinarySensor = "BinarySensor",
  /** A blind actuator */
  BlindActuator = "BlindActuator",
  /** A switching actuator */
  SwitchingActuator = "SwitchingActuator",
  /** A ceiling fan actuator */
  CeilingFanActuator = "CeilingFanActuator",
  /** A real time clock */
  RTC = "RTC",
  /** A dimmer actuator */
  DimActuator = "DimActuator",
  /** A charger for an electronic vehicle */
  EVCharging = "evcharging",
  /** A window sensor */
  WindowSensor = "WindowSensor",
  /** A simple door lock */
  SimpleDoorlock = "simple_doorlock",
  /** A shutter actuator */
  ShutterActuator = "ShutterActuator",
  /** A weather station */
  WeatherStation = "WeatherStation",
  /** A temperature sensor */
  WeatherTemperatureSensor = "Weather-TemperatureSensor",
  /** A wind sensor */
  WeatherWindSensor = "Weather-WindSensor",
  /** A brightness sensor */
  WeatherBrightnessSensor = "Weather-BrightnessSensor",
  /** A rain sensor */
  WeatherRainSensor = "Weather-RainSensor",
  /** A window actuator */
  WindowActuator = "WindowActuator",
  /** A detector for carbon monoxide (CO) */
  CODetector = "CODetector",
  /** A fire detector */
  FireDetector = "FireDetector",
  /** A KNX switch sensor */
  KNXSwitchSensor = "KNX-SwitchSensor",
  /** A media player */
  MediaPlayer = "MediaPlayer",
  /** A battery */
  EnergyBattery = "EnergyBattery",
  /** An inverter */
  EnergyInverter = "EnergyInverter",
  /** An energy meter */
  EnergyMeter = "EnergyMeter",
  /** A device combining inverter and battery characteristics */
  EnergyInverterBattery = "EnergyInverterBattery",
  /** A device combining inverter and energy meter characteristics */
  EnergyInverterMeter = "EnergyInverterMeter",
  /** A device combining inverter, battery and energy meter characteristics */
  EnergyInverterMeterBattery = "EnergyInverterMeterBattery",
  /** A device combining battery and energy meter characteristics */
  EnergyMeterBattery = "EnergyMeterBattery",
  /** An air quality sensor measuring carbon dioxide (CO2) */
  AirQualityCO2 = "AirQualityCO2",
  /** An air quality sensor measuring carbon monoxide (CO) */
  AirQualityCO = "AirQualityCO",
  /** An full air quality sensor */
  AirQualityFull = "AirQualityFull",
  /** An air quality sensor measuring humidity */
  AirQualityHumidity = "AirQualityHumidity",
  /** An air quality sensor measuring nitrogen dioxide (NO2) */
  AirQualityNO2 = "AirQualityNO2",
  /** An air quality sensor measuring ozone (O3) */
  AirQualityO3 = "AirQualityO3",
  /** An air quality sensor measuring coarse particulate matter with in the 10 micron scale */
  AirQualityPM10 = "AirQualityPM10",
  /** An air quality sensor measuring coarse particulate matter with in the 25 micron scale */
  AirQualityPM25 = "AirQualityPM25",
  /** An air quality sensor measuring barometric pressure */
  AirQualityPressure = "AirQualityPressure",
  /** An air quality sensor measuring temperature */
  AirQualityTemperature = "AirQualityTemperature",
  /** An air quality sensor measuring volatile organic compounds */
  AirQualityVOC = "AirQualityVOC",
  /** A version 2 energy meter */
  EnergyMeterV2 = "EnergyMeterv2",
  HomeApplianceLaundry = "HomeAppliance-Laundry",
  HVAC = "HVAC",
  SplitUnit = "SplitUnit",
}
