const fs = require("fs");

// Load package.json
const packageJson = fs.readFileSync("package.json");
const package = JSON.parse(packageJson);

// Create package.json for CommonJS part
package.type = "commonjs";
fs.writeFileSync("dist/cjs/package.json", JSON.stringify(package, null, 2));

// Create package.json for ESM part
package.type = "module";
fs.writeFileSync("dist/esm/package.json", JSON.stringify(package, null, 2));
