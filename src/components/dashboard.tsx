import dayjs from "dayjs";
import { parseTextResult } from "@/utils/help";
import { useMemo, useState, useEffect } from "react";
import { Loader2, Play, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { executeWorkflow } from "@/store/slices/difySlice";
import { historyService, type EmotionOutput } from "@/services/history";
import type { WorkflowRunResponse } from "@/services/dify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

function EmotionCheckIn({
  history,
  query,
  setQuery,
  handleRunWorkflow,
  loading,
  error,
  result,
  outputs,
}: EmotionCheckInProps) {
  const [open, setOpen] = useState(false);

  const todayEmotion = useMemo(() => {
    let emotion: EmotionOutput | undefined;

    history?.forEach((output: WorkflowRunResponse) => {
      const date = dayjs.unix(output.data.created_at);
      const today = dayjs();
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
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 mt-4 h-fit">
      <h2 className="text-xl font-semibold text-foreground">Today's Emotion</h2>
      {todayEmotion && (
        <p className="text-muted-foreground mt-2">{todayEmotion.score}</p>
      )}
      {!todayEmotion && (
        <>
          <p className="text-md text-muted-foreground mt-2">
            <b className="text-primary">Tap once</b> to reflect. Takes only 10
            seconds.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="mt-8 cursor-pointer">
                <div className="relative flex items-center justify-center w-10 h-10 my-4 ml-4">
                  <div className="absolute inset-0 rounded-full bg-primary/40 animate-[ripple_6s_infinite]" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-[ripple_6s_infinite_2s]" />
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-[ripple_6s_infinite_4s]" />
                  <div className="relative w-6 h-6 rounded-full bg-primary" />
                </div>
                <p className="text-lg text-foreground font-semibold mt-8">
                  Check-in Today!
                </p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Check-in</DialogTitle>
                <DialogDescription>
                  How are you feeling today?
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <form onSubmit={handleRunWorkflow} className="space-y-4">
                  <div>
                    <label
                      htmlFor="query"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Input Query
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="query"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your query here..."
                        className="flex-1 rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Analyze
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mt-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-destructive mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-destructive">
                          Execution Failed
                        </h3>
                        <p className="mt-1 text-sm text-destructive">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mt-4">
                    <div className="bg-muted/50 px-6 py-4 border-b border-border flex justify-between items-center">
                      <h2 className="text-sm font-semibold text-foreground">
                        Execution Result
                      </h2>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Success
                      </span>
                    </div>
                    <div className="p-6 overflow-x-auto bg-muted/30">
                      <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                        <label htmlFor="score">Score:</label>
                        <span> {outputs?.score}</span>
                        <br />
                        <label htmlFor="your_quote">Your Quote:</label>
                        <p>- {outputs?.your_quote}</p>
                        <label htmlFor="your_feeling">Your Feeling:</label>
                        <p>- {outputs?.your_feeling}</p>
                        <label htmlFor="advice">Advice:</label>
                        <p>- {outputs?.advice}</p>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export function Dashboard() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<WorkflowRunResponse[]>([]);

  const dispatch = useAppDispatch();
  const { result, loading, error } = useAppSelector((state) => state.dify);

  const handleRunWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Dispatch the thunk action
    dispatch(executeWorkflow({ your_mine: query }));
  };

  const outputs = useMemo(() => {
    if (!result?.data?.outputs?.text_result) return null;

    const textResult = result.data.outputs.text_result;
    if (typeof textResult === "string") {
      return parseTextResult(textResult);
    }
    return textResult;
  }, [result]);

  useEffect(() => {
    historyService
      .getAllRuns()
      .then((runs) => {
        const getResponse = runs.map((run) => run.response);
        setHistory(getResponse);

        console.log(
          "IndexedDB Verification: Current saved runs count:",
          runs.length,
        );
      })
      .catch((err) => console.error("IndexedDB Verification Failed:", err));
  }, [outputs]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Emotions Tracker
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your emotions and get insights
        </p>
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
        </div>
      </div>
    </div>
  );
}
