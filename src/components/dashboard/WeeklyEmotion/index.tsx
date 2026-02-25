import { Day } from "@/utils/help";
import type { WorkflowRunResponse } from "@/services/dify";
import { WeeklyHeader } from "./WeeklyHeader";
import { DayEmotionCard } from "./DayEmotionCard";
import { useState } from "react";

interface WeeklyEmotionProps {
  history: WorkflowRunResponse[];
}

export function WeeklyEmotion({ history }: WeeklyEmotionProps) {
  const today = Day.instance();
  const [range, setRange] = useState<string>("this_week");

  // Calculate date range based on selected range
  let startOfWeek: ReturnType<typeof Day.instance>;
  let endOfWeek: ReturnType<typeof Day.instance>;

  switch (range) {
    case "last_week":
      startOfWeek = today.subtract(1, "week").startOf("week");
      endOfWeek = today.subtract(1, "week").endOf("week");
      break;
    case "last_month":
      startOfWeek = today.subtract(1, "month").startOf("month");
      endOfWeek = today.subtract(1, "month").endOf("month");
      break;
    case "last_2_weeks":
      startOfWeek = today.subtract(2, "week");
      endOfWeek = today;
      break;
    case "this_month":
      startOfWeek = today.startOf("month");
      endOfWeek = today.endOf("month");
      break;
    case "this_week":
    default:
      startOfWeek = today.startOf("week");
      endOfWeek = today.endOf("week");
      break;
  }

  const weekEmotion = history.filter((output: WorkflowRunResponse) => {
    const date = Day.instance(output.data.created_at);
    return date.isBetween(startOfWeek, endOfWeek, null, "[]");
  });

  // Calculate the number of days to display based on range
  const daysCount =
    range === "last_month" || range === "this_month" || range === "last_2_weeks"
      ? endOfWeek.diff(startOfWeek, "day") + 1
      : 7;

  // Create an array of days in the selected range
  const daysOfWeek = Array.from({ length: daysCount }, (_, i) => {
    const day = startOfWeek.add(i, "day");
    const dayString = day.format("YYYY-MM-DD");

    // Find emotion data for this day
    const emotionData = weekEmotion.find((output: WorkflowRunResponse) => {
      return output.data.created_at === dayString;
    });

    return {
      date: dayString,
      dayName: daysCount === 7 ? day.format("ddd") : day.format("DD/MM"),
      emotionData,
    };
  });

  const averageScore =
    weekEmotion.length > 0
      ? weekEmotion.reduce(
        (acc, output) => acc + output.data.outputs.text_result.score,
        0,
      ) / weekEmotion.length
      : 0;

  const onChangeRange = (range: string) => {
    setRange(range);
  };

  // Choose responsive grid columns based on range type
  const gridCols =
    daysCount <= 7
      ? "grid-cols-4 sm:grid-cols-7"
      : "grid-cols-4 sm:grid-cols-7 md:grid-cols-7";

  return (
    <div className="bg-card rounded-xl p-4 h-fit">
      <WeeklyHeader
        improvementPercentage={averageScore}
        range={range}
        onRangeChange={onChangeRange}
      />
      <div className={`mt-6 mb-0 overflow-x-auto`}>
        <div className={`grid ${gridCols} gap-2 min-w-0`}>
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
    </div>
  );
}
