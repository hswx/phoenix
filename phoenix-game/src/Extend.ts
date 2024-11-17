declare namespace egret {
    const web: any
}

egret.web.WebTouchHandler.prototype.prevent = function (event) {
    event.stopPropagation();
}

egret.web.WebPlayer.prototype.updateScreenSize = function () {
    var canvas = this.canvas;
    if (canvas['userTyping'])
        return;
    var option = this.playerOption;
    var screenRect = this.container.getBoundingClientRect();
    var top = 0;
    var boundingClientWidth = screenRect.width;
    var boundingClientHeight = screenRect.height;
    if (boundingClientWidth == 0 || boundingClientHeight == 0) {
        return;
    }
    if (screenRect.top < 0) {
        boundingClientHeight += screenRect.top;
        top = -screenRect.top;
    }
    var shouldRotate = false;
    var orientation = this.stage.$orientation;
    if (orientation != egret.OrientationMode.AUTO) {
        shouldRotate = orientation != egret.OrientationMode.PORTRAIT && boundingClientHeight > boundingClientWidth
            || orientation == egret.OrientationMode.PORTRAIT && boundingClientWidth > boundingClientHeight;
    }
    var screenWidth = shouldRotate ? boundingClientHeight : boundingClientWidth;
    var screenHeight = shouldRotate ? boundingClientWidth : boundingClientHeight;
    egret.Capabilities["boundingClientWidth" + ""] = screenWidth;
    egret.Capabilities["boundingClientHeight" + ""] = screenHeight;
    var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, option.contentWidth, option.contentHeight);
    var stageWidth = stageSize.stageWidth;
    var stageHeight = stageSize.stageHeight;
    var displayWidth = stageSize.displayWidth;
    var displayHeight = stageSize.displayHeight;
    canvas.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
    if (canvas.width != stageWidth) {
        canvas.width = stageWidth;
    }
    if (canvas.height != stageHeight) {
        canvas.height = stageHeight;
    }
    var rotation = 0;
    if (shouldRotate) {
        if (orientation == egret.OrientationMode.LANDSCAPE) {
            rotation = 90;
            canvas.style.top = top + (boundingClientHeight - displayWidth) / 2 + "px";
            canvas.style.left = (boundingClientWidth + displayHeight) / 2 + "px";
        }
        else {
            rotation = -90;
            canvas.style.top = top + (boundingClientHeight + displayWidth) / 2 + "px";
            canvas.style.left = (boundingClientWidth - displayHeight) / 2 + "px";
        }
    }
    else {
        canvas.style.top = top + (boundingClientHeight - displayHeight) / 2 + "px";
        canvas.style.left = (boundingClientWidth - displayWidth) / 2 + "px";
    }
    var scalex = displayWidth / stageWidth, scaley = displayHeight / stageHeight;
    var canvasScaleX = scalex * egret.sys.DisplayList.$canvasScaleFactor;
    var canvasScaleY = scaley * egret.sys.DisplayList.$canvasScaleFactor;
    if (egret.Capabilities.renderMode == "canvas") {
        canvasScaleX = Math.ceil(canvasScaleX);
        canvasScaleY = Math.ceil(canvasScaleY);
    }
    var m = egret.Matrix.create();
    m.identity();
    canvas.style.top = 0 + "px";
    canvas.style.left = 0 + "px";
    m.scale(scalex / canvasScaleX, scaley / canvasScaleY);
    m.rotate(rotation * Math.PI / 180);
    var transform = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.tx + "," + m.ty + ")";
    egret.Matrix.release(m);
    canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
    egret.sys.DisplayList.$setCanvasScale(canvasScaleX, canvasScaleX);
    this.webTouchHandler.updateScaleMode(scalex, scalex, rotation);
    this.webInput.$updateSize();
    this.player.updateStageSize(stageWidth, stageHeight); //不要在这个方法后面修改属性
    if (egret.nativeRender) {
        canvas.width = stageWidth * canvasScaleX;
        canvas.height = stageHeight * canvasScaleX;
    }
};

declare const RES_CONFIG

declare namespace RES {
    let config
    module processor {
        let _map
    }
}

if (RELEASE) {
    RES.processor._map.legacyResourceConfig = {
        onLoadStart: function (host, resource) {
            return Promise.resolve(JSON.parse(decodeURIComponent(RES_CONFIG)))
                .then(function (data: any) {
                    var resConfigData = RES.config.config;
                    var root = resource.root;
                    var fileSystem = resConfigData.fileSystem;
                    if (!fileSystem) {
                        fileSystem = {
                            fsData: {},
                            getFile: function (filename) {
                                return fsData[filename];
                            },
                            addFile: function (data) {
                                if (!data.type)
                                    data.type = "";
                                if (root == undefined) {
                                    data.root = "";
                                }
                                fsData[data.name] = data;
                            },
                            profile: function () {
                                console.log(fsData);
                            },
                            removeFile: function (filename) {
                                delete fsData[filename];
                            }
                        };
                        resConfigData.fileSystem = fileSystem;
                    }
                    var groups = resConfigData.groups;
                    for (var _i = 0, _a = data.groups; _i < _a.length; _i++) {
                        var g = _a[_i];
                        if (g.keys == "") {
                            groups[g.name] = [];
                        }
                        else {
                            groups[g.name] = g.keys.split(",");
                        }
                    }
                    var alias = resConfigData.alias;
                    var fsData = fileSystem['fsData'];
                    var _loop_1 = function (resource_1) {
                        fsData[resource_1.name] = resource_1;
                        fsData[resource_1.name].root = root;
                        if (resource_1.subkeys) {
                            resource_1.subkeys.split(",").forEach(function (subkey) {
                                alias[subkey] = resource_1.name + "#" + subkey;
                                alias[resource_1.name + "." + subkey] = resource_1.name + "#" + subkey;
                            });
                        }
                    };
                    for (var _b = 0, _c = data.resources; _b < _c.length; _b++) {
                        var resource_1 = _c[_b];
                        _loop_1(resource_1);
                    }
                    host.save(resource, data);
                    return data;
                });
        },
        onRemoveStart: function () {
        }
    };
}

declare const resPath;
declare const resVersion;

declare module RES {
    function getResAsync(key: string): Promise<any>;
}
