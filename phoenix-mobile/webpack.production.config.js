

const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const EgretJsInjectPlugin = require('./webpack.egretjsplugin.js');
const TerserPlugin = require("terser-webpack-plugin");

const gameReleasePathParent = path.join(__dirname, "./../phoenix-game/bin-release/web");
const gameReleasePaths = fs.readdirSync(gameReleasePathParent);
const gameReleasePathNumbers = gameReleasePaths.filter(entry => !isNaN(entry)).map(entry => parseInt(entry, 10));
const gameReleasePathLatest = Math.max(...gameReleasePathNumbers);
const gameReleasePath = path.join(gameReleasePathParent, "./" + gameReleasePathLatest);

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/mobile/',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
      inject: 'body',
    }),
    new EgretJsInjectPlugin(path.join(gameReleasePath, "./manifest.json")),
    new CopyWebpackPlugin(({
      patterns: [
        {
          from: path.join(gameReleasePath),
          to: path.join(__dirname, "./build"),
          globOptions: {
            ignore: ['**/index.html'],
          },
        }
      ]
    }))
  ]
});