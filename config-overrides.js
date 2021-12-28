const CopyPlugin = require("copy-webpack-plugin");
const {
  override,
  addWebpackPlugin,
} = require("customize-cra");

module.exports = {
  webpack: override(
    addWebpackPlugin(
      new CopyPlugin({
        patterns: ["src/content.js"],
      }),
    )
  ),
};
