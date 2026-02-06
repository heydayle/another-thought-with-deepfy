import { Loader2, Play } from "lucide-react";

interface EmotionFormProps {
  query: string;
  setQuery: (query: string) => void;
  handleRunWorkflow: (e: React.FormEvent) => void;
  loading: boolean;
}

export function EmotionForm({
  query,
  setQuery,
  handleRunWorkflow,
  loading,
}: EmotionFormProps) {
  return (
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
  );
}
