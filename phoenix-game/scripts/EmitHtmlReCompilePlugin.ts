import * as fs from 'fs'

export class EmitHtmlReCompilePlugin implements plugins.Command {
    private htmlPath: string = ''

    constructor(htmlPath) {
        this.htmlPath = htmlPath
    }

    async onFile(file: plugins.File): Promise<plugins.File | null> {
        return file
    }

    async onFinish(commandContext?: plugins.CommandContext): Promise<void> {
        if (!this.htmlPath) {
            return
        }
        let fileData = fs.readFileSync(this.htmlPath)
        fs.writeFileSync(this.htmlPath, fileData)
    }
}