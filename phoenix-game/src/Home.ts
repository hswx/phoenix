class Home extends eui.Group {
  constructor() {
    super();
    this.onEnter();
  }

  onEnter () {
    const bg = new eui.Image("bg_dayTime_png")
    this.addChild(bg);

    const eleGroup = new eui.Group();
    eleGroup.percentWidth = 100;
    eleGroup.height = 1200;
    this.addChild(eleGroup);

    const lion = new LionDB();
    eleGroup.addChild(lion);

    lion.sex = LionSex.boy;
    lion.play(LionAnimationNames.EATBISCUIT)

    const clickGroup = new eui.Group();
    clickGroup.width = 300;
    clickGroup.height = 360;
    clickGroup.top = 420;
    clickGroup.left = 220;
    this.addChild(clickGroup);

    const dbEventFn = () => {
      lion.play(LionAnimationNames.EATBISCUIT)
      lion.removeDBEventListener(dragonBones.EventObject.COMPLETE, dbEventFn, this);
    }

    clickGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, (event) => {
      const diamond = new eui.Image("common_json#icon-diamond");
      diamond.left = event.stageX - 18;
      diamond.top = event.stageY - 16;
      this.addChild(diamond);
      const p0x = diamond.left
      const p0y = diamond.top

      const p1x = p0x - 150 + 0
      const p1y = p0y - 300 + 260

      const p2x = p0x - 150 + 300
      const p2y = p0y - 300 + 200

      const p3x = p0x - 150 + 300
      const p3y = p0y - 300 + 100

      const p4x = p0x - 150 + 0
      const p4y = p0y - 300 + 80

      const p5x = p0x - 150 + 150
      const p5y = p0y - 300 + 0

      Object.defineProperty(diamond, "factor", {
        get: () => 0,
        set: (t) => {
          diamond.left = Math.pow(1 - t, 5) * p0x +
          5 * Math.pow(1 - t, 4) * t * p1x +
          10 * Math.pow(1 - t, 3) * Math.pow(t, 2) * p2x +
          10 * Math.pow(1 - t, 2) * Math.pow(t, 3) * p3x +
          5 * (1 - t) * Math.pow(t, 4) * p4x +
          Math.pow(t, 5) * p5x;
          diamond.top = Math.pow(1 - t, 5) * p0y +
          5 * Math.pow(1 - t, 4) * t * p1y +
          10 * Math.pow(1 - t, 3) * Math.pow(t, 2) * p2y +
          10 * Math.pow(1 - t, 2) * Math.pow(t, 3) * p3y +
          5 * (1 - t) * Math.pow(t, 4) * p4y +
          Math.pow(t, 5) * p5y;
        }
      })

      egret.Tween.get(diamond).wait(200).to({factor: 1}, 1000).call(() => {
        this.removeChild(diamond)
      })

      lion.play(LionAnimationNames.CLICKFEEDBACK, 1)
      lion.addDBEventListener(dragonBones.EventObject.COMPLETE, dbEventFn, this)
    }, this)
  }
} 