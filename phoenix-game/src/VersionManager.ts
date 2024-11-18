/**
 * 版本控制
 */
declare const RES_VERSION_CONFIG;

class VersionController implements RES.IVersionController {
    /**
     * 版本控制信息
     */
    private versionConfig;

    /**
     * resource根路径
     */
    private resourceRoot = RESHOST + "/resource/";

    /**
     * 版本控制的文件夹
     */
    private versionPath = "assets/";

    /**
     * 版本控制信息的所在路径，相对于resource文件夹
     */
    // private versionConfigPath = RESHOST + "resource/version.json" + '?v=' + RESVERSION;

    /**
     * 资源配置信息的所在路径
     */
    private resourceConfigPath = RESHOST + "/resource/default.res.json?v=" + RESVERSION;

    /**
     * 初始化
     */
    init(): Promise<any> {
        if (RELEASE) {//发布模式
            this.versionConfig = JSON.parse(decodeURIComponent(RES_VERSION_CONFIG))
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
        } else {//debug 开发模式
            return Promise.resolve()
        }
    }

    /**
     * 在游戏运行时，每个资源加载url都要经过这个函数
     */
    getVirtualUrl(url: string) {
        // 在开发模式下，所有资源还是以原来的资源路径去加载，方便开发者替换资源
        if (RELEASE) {
            return this.getResUrlByVersion(url);
        } else {
            return url;
        }
    }

    /**
     * 获得版本控制之后的路径信息
     */
    getResUrlByVersion(url: string): string {
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
            const index = url.indexOf("?v=");
            if (index != -1) {
                url = url.slice(0, index);
            }
            //取版本控制的的version
            let versionKey = url.replace(this.versionPath, "");
            if (this.versionConfig && this.versionConfig[versionKey]) {
                const version = this.versionConfig[versionKey];
                const ext = url.slice(url.lastIndexOf("."));
                // 原始的文件夹+crc32码+后缀扩展名
                url = this.versionPath + version + ext;
            }
        }
        url = this.resourceRoot + url;
        return url;
    }
}
//在最开始将AssetsManager的默认版本控制替换掉
RES.registerVersionController(new VersionController());
