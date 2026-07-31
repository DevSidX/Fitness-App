import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateWorkout = async (workoutData: any) => {
  try {
    const prompt = `
Create a personalized weekly workout plan.

User Details:
- Age: ${workoutData.age}
- Gender: ${workoutData.gender}
- Height: ${workoutData.height} cm
- Weight: ${workoutData.weight} kg
- Goal: ${workoutData.goal}
- Workout Days: ${workoutData.workoutDays}
- Equipment: ${workoutData.equipment}
- Experience: ${workoutData.experience}

Requirements:
- Return ONLY valid JSON.
- Generate exactly ${workoutData.workoutDays} workout days.
- Include warmup, exercises, cooldown, duration and restTime.
- Include 3-5 weekly tips.
`;

    const config = {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          days: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "string" },
                title: { type: "string" },
                duration: { type: "string" },
                restTime: { type: "string" },
                warmup: {
                  type: "array",
                  items: { type: "string" },
                },
                exercises: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      sets: { type: "number" },
                      reps: { type: "string" },
                    },
                  },
                },
                cooldown: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
          weeklyTips: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config,
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const regenerateWorkoutDay = async (workoutData: any) => {
  try {
    const prompt = `
Create a NEW workout ONLY for ${workoutData.day}.

User Details:
- Age: ${workoutData.age}
- Gender: ${workoutData.gender}
- Height: ${workoutData.height} cm
- Weight: ${workoutData.weight} kg
- Goal: ${workoutData.goal}
- Workout Days: ${workoutData.workoutDays}
- Equipment: ${workoutData.equipment}
- Experience: ${workoutData.experience}

Requirements:
- Return ONLY valid JSON.
- Generate ONLY the workout for ${workoutData.day}.
- Include:
  - day
  - title
  - duration
  - restTime
  - warmup
  - exercises
  - cooldown
- Do NOT include weekly tips.
- Make the workout different from a typical routine while still matching the user's goal and experience.
`;

    const config = {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          day: {
            type: "string",
          },
          title: {
            type: "string",
          },
          duration: {
            type: "string",
          },
          restTime: {
            type: "string",
          },
          warmup: {
            type: "array",
            items: {
              type: "string",
            },
          },
          exercises: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                sets: {
                  type: "number",
                },
                reps: {
                  type: "string",
                },
              },
              required: ["name", "sets", "reps"],
            },
          },
          cooldown: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: [
          "day",
          "title",
          "duration",
          "restTime",
          "warmup",
          "exercises",
          "cooldown",
        ],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config,
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error(error);
    throw error;
  }
};