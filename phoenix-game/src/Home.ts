class Home extends eui.Group {
  constructor() {
    super();
  }

  onEnter () {
    const bg = new eui.Image("bg_dayTime_png")
    this.addChild(bg);

    const eleGroup = new eui.Group();
    eleGroup.percentWidth = 100;
    eleGroup.height = 1200;
    this.addChild(eleGroup);

    const lion = new LionDB();
    lion.sex = LionSex.boy;
    lion.play(LionAnimationNames.EATBISCUIT)
  }

} 