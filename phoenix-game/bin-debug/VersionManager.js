var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var VersionController = (function () {
    function VersionController() {
        /**
         * resource根路径
         */
        this.resourceRoot = resPath + "resource/";
        /**
         * 版本控制的文件夹
         */
        this.versionPath = "assets/";
        /**
         * 版本控制信息的所在路径，相对于resource文件夹
         */
        // private versionConfigPath = resPath + "resource/version.json" + '?v=' + resVersion;
        /**
         * 资源配置信息的所在路径
         */
        this.resourceConfigPath = resPath + "resource/default.res.json?v=" + resVersion;
    }
    /**
     * 初始化
     */
    VersionController.prototype.init = function () {
        if (false) {
            this.versionConfig = JSON.parse(decodeURIComponent(RES_VERSION_CONFIG));
            return Promise.resolve();
            // return new Promise((resolve, reject) => {
            //     //通过httpReques获得配置资源信息
            //     let request = new egret.HttpRequest();
            //     request.responseType = egret.HttpResponseType.TEXT;
            //     request.open(this.versionConfigPath, egret.HttpMethod.GET);
            //     request.send();
            //     request.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
            //         var request = <egret.HttpRequest>event.currentTarget;
            //         this.versionConfig = JSON.parse(request.response);
            //         resolve();
            //     }, this);
            //     request.addEventListener(egret.IOErrorEvent.IO_ERROR, () => {
            //         reject();
            //     }, this);
            // })
        }
        else {
            return Promise.resolve();
        }
    };
    /**
     * 在游戏运行时，每个资源加载url都要经过这个函数
     */
    VersionController.prototype.getVirtualUrl = function (url) {
        // 在开发模式下，所有资源还是以原来的资源路径去加载，方便开发者替换资源
        if (false) {
            return this.getResUrlByVersion(url);
        }
        else {
            return url;
        }
    };
    /**
     * 获得版本控制之后的路径信息
     */
    VersionController.prototype.getResUrlByVersion = function (url) {
        //判断是否为版本控制的资源，其他域的资源，比如玩家头像，或是初始包体里面的资源以原始url加载
        if (url.indexOf(this.resourceRoot) == -1) {
            return url;
        }
        if (url === this.resourceConfigPath) {
            return url;
        }
        //将文件的resourceRoot路径抹去，进而判读文件是否经过版本管理
        url = url.replace(this.resourceRoot, "");
        if (this.versionConfig) {
            // 部分文件可能存在？v=加数字进行控制的形式，在引擎底层这里是不支持加v=的，只会以原始url加载路径，
            // 如果项目中存在类似的情况，将其还原成普通形式
            var index = url.indexOf("?v=");
            if (index != -1) {
                url = url.slice(0, index);
            }
            //取版本控制的的version
            var versionKey = url.replace(this.versionPath, "");
            if (this.versionConfig && this.versionConfig[versionKey]) {
                var version = this.versionConfig[versionKey];
                var ext = url.slice(url.lastIndexOf("."));
                // 原始的文件夹+crc32码+后缀扩展名
                url = this.versionPath + version + ext;
            }
        }
        url = this.resourceRoot + url;
        return url;
    };
    return VersionController;
}());
__reflect(VersionController.prototype, "VersionController", ["RES.IVersionController"]);
//在最开始将AssetsManager的默认版本控制替换掉
RES.registerVersionController(new VersionController());
