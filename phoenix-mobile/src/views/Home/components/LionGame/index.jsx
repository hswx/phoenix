import React from "react";
import { Box } from "@mui/material";

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
  
const LionGame = React.memo(() => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (containerRef.current) {
      const egretDom = document.getElementsByClassName("egret-player")[0]
      if (egretDom) {
        containerRef.current.appendChild(egretDom);
        if (!egretDom.hasChildNodes()) {
          runEgret();
        }

        return () => {
          const egretDomParent = document.getElementsByClassName("egret-player-container")[0]
          if (egretDomParent) {
            egretDomParent.appendChild(egretDom);
          }
        }
      }
    }
  }, []);

  return <Box ref={containerRef}/>
})

export default LionGame
