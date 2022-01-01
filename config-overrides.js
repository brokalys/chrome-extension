const FileManagerPlugin = require('filemanager-webpack-plugin');
const {
  addWebpackPlugin,
  override,
  disableChunk,
  adjustStyleLoaders,
} = require('customize-cra');

module.exports = {
  webpack: override(
    (config) => {
      config.output.filename = 'js/bundle.js';
      config.optimization.minimize = false;
      config.ignoreWarnings = [/Failed to parse source map/];
      return config;
    },
    adjustStyleLoaders(({ use }) => {
      const styleLoader = use[0].loader.replace(
        'mini-css-extract-plugin/dist/loader.js',
        'style-loader',
      );
      use[0] = styleLoader;
    }),
    disableChunk(),
    addWebpackPlugin(
      new FileManagerPlugin({
        events: {
          onEnd: {
            archive: [
              {
                source: './build',
                destination: './build/extension.zip',
              },
            ],
          },
        },
      }),
    ),
  ),
};
