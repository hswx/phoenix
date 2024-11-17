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
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        return _super.call(this) || this;
    }
    Home.prototype.onEnter = function () {
        var bg = new eui.Image("bg_dayTime_png");
        this.addChild(bg);
        var eleGroup = new eui.Group();
        eleGroup.percentWidth = 100;
        eleGroup.height = 1200;
        this.addChild(eleGroup);
        var lion = new LionDB();
        lion.sex = LionSex.boy;
        lion.play(LionAnimationNames.EATBISCUIT);
    };
    return Home;
}(eui.Group));
__reflect(Home.prototype, "Home");
