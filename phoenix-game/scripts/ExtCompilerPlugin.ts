/**
 * 对原本的CompilePlugin插件做一下扩展
 */
declare global {
    namespace NodeJS {
        interface Global {
            resVersionConfig
            resConfig
        }
    }
}

declare module 'built-in' {
    export interface CompilePlugin {
        onFinish?(pluginContext?: plugins.CommandContext): Promise<void>;
    }
}

import { CompilePlugin } from 'built-in';

export class ExtCompilerPlugin implements plugins.Command {
    constructor() { }

    async onFile(file: plugins.File): Promise<plugins.File | null> {
        return file
    }

    async onFinish(commandContext?: plugins.CommandContext): Promise<void> {
        const cp = new CompilePlugin({
            libraryType: "release",
            defines: {
                DEBUG: false,
                RELEASE: true,
                RES_VERSION_CONFIG: encodeURIComponent(JSON.stringify(global.resVersionConfig)),
                RES_CONFIG: encodeURIComponent(global.resConfig),
                RES_HOST: "mobile/",
                RES_VERSION: Date.now(),
            }
        })
        await commandContext && cp.onFinish && cp.onFinish(commandContext)
    }
}