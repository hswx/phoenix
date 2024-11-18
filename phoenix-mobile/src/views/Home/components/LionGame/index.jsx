import React from "react";
import { ClassNames } from '@emotion/react';

const EGRET_HEIGHT_PERCENT = 120

const runEgret = () => {
  egret.ImageLoader.crossOrigin = 'anonymous'
  egret.runEgret({
    renderMode: 'webgl',
    audioType: 0,
    calculateCanvasScaleFactor: function(context) {
        var backingStore =
            context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1
        return (window.devicePixelRatio || 1) / backingStore
    }
})
}

const LionGame = () => {
  React.useEffect(() => {
    runEgret()
  }, [])

  return <ClassNames >
    {({ css }) => <div style={{margin: "auto", width: "100%", paddingTop: `${EGRET_HEIGHT_PERCENT}%`}} className={`egret-player ${
      css`position: relative !important;`
    }`}
    data-entry-class="Main"
    data-orientation="auto"
    data-scale-mode="exactFit"
    data-frame-rate="24"
    data-content-width="750"
    data-content-height={750 * EGRET_HEIGHT_PERCENT / 100}
    data-multi-fingered="1"
    data-show-fps="false" data-show-log="false"
  />}
  </ClassNames>
}

export default LionGame
