const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/index.ts"),
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "tsconfig.esm.json",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: [/node_modules/, "ws", "ts-interface-checker"],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist/esm"),
    module: true,
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
};
