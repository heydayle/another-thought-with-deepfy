import { useEffect, useState } from "react";
import { historyService } from "@/services/history";
import type { WorkflowRunResponse } from "@/services/dify";

interface UseEmotionHistoryReturn {
  history: WorkflowRunResponse[];
  loading: boolean;
  error: Error | null;
}

export function useEmotionHistory(
  outputs: any
): UseEmotionHistoryReturn {
  const [history, setHistory] = useState<WorkflowRunResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    historyService
      .getAllRuns()
      .then((runs) => {
        const getResponse = runs.map((run) => run.response);
        setHistory(getResponse);

        console.log(
          "IndexedDB Verification: Current saved runs count:",
          runs.length
        );
      })
      .catch((err) => {
        console.error("IndexedDB Verification Failed:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [outputs]);

  return { history, loading, error };
}
