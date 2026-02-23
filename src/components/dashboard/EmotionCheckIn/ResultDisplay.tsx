import { AlertCircle } from "lucide-react";
import type { WorkflowRunResponse } from "@/services/dify";

interface ResultDisplayProps {
  error: string | null;
  result: WorkflowRunResponse | null;
  outputs: any;
}

export function ResultDisplay({ error, result, outputs }: ResultDisplayProps) {
  return (
    <>
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
        <div className="bg-card rounded-xl overflow-hidden mt-4">
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
    </>
  );
}
