const CopyPlugin = require('copy-webpack-plugin');
const { override, disableChunk, addWebpackPlugin } = require('customize-cra');

module.exports = {
  webpack: override(
    (config) => {
      config.output.filename = 'js/bundle.js';
      return config;
    },
    disableChunk(),
    addWebpackPlugin(
      new CopyPlugin({
        patterns: ['src/content.js'],
      }),
    ),
  ),
};
