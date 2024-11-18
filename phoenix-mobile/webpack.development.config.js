
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const fs = require("fs");

class EgretJsInjectPlugin {
  constructor(manifestPath) {
      this.manifestPath = manifestPath
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("EgretJsInjectPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        'EgretJsInjectPlugin', (webpackData, cb) => {
          const fileData = fs.readFileSync(this.manifestPath);
          const jsList = JSON.parse(fileData.toString())
          const commonList = jsList.initial
          const gameJsList = jsList.game
          const egretList = [...commonList, ...gameJsList].map(src =>  (webpackData.plugin.userOptions.publicPath || "/" + src))
          webpackData.assets.js = [...egretList, ...webpackData.assets.js]
          cb(null, webpackData)
        }
      )
    })
  }
}

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3004,
    hot: true,
    open: true,
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

