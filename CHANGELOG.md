# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.10.0 - 10.01.2026

### Changed

- Bump dependencies

## 1.9.0 - 18.10.2025

### Changed

- Bump dependencies
- [#145](https://github.com/pgerke/freeathome-local-api-client/issues/145):
  Moved to using a Trusted Publisher instead of a personal access token for library publication

## 1.8.0 - 14.09.2025

### Added

- [#128](https://github.com/pgerke/freeathome-local-api-client/issues/128):
  Add dual module system testing support (ESM/CommonJS)
- [#128](https://github.com/pgerke/freeathome-local-api-client/issues/128):
  Add separate test build configuration with tsup
- [#128](https://github.com/pgerke/freeathome-local-api-client/issues/128):
  Add jasmine-spec-reporter for improved test output visibility

### Changed

- [#128](https://github.com/pgerke/freeathome-local-api-client/issues/128):
  Migrate ESLint to flat config format with latest TypeScript rules
- [#128](https://github.com/pgerke/freeathome-local-api-client/issues/128):
  Update Jasmine testing framework to latest version
- [#128](https://github.com/pgerke/freeathome-local-api-client/issues/128):
  Modernize TypeScript configuration with improved module resolution
- [#128](https://github.com/pgerke/freeathome-local-api-client/issues/128):
  Add separate test scripts for ESM and CommonJS execution
- [#128](https://github.com/pgerke/freeathome-local-api-client/issues/128):
  Update GitHub Actions workflow for dual module testing

## 1.7.0 - 23.07.2025

### Changed

- NO TICKET: Bump dependencies

## 1.6.1 - 17.05.2025

### Fixed

- [#77](https://github.com/pgerke/freeathome-local-api-client/issues/77):
  Fixed an issue that caused multiple websocket keep alive timer to be configured simultaneously

## 1.6.0 - 16.05.2025

### Added

- [#75](https://github.com/pgerke/freeathome-local-api-client/issues/75):
  Added a keepalive timer to the websocket connection that prevents the channel from being closed for being idle

## 1.5.0 - 11.05.2025

### Added

- [#71](https://github.com/pgerke/freeathome-local-api-client/issues/71):
  Add dependabot configuration
- [#73](https://github.com/pgerke/freeathome-local-api-client/issues/73):
  Add GitLeaks scan job

### Changed

- NO-TICKET: Dependency bump

## 1.4.16 - 22.03.2025

### Added

- [#65](https://github.com/pgerke/freeathome-local-api-client/issues/65):
  Release workflow and development tooling enhancement

### Changed

- NO-TICKET: Bump dependencies

## 1.4.11 - 28.12.2024

### Added

- [#61](https://github.com/pgerke/freeathome-local-api-client/issues/61):
  Add a SonarQube scan

## 1.4.10 - 02.12.2024

### Changed

- [#59](https://github.com/pgerke/freeathome-local-api-client/issues/59):
  Migrate build system from webpack to tsup
- [#59](https://github.com/pgerke/freeathome-local-api-client/issues/59):
  Bump dependencies and migrate to latest ESLint
- [#59](https://github.com/pgerke/freeathome-local-api-client/issues/59):
  Upgrade GitHub Actions

## 1.4.9 - 24.08.2024

### Changed

- [#57](https://github.com/pgerke/freeathome-local-api-client/issues/57):
  Bump dependencies

## 1.4.8 - 16.07.2024

### Changed

- [#54](https://github.com/pgerke/freeathome-local-api-client/issues/54):
  Bump dependencies

## 1.4.6 and 1.4.7 - 01.06.2024

### Changed

- [#52](https://github.com/pgerke/freeathome-local-api-client/issues/52):
  Bump dependencies

## 1.4.4 - 27.01.2024

### Changed

- [#48](https://github.com/pgerke/freeathome-local-api-client/issues/48):
  Bump dependencies

## 1.4.3 - 18.12.2023

### Changed

- [#46](https://github.com/pgerke/freeathome-local-api-client/issues/46):
  Bump dependencies

## 1.4.0 - 19.09.2023

### Added

- [#37](https://github.com/pgerke/freeathome-local-api-client/issues/37):
  Updated the models to comform to the specification provided with firmware version v3.2.2.

## 1.3.10 - 06.05.2023

### Changed

- Bump dependencies

## 1.3.3 - 06.08.2022

### Changed

- [PG-213](https://pgerke.atlassian.net/browse/PG-213):
  Bump dependencies

## 1.3.1 - 21.07.2022

### Changed

- Bump dependencies

## [1.3.0](https://www.npmjs.com/package/freeathome-local-api-client/v/1.3.0) - 18.06.2022

### Added

- [PG-189](https://pgerke.atlassian.net/browse/PG-189):
  The `SystemAccessPoint` is now an `EventEmitter` emitting, for example, websocket events.

### Fixed

- [PG-193](https://pgerke.atlassian.net/browse/PG-193):
  Rolled back to ts-node@10.8.0 to fix an issue with code coverage calculation.

## [1.2.0](https://www.npmjs.com/package/freeathome-local-api-client/v/1.2.0) - 16.06.2022

### Added

- [PG-183](https://pgerke.atlassian.net/browse/PG-183):
  Add interface checkers for device and channel
- [PG-172](https://pgerke.atlassian.net/browse/PG-172):
  Support injection of external logger instance
- [PG-175](https://pgerke.atlassian.net/browse/PG-175):
  Provide a hybrid ESM/CommonJS library

## [1.1.2](https://www.npmjs.com/package/freeathome-local-api-client/v/1.1.2) - 13.05.2022

### Changed

- Bump dependencies

## [1.1.1](https://www.npmjs.com/package/freeathome-local-api-client/v/1.1.1) - 31.05.2022

### Added

- [PG-147](https://pgerke.atlassian.net/browse/PG-147):
  Added badges to README: CI Status, Coverage, Dependency Vulnerabilities, latest npm version and license

### Changed

- Bump dependencies

## [1.1.0](https://www.npmjs.com/package/freeathome-local-api-client/v/1.1.0) - 24.05.2022

### Added

- [PG-143](https://pgerke.atlassian.net/browse/PG-143):
  Support Experimental API

## [1.0.1](https://www.npmjs.com/package/freeathome-local-api-client/v/1.0.1) - 13.05.2022

### Changed

- [PG-147](https://pgerke.atlassian.net/browse/PG-147):
  Setup SonarQube Scanner and fix identified issues

## [1.0.0](https://www.npmjs.com/package/freeathome-local-api-client/v/1.0.0) - 09.05.2022

### Added

- [PG-141](https://pgerke.atlassian.net/browse/PG-141):
  Support REST API

## [0.2.0-pre](https://www.npmjs.com/package/freeathome-local-api-client/v/0.2.0-pre) - 04.05.2022

### Added

- Initial version
- [PG-137](https://pgerke.atlassian.net/browse/PG-137):
  Support web socket communication
