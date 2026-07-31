import { Context } from "koa";
import {
  generateWorkout,
  regenerateWorkoutDay,
} from "../services/gemini";

export default {
  async generate(ctx: Context) {
    try {
      const result = await generateWorkout(ctx.request.body);
      ctx.body = result;
    } catch (error: any) {
      console.error(error);
      ctx.internalServerError("Failed to generate workout");
    }
  },

  async regenerate(ctx: Context) {
    try {
      const result = await regenerateWorkoutDay(ctx.request.body);
      ctx.body = result;
    } catch (error: any) {
      console.error(error);
      ctx.internalServerError("Failed to regenerate workout");
    }
  },
};