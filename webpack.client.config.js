const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const assets = require('./webpack-assets.json');

const pathsToClean = ['public'];
const cleanOptions = {
  watch: true,
  exclude: assets.vendor.js,
};

const assetsPluginInstance = new AssetsPlugin({
  includeManifest: 'manifest',
  prettyPrint: true,
});

const VENDOR_LIBRARIES = [
  'react',
  'react-dom',
  'react-router-dom',
  'axios',
  'react-router-config',
  'redux',
  'react-redux',
  'redux-thunk',
  'react-helmet',
];

const config = {
  entry: {
    bundle: ['./src/client/client.js'],
    vendor: VENDOR_LIBRARIES,
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity,
    }),
    assetsPluginInstance,
  ],
  devtool: 'source-map',
};

let mergedConfig = merge(baseConfig, config);

if (process.env.NODE_ENV === 'production') {
  const prod = {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  };
  mergedConfig = merge(mergedConfig, prod);
}

module.exports = mergedConfig;