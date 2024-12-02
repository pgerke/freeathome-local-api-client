import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  minify: false, // true,
  tsconfig: "tsconfig.json",
  shims: true,
  sourcemap: true,
  splitting: false,
  outDir: "dist",
});
