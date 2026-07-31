import { useState } from "react";
import Card from "../components/ui/Card";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutCard from "../components/WorkoutCard";
import WeeklyTips from "../components/WeeklyTips";
import WorkoutSkeleton from "../components/WorkoutSkeleton";
import type { WorkoutFormData, WorkoutPlan } from "../types/workout";
import { DumbbellIcon } from "lucide-react";
import api from "../config/api";

const WorkoutPlanner = () => {
    const [loading, setLoading] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [weeklyGoal, setWeeklyGoal] = useState(5);
    const [workoutRequest, setWorkoutRequest] = useState<WorkoutFormData | null>(null);
    const [regeneratingDay, setRegeneratingDay] = useState<string | null>(null);

    const handleGenerate = async (formData: WorkoutFormData) => {
        try {
            setLoading(true);

            setWeeklyGoal(formData.workoutDays);

            setWorkoutRequest(formData);

            const { data } = await api.post(
                "/api/workout-planner",
                formData
            );

            setWorkoutPlan(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async (day: string) => {
        if (!workoutRequest || regeneratingDay) return;

        setRegeneratingDay(day);

        try {
            const { data } = await api.post(
                "/api/workout-planner/regenerate",
                {
                    ...workoutRequest,
                    day,
                }
            );

            setWorkoutPlan((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    days: prev.days.map((d) =>
                        d.day === data.day ? data : d
                    ),
                };
            });
        } catch (error) {
            console.error(error);
        } finally {
            setRegeneratingDay(null);
        }
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            AI Workout Planner
                        </h1>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Generate your personalized AI workout plan.
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Weekly Goal
                        </p>

                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            {weeklyGoal} Days
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="page-content-grid">
                {/* Left Side */}
                <div className="space-y-4">
                    <WorkoutForm
                        loading={loading}
                        onGenerate={handleGenerate}
                    />
                </div>

                {/* Right Side */}
                <div className="space-y-4">
                    {!loading && !workoutPlan && (
                        <Card className="text-center py-12 min-h-[320px] flex flex-col items-center justify-center">

                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <DumbbellIcon className="size-8 text-gray-500 dark:text-gray-500" />
                            </div>

                            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                No Workout Generated
                            </h3>

                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                Fill in your workout details and click
                                <span className="font-semibold"> Generate Workout </span>
                                to receive your personalized AI workout plan.
                            </p>

                        </Card>
                    )}

                    {loading && <WorkoutSkeleton />}

                    {!loading && workoutPlan && (
                        <>
                            {workoutPlan.days.map((day) => (
                                <WorkoutCard
                                    key={day.day}
                                    workout={day}
                                    onRegenerate={handleRegenerate}
                                    regenerating={regeneratingDay === day.day}
                                />
                            ))}

                            <WeeklyTips tips={workoutPlan.weeklyTips} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutPlanner;