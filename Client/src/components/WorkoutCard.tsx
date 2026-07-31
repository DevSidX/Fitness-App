import { RotateCcwIcon, Clock3Icon, TimerResetIcon } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import type { WorkoutDay } from "../types/workout";
import { Loader2, RefreshCw } from "lucide-react";

interface WorkoutCardProps {
    workout: WorkoutDay;
    onRegenerate: (day: string) => void;
    regenerating?: boolean;
}

const WorkoutCard = ({ workout, onRegenerate, regenerating }: WorkoutCardProps) => {
    return (
        <Card>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                        {workout.day}
                    </h3>

                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                        {workout.title}
                    </p>
                </div>

                <Button
                    variant={regenerating ? "primary" : "secondary"}
                    disabled={regenerating}
                    onClick={() => onRegenerate(workout.day)}
                >
                    {regenerating ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Regenerating...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="size-4" />
                            Regenerate
                        </>
                    )}
                </Button>
            </div>

            {/* Warm-up */}
            <div className="mb-5">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Warm-up
                </h4>

                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {workout.warmup.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Exercises */}
            <div className="mb-5">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
                    Exercises
                </h4>

                <div className="space-y-3">
                    {workout.exercises.map((exercise, index) => (
                        <div
                            key={index}
                            className="activity-entry-item"
                        >
                            <div>
                                <p className="font-medium text-slate-800 dark:text-white">
                                    {exercise.name}
                                </p>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {exercise.sets} Sets × {exercise.reps} Reps
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cool-down */}
            <div className="mb-5">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Cool-down
                </h4>

                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {workout.cooldown.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap gap-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-center gap-2">
                    <Clock3Icon className="size-5 text-emerald-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        {workout.duration}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <TimerResetIcon className="size-5 text-emerald-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        Rest: {workout.restTime}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default WorkoutCard;