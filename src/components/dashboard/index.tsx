import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { executeWorkflow } from "@/store/slices/difySlice";
import { parseTextResult } from "@/utils/help";
import { EmotionCheckIn } from "./EmotionCheckIn";
import { WeeklyEmotion } from "./WeeklyEmotion";
import { useEmotionHistory } from "./hooks/useEmotionHistory";
import { historyService } from "@/services/history";

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

  const deleteTodayEmotion = () => {
    historyService.deleteRun(result?.data?.log_id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Emotions Tracker
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your emotions and get insights
        </p>
        {(
          <button
            onClick={deleteTodayEmotion}
            className="text-red-500 hover:text-red-600"
          >
            Delete Today's Emotion
          </button>
        )}
        <div className="grid grid-cols-[250px_1fr] gap-2">
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
          <WeeklyEmotion history={history} />
        </div>
      </div>
    </div>
  );
}
