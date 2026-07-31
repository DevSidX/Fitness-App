import Card from "../components/ui/Card";

const WorkoutSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((item) => (
        <Card key={item}>
          {/* Header */}
          <div className="space-y-3 mb-6">
            <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>

          {/* Warm-up */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>

          {/* Exercises */}
          <div className="space-y-3 mb-6">
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700"></div>

            {[1, 2, 3].map((exercise) => (
              <div
                key={exercise}
                className="activity-entry-item"
              >
                <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-6 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutSkeleton;