var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var LionSex;
(function (LionSex) {
    LionSex[LionSex["boy"] = 0] = "boy";
    LionSex[LionSex["girl"] = 1] = "girl";
})(LionSex || (LionSex = {}));
var LionAnimationNames;
(function (LionAnimationNames) {
    LionAnimationNames["EATBEEF"] = "eat-beef";
    LionAnimationNames["EATBISCUIT"] = "eat-biscuit";
    LionAnimationNames["EATNUT"] = "eat-nut";
    LionAnimationNames["EATPOTATO"] = "eat-potato";
    LionAnimationNames["EATDURIAN"] = "eat-durian";
    LionAnimationNames["NORMAL"] = "daiji";
    LionAnimationNames["PRAMATION"] = "shengji";
    LionAnimationNames["RECEIVE"] = "chuxian";
    LionAnimationNames["PLACATE"] = "wanyouxi";
    LionAnimationNames["APPEASE"] = "anfu";
    LionAnimationNames["CLICKFEEDBACK"] = "hushi";
    LionAnimationNames["LANZIYINDAO"] = "lanziyindao";
    LionAnimationNames["BAOXIANGYINDAO"] = "baoxiangyindao";
    LionAnimationNames["ZUOGUILIAN"] = "zuoguilian";
    LionAnimationNames["WEIQU"] = "weiqu";
    LionAnimationNames["SHIFA"] = "shifa";
})(LionAnimationNames || (LionAnimationNames = {}));
var LionDB = (function (_super) {
    __extends(LionDB, _super);
    function LionDB() {
        var _this = _super.call(this) || this;
        _this.top = 810;
        _this.left = 374;
        var dragonbonesDataRES = RES.getRes("lion_sit_ske_json");
        var textureDataRES = RES.getRes("lion_sit_tex_json");
        var textureImgRES = RES.getRes("lion_sit_tex_png");
        var globalDragonBonesEgretFactory = dragonBones.EgretFactory.factory;
        globalDragonBonesEgretFactory.parseDragonBonesData(dragonbonesDataRES);
        globalDragonBonesEgretFactory.parseTextureAtlasData(textureDataRES, textureImgRES);
        _this.lion = globalDragonBonesEgretFactory.buildArmatureDisplay("Armature");
        _this.addChild(_this.lion);
        return _this;
    }
    LionDB.prototype.play = function (animationName, playTimes) {
        if (animationName === LionAnimationNames.EATPOTATO) {
            this.handFood = 'chips';
        }
        else if (animationName === LionAnimationNames.EATBEEF) {
            this.handFood = 'beef';
        }
        else if (animationName === LionAnimationNames.EATNUT) {
            this.handFood = 'nut';
        }
        else if (animationName === LionAnimationNames.EATBISCUIT) {
            this.handFood = 'cookies';
        }
        else if (animationName === LionAnimationNames.EATDURIAN) {
            this.handFood = 'durian';
        }
        if (animationName === LionAnimationNames.EATPOTATO || animationName === LionAnimationNames.EATBEEF || animationName === LionAnimationNames.EATNUT || animationName === LionAnimationNames.EATBISCUIT || animationName === LionAnimationNames.EATDURIAN) {
            this.lion && this.lion.animation.play(LionAnimationNames.EATBEEF, playTimes);
        }
        else {
            this.lion && this.lion.animation.play(animationName, playTimes);
        }
    };
    Object.defineProperty(LionDB.prototype, "sex", {
        set: function (value) {
            var globalDragonBonesEgretFactory = dragonBones.EgretFactory.factory;
            if (this.lion) {
                var armature = this.lion.armature;
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
                }
                else if (value === LionSex.girl) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LionDB.prototype, "handFood", {
        set: function (value) {
            var globalDragonBonesEgretFactory = dragonBones.EgretFactory.factory;
            if (this.lion) {
                var armature = this.lion.armature;
                if (!armature)
                    return;
                var handL = armature.getSlot('rou');
                if (value === 'chips') {
                    globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', '9/shupian', handL, 0);
                }
                else if (value === 'beef') {
                    globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', '9/rou', handL, 0);
                }
                else if (value === 'nut') {
                    globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', '9/jianguo', handL, 0);
                }
                else if (value === 'cookies') {
                    globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', '9/binggan', handL, 0);
                }
                else if (value === 'durian') {
                    globalDragonBonesEgretFactory.replaceSlotDisplay(null, 'Armature', 'rou', 'liulian', handL, 0);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return LionDB;
}(eui.Group));
__reflect(LionDB.prototype, "LionDB");
