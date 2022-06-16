# freeathome-local-api-client

A client library for the BUSCH-JAEGER free@home local API implemented in TypeScript.

![CI](https://img.shields.io/github/workflow/status/pgerke/freeathome-local-api-client/Continuous%20Integration?style=flat-square)
[![codecov](https://codecov.io/gh/pgerke/freeathome-local-api-client/branch/main/graph/badge.svg?token=UJQVXZ5PPM)](https://codecov.io/gh/pgerke/freeathome-local-api-client)
![Dependencies](https://img.shields.io/librariesio/release/npm/freeathome-local-api-client?style=flat-square)
![npm](https://img.shields.io/npm/v/freeathome-local-api-client?style=flat-square)
![License](https://img.shields.io/github/license/pgerke/freeathome-local-api-client?style=flat-square)

## Installation

You can install the package from npmjs.com:

```
npm install --save freeathome-local-api-client
```

## Features

- Connect to your B+J System Access Point 2.0 and control it using the local API.
- The complete local API is supported!
- Read the configuration, the device list and any datapoint offered by any device connected to the system
- Control your devices by setting new values for data points
- Hybrid library supporting ESM as well as CommonJS
- 100% covered by automated unit tests

## Usage Requirements

- A free@home System Access Point 2.0 running firmware > v3.0
- Local API has to be enabled for the user account to be used

## Documentation

The client library is documented using JSDoc, the generated documentation is available at https://pgerke.github.io/freeathome-local-api-client/.
There is also a sample project illustrating the use of the library can be found at https://github.com/pgerke/freeathome-local-api-sample. It illustrates usage for ESM as well as CommonJs.

## I found a bug, what do I do?

I'm happy to hear any feedback regarding the library or it's implementation, be it critizism, praise or rants. Please create a [GitHub issue](https://github.com/pgerke/freeathome-local-api-client/issues) or drop me an [email](mailto:info@philipgerke.com) if you would like to contact me.

I would especially appreciate, if you could report any issues you encounter while using the library. Issues I know about, I can probably fix.

If you want to submit a bug report, please check if the issue you have has already been reported. If you want to contribute additional information to the issue, please add it to the existing issue instead of creating another one. Duplicate issues will take time from bugfixing and thus delay a fix.

While creating a bug report, please make it easy for me to fix it by giving us all the details you have about the issue. Always include the version of the library and a short concise description of the issue. Besides that, there are a few other pieces of information that help tracking down bugs:

- The system environment in which the issue occurred (e.g. node version)
- Some steps to reproduce the issue, e.g. a code snippet
- The expected behaviour and how the failed failed to meet that expectation
- Anything else you think I might need

## I have a feature request, what do I do?

Please create a [GitHub issue](https://github.com/pgerke/freeathome-local-api-client/issues) or drop me an [email](mailto:info@philipgerke.com)!

## Non-Affiliation Disclaimer

This library is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by Busch-Jaeger Elektro GmbH or ABB Asea Brown Boveri Ltd or . All product and company names are the registered trademarks of their original owners. The use of any trade name or trademark is for identification and reference purposes only and does not imply any association with the trademark holder of their product brand.

## License

The project is subject to the MIT license unless otherwise noted. A copy can be found in the root directory of the project [LICENSE](./LICENSE).

<hr>

Made with ❤️ by [Philip Gerke](https://github.com/pgerke)
