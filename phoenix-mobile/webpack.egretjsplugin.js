const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

module.exports = EgretJsInjectPlugin
