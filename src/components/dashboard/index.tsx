import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { executeWorkflow } from "@/store/slices/difySlice";
import { Day, parseTextResult } from "@/utils/help";
import { EmotionCheckIn } from "./EmotionCheckIn";
import { WeeklyEmotion } from "./WeeklyEmotion";
import { ChartEmotions } from "./ChartEmotions";
import { useEmotionHistory } from "./hooks/useEmotionHistory";
import { TodayBlock } from "./TodayBlock";

export function Dashboard() {
  const [query, setQuery] = useState("");

  const dispatch = useAppDispatch();
  const { result, loading, error } = useAppSelector((state) => state.dify);

  const outputs = useMemo(() => {
    if (!result?.data?.outputs?.text_result) return null;

    const textResult = result.data.outputs.text_result;
    if (typeof textResult === "string") {
      return parseTextResult(textResult);
    }
    return textResult;
  }, [result]);

  const { history } = useEmotionHistory(outputs);

  const handleRunWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Dispatch the thunk action
    dispatch(executeWorkflow({ your_mine: query }));
  };

  const hasTodayEmotion = () => {
    if (!history) return false;
    return history.some((item) => {
      const date = Day.instance(item.data.created_at);
      const today = Day.instance();
      if (!date || !today) return false;
      return date.isSame(today, "day");
    });
  };

  return (
    <div className="space-y-6 h-[calc(100svh-64px)] overflow-y-auto px-1">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Emotions Tracker
        </h1>
        <p className="text-muted-foreground my-2 text-sm sm:text-base">
          Track your emotions and get insights
        </p>
        <div className="flex flex-col gap-4">
          {/* Top row: check-in card + (optionally today block) + weekly emotion */}
          <div
            className={`grid gap-4 items-start ${hasTodayEmotion()
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-[minmax(0,280px)_1fr]"
              }`}
          >
            {/* Left column: EmotionCheckIn + TodayBlock */}
            <div className="min-w-0 flex flex-col sm:flex-row md:flex-col gap-4">
              <EmotionCheckIn
                history={history}
                query={query}
                setQuery={setQuery}
                handleRunWorkflow={handleRunWorkflow}
                loading={loading}
                error={error}
                result={result}
                outputs={outputs}
              />
              {hasTodayEmotion() && <TodayBlock />}
            </div>
            {/* Right column: WeeklyEmotion */}
            <div className="min-w-0">
              <WeeklyEmotion history={history} />
            </div>
          </div>
          <ChartEmotions history={history} />
        </div>
      </div>
    </div>
  );
}
