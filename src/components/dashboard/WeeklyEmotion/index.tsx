import { Day } from "@/utils/help";
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
    const date = Day.instance(output.data.created_at);
    return date.isBetween(startOfWeek, endOfWeek, null, "[]");
  });

  // Create an array of all 7 days in the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = startOfWeek.add(i, 'day');
    const dayString = day.format('YYYY-MM-DD');
    
    // Find emotion data for this day
    const emotionData = weekEmotion.find((output: WorkflowRunResponse) => {
      return output.data.created_at === dayString;
    });
    
    return {
      date: dayString,
      dayName: day.format('ddd'),
      emotionData
    };
  });

  const averageScore = weekEmotion.length > 0 
    ? weekEmotion.reduce((acc, output) => acc + output.data.outputs.text_result.score, 0) / weekEmotion.length 
    : 0;

  return (
    <div className="bg-card rounded-xl border border-border p-4 mt-4 h-full">
      <WeeklyHeader improvementPercentage={averageScore}/>
      <div className="mt-8 grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
            <div key={day.date}>
                <DayEmotionCard
                    dayName={day.dayName}
                    score={day.emotionData?.data?.outputs?.text_result?.score || 0}
                />
            </div>
        ))}
      </div>
    </div>
  );
}
