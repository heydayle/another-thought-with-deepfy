import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { Day, parseTextResult } from "@/utils/help";
import type { WorkflowRunResponse } from "@/services/dify";
import type { EmotionOutput } from "@/services/history";
import { CheckInDialog } from "./CheckInDialog";
import { TodayEmotionCard } from "./TodayEmotionCard";

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
    <div className="bg-card rounded-xl border border-border p-4 min-w-0 overflow-hidden flex flex-col gap-3">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <h2 className="text-xl font-semibold text-foreground leading-none">
          Today's Emotion
        </h2>

        {todayEmotion && (
          /* Checked-in badge */
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-[11px] font-medium text-green-700 dark:text-green-400 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            Checked in
          </span>
        )}
      </div>

      {/* ── Checked-in state: rich emotion display ──────── */}
      {todayEmotion && (
        <div className="overflow-y-auto flex-1 min-h-0 max-h-[272px] pr-0.5">
          <TodayEmotionCard emotion={todayEmotion} />
        </div>
      )}

      {/* ── Empty state: prompt + dialog trigger ─────────── */}
      {!todayEmotion && (
        <div className="flex flex-col gap-3 flex-1">
          <p className="text-sm text-muted-foreground">
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
        </div>
      )}
    </div>
  );
}
