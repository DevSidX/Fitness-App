export interface WorkoutFormData {
    age: number;
    gender: 'male' | 'female';
    height: number;
    weight: number;
    goal: 'lose' | 'maintain' | 'gain';
    workoutDays: number;
    equipment: 'gym' | 'home';
    experience: 'beginner' | 'intermediate' | 'advanced';
}

export interface Exercise {
    name: string;
    sets: number;
    reps: string;
}

export interface WorkoutDay {
    day: string;
    title: string;
    duration: string;
    restTime: string;
    warmup: string[];
    exercises: Exercise[];
    cooldown: string[];
}

export interface WorkoutPlan {
    days: WorkoutDay[];
    weeklyTips: string[];
}