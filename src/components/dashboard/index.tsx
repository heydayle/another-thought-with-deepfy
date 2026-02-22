import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { executeWorkflow } from "@/store/slices/difySlice";
import { Day, parseTextResult } from "@/utils/help";
import { EmotionCheckIn } from "./EmotionCheckIn";
import { WeeklyEmotion } from "./WeeklyEmotion";
import { ChartEmotions } from "./ChartEmotions";
import { useEmotionHistory } from "./hooks/useEmotionHistory";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Emotions Tracker
        </h1>
        <p className="text-muted-foreground my-2">
          Track your emotions and get insights
        </p>
        <div className="flex flex-col gap-4">
          <div
            className={`grid gap-4 ${hasTodayEmotion() ? "grid-cols-1" : "grid-cols-[250px_1fr]"} items-start`}
          >
            <div className="min-w-0">
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
            </div>
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
