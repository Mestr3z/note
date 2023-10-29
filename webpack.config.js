const path = require("path");

module.exports = {
  entry: "./src/components/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  mode: "development",

  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3005,
  },
};
