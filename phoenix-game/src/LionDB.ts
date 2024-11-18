enum LionSex {
    boy = 0,
    girl
}

enum LionAnimationNames {
    EATBEEF = 'eat-beef',
    EATBISCUIT = 'eat-biscuit',
    EATNUT = 'eat-nut',
    EATPOTATO = 'eat-potato',
    EATDURIAN = 'eat-durian',
    NORMAL = 'daiji',
    PRAMATION = 'shengji',
    RECEIVE = 'chuxian',
    PLACATE = 'wanyouxi',
    APPEASE = 'anfu',
    CLICKFEEDBACK = 'hushi',
    LANZIYINDAO = 'lanziyindao',
    BAOXIANGYINDAO = 'baoxiangyindao',
    ZUOGUILIAN = 'zuoguilian',
    WEIQU = 'weiqu',
    SHIFA = 'shifa',
}

class LionDB extends eui.Group {
    private lion: dragonBones.EgretArmatureDisplay | null;
    constructor() {
        super();
        this.top = 810;
        this.left = 374;

        const dragonbonesDataRES = RES.getRes("lion_sit_ske_json");
        const textureDataRES = RES.getRes("lion_sit_tex_json");
        const textureImgRES = RES.getRes("lion_sit_tex_png");
        const globalDragonBonesEgretFactory = dragonBones.EgretFactory.factory;
        
        globalDragonBonesEgretFactory.parseDragonBonesData(dragonbonesDataRES);
        globalDragonBonesEgretFactory.parseTextureAtlasData(textureDataRES, textureImgRES);
        this.lion = globalDragonBonesEgretFactory.buildArmatureDisplay("Armature");
        this.addChild(this.lion);
    }

    play(animationName: LionAnimationNames, playTimes?: number): void {
        if (animationName === LionAnimationNames.EATPOTATO) {
            this.handFood = 'chips';
        } else if (animationName === LionAnimationNames.EATBEEF) {
            this.handFood = 'beef';
        } else if (animationName === LionAnimationNames.EATNUT) {
            this.handFood = 'nut';
        } else if (animationName === LionAnimationNames.EATBISCUIT) {
            this.handFood = 'cookies';
        } else if (animationName === LionAnimationNames.EATDURIAN) {
            this.handFood = 'durian';
        }
        if (animationName === LionAnimationNames.EATPOTATO || animationName === LionAnimationNames.EATBEEF || animationName === LionAnimationNames.EATNUT || animationName === LionAnimationNames.EATBISCUIT || animationName === LionAnimationNames.EATDURIAN) {
            this.lion && this.lion.animation.play(LionAnimationNames.EATBEEF, playTimes)
        } else {
            this.lion && this.lion.animation.play(animationName, playTimes)
        }
    }

    set sex(value: number) {
        const globalDragonBonesEgretFactory = dragonBones.EgretFactory.factory;
        if (this.lion) {
            let armature = this.lion.armature;
            if (value === LionSex.boy) {
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'kongbai', '9/kongbai', armature.getSlot('hudjie'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'kongbai', '9/kongbai', armature.getSlot('hdjyy'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'kongbai', '9/kongbai', armature.getSlot('zuojiem'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'kongbai', '9/kongbai', armature.getSlot('youjiem'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'kongbai', '9/kongbai', armature.getSlot('shaih1'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'kongbai', '9/kongbai', armature.getSlot('shaih2'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'zuomeimao', '9/zuomeimao', armature.getSlot('zuomeimao'), 1);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'zuomeimao', '9/zuomeimao', armature.getSlot('zuomeimao'), 2);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'youmeimao', '9/youmeimao', armature.getSlot('youmeimao'), 1);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'youmeimao', '9/youmeimao', armature.getSlot('youmeimao'), 2);
            } else if (value === LionSex.girl) {
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'hudjie', '9/hudjie', armature.getSlot('hudjie'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'hdjyy', '9/hdjyy', armature.getSlot('hdjyy'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'zuojiem', '9/zuojiem', armature.getSlot('zuojiem'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'youjiem', '9/youjiem', armature.getSlot('youjiem'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'shaih1', '9/shaih1', armature.getSlot('shaih1'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'shaih2', '9/shaih2', armature.getSlot('shaih2'), 0);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'zuomeimao', '9/zmm', armature.getSlot('zuomeimao'), 1);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'zuomeimao', '9/zngm', armature.getSlot('zuomeimao'), 2);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'youmeimao', '9/ymm', armature.getSlot('youmeimao'), 1);
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'youmeimao', '9/yngm', armature.getSlot('youmeimao'), 2);
            }
        }
    }

    set handFood(value) {
        const globalDragonBonesEgretFactory = dragonBones.EgretFactory.factory;
        if (this.lion) {
            let armature = this.lion.armature;
            if (!armature) return;
            let handL = armature.getSlot('rou');
            if (value === 'chips') {
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', '9/shupian', handL, 0);
            } else if (value === 'beef') {
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', '9/rou', handL, 0);
            } else if (value === 'nut') {
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', '9/jianguo', handL, 0);
            } else if (value === 'cookies') {
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', '9/binggan', handL, 0);
            } else if (value === 'durian') {
                globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', 'liulian', handL, 0);
            }
        }
    }

    addDBEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
        this.lion && this.lion.addEventListener(type, listener, thisObject, useCapture, priority)
    }

    removeDBEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
        this.lion && this.lion.removeEventListener(type, listener, thisObject, useCapture)
    }
}
