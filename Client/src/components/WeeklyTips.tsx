import { LightbulbIcon } from "lucide-react";
import Card from "../components/ui/Card";

interface WeeklyTipsProps {
  tips: string[];
}

const WeeklyTips = ({ tips }: WeeklyTipsProps) => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <LightbulbIcon className="size-5 text-yellow-500" />

        <h3 className="font-semibold text-slate-800 dark:text-white">
          Weekly Fitness Tips
        </h3>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              {index + 1}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-6">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyTips;