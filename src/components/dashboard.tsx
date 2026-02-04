import { useMemo, useState, useEffect } from "react";
import { Loader2, Play, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { executeWorkflow } from "@/store/slices/difySlice";
import { historyService } from "@/services/history";

export function Dashboard() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    historyService
      .getAllRuns()
      .then((runs) => {
        console.log(
          "IndexedDB Verification: Current saved runs count:",
          runs.length,
        );
      })
      .catch((err) => console.error("IndexedDB Verification Failed:", err));
  }, []);

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

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textResult = result.data.outputs.text_result as any;
      const parseResult = JSON.parse(textResult);
      return parseResult;
    } catch (e) {
      console.error("Failed to parse JSON", e);
      return null;
    }
  }, [result]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Workflow Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Execute your Dify workflow and view the results. State is managed by
          Redux Toolkit.
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
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
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Workflow
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
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
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
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
              <span> {outputs.score}</span>
              <br />
              <label htmlFor="your_quote">Your Quote:</label>
              <p>- {outputs.your_quote}</p>
              <label htmlFor="your_feeling">Your Feeling:</label>
              <p>- {outputs.your_feeling}</p>
              <label htmlFor="advice">Advice:</label>
              <p>- {outputs.advice}</p>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
