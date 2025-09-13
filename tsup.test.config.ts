import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["test/*.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  minify: true,
  shims: false,
  sourcemap: true,
  outDir: "dist",
});
