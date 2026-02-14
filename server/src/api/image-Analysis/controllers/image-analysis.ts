import { Context } from "koa"
import { analyzeImage } from "../services/gemini"

export default {
    async analyze(ctx: Context) {
        const file = ctx.request.files?.image as any
        if (!file) {
            return ctx.badRequest('No image Uploaded')
        }
        const filePath = file.filepath

        // if filepath is available
        try {
            const result = await analyzeImage(filePath)
            return ctx.send({ success: true, result })
        } catch (error) {
            ctx.internalServerError('Analysis Failed', {error: error.message})
        }
    }
}