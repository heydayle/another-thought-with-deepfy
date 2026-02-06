import { Day, dateToDayOfWeek } from "@/utils/help";
import type { WorkflowRunResponse } from "@/services/dify";
import { WeeklyHeader } from "./WeeklyHeader";
import { DayEmotionCard } from "./DayEmotionCard";

interface WeeklyEmotionProps {
  history: WorkflowRunResponse[];
}

export function WeeklyEmotion({ history }: WeeklyEmotionProps) {
  const today = Day.instance();
  const startOfWeek = today.startOf("week");
  const endOfWeek = today.endOf("week");
  
  const weekEmotion = history.filter((output: WorkflowRunResponse) => {
    const date = Day.unixToDayjs(output.data.created_at);
    return date.isBetween(startOfWeek, endOfWeek, null, "[]");
  });

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 mt-4 h-full">
      <WeeklyHeader />
      <div className="mt-8 grid grid-cols-7 gap-2">
        {weekEmotion.map((output: WorkflowRunResponse, index) => (
            <div key={index}>
                <DayEmotionCard
                    dayName={dateToDayOfWeek(output.data.created_at)}
                    score={output.data.outputs.text_result.score}
                />
            </div>
        ))}
      </div>
    </div>
  );
}
