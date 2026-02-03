import { useMemo, useState } from "react";
import { Loader2, Play, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { executeWorkflow } from "@/store/slices/difySlice";

export function Dashboard() {
  const [query, setQuery] = useState("");

  const dispatch = useAppDispatch();
  const { result, loading, error } = useAppSelector((state) => state.dify);

  const handleRunWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Dispatch the thunk action
    dispatch(executeWorkflow({ your_mine: query }));
  };

  const outputs = useMemo(() => {
    if (!result) return null;
    const parseResult = JSON.parse(result.data?.outputs?.text_result);

    return parseResult || "";
  }, [result]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Workflow Dashboard (Redux)
        </h1>
        <p className="text-gray-500 mt-2">
          Execute your Dify workflow and view the results. State is managed by
          Redux Toolkit.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleRunWorkflow} className="space-y-4">
          <div>
            <label
              htmlFor="query"
              className="block text-sm font-medium text-gray-700 mb-1"
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
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Execution Failed
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-900">
              Execution Result
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Success
            </span>
          </div>
          <div className="p-6 overflow-x-auto bg-gray-50/50">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
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
