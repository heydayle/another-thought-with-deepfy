import { useMemo, useState } from "react";
import { Day, parseTextResult } from "@/utils/help";
import type { WorkflowRunResponse } from "@/services/dify";
import type { EmotionOutput } from "@/services/history";
import { CheckInDialog } from "./CheckInDialog";

interface EmotionCheckInProps {
  history: WorkflowRunResponse[];
  query: string;
  setQuery: (query: string) => void;
  handleRunWorkflow: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  result: WorkflowRunResponse | null;
  outputs: any;
}

export function EmotionCheckIn({
  history,
  query,
  setQuery,
  handleRunWorkflow,
  loading,
  error,
  result,
  outputs,
}: EmotionCheckInProps) {

  const todayEmotion = useMemo(() => {
    let emotion: EmotionOutput | undefined;

    history?.forEach((output: WorkflowRunResponse) => {
      const date = Day.instance(output.data.created_at);
      const today = Day.instance();
      if (!date || !today) return;

      if (date.isSame(today, "day")) {
        const textResult = output.data.outputs.text_result;
        emotion = (
          typeof textResult === "string"
            ? parseTextResult(textResult)
            : textResult
        ) as EmotionOutput;
      }
    });
    return emotion;
  }, [outputs, history]);

  return (
    <div className="bg-card rounded-xl border border-border p-4 mt-4 h-full">
      <h2 className="text-xl font-semibold text-foreground">Today's Emotion</h2>
      {todayEmotion && (
        <>
          <p className="text-foreground mt-2">{todayEmotion.score_label}</p>
          <p className="text-xs text-muted-foreground">{todayEmotion.your_quote}</p>
        </>
      )}
      {!todayEmotion && (
        <>
          <p className="text-md text-muted-foreground mt-2">
            <b className="text-primary">Tap once</b> to reflect. Takes only 10
            seconds.
          </p>
          <CheckInDialog
            query={query}
            setQuery={setQuery}
            handleRunWorkflow={handleRunWorkflow}
            loading={loading}
            error={error}
            result={result}
            outputs={outputs}
          />
        </>
      )}
    </div>
  );
}
