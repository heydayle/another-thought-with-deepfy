import { useEffect, useState } from "react";
import { historyService } from "@/services/history";
import { parseTextResult } from "@/utils/help";
import type { WorkflowRunResponse } from "@/services/dify";

interface UseEmotionHistoryReturn {
  history: WorkflowRunResponse[];
  loading: boolean;
  error: Error | null;
}

/**
 * Ensures `text_result` is always a parsed object, never a raw JSON string.
 * This prevents downstream consumers from getting `undefined` when accessing
 * properties like `.score`, which would cause the daisy fallback emoji.
 */
function ensureParsedTextResult(response: WorkflowRunResponse): WorkflowRunResponse {
  const raw = response.data?.outputs?.text_result;
  if (typeof raw === "string") {
    const parsed = parseTextResult(raw);
    if (parsed) {
      return {
        ...response,
        data: {
          ...response.data,
          outputs: {
            ...response.data.outputs,
            text_result: parsed,
          },
        },
      };
    }
  }
  return response;
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
        const getResponse = runs.map((run) => ensureParsedTextResult(run.response));
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
