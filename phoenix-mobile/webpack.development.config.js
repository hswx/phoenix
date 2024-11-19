
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const EgretJsInjectPlugin = require('./webpack.egretjsplugin.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3004,
    hot: true,
    open: true,
    historyApiFallback: true,
    static: [
      {
        directory: path.join(__dirname, "./../phoenix-game/bin-debug"),
        publicPath: "/bin-debug"
      },
      {
        directory: path.join(__dirname, "./../phoenix-game/libs"),
        publicPath: "/libs"
      },
      {
        directory: path.join(__dirname, "./../phoenix-game/resource"),
        publicPath: "/resource"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
      inject: 'body',
    }),
    new EgretJsInjectPlugin(path.join(__dirname, "./../phoenix-game/manifest.json"))
  ]
});

