import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { WorkflowRunResponse } from "@/services/dify";
import { CheckInTrigger } from "./CheckInTrigger";
import { EmotionForm } from "./EmotionForm";
import { ResultDisplay } from "./ResultDisplay";
import { useState } from "react";

interface CheckInDialogProps {
  query: string;
  setQuery: (query: string) => void;
  handleRunWorkflow: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  result: WorkflowRunResponse | null;
  outputs: any;
}

export function CheckInDialog({
  query,
  setQuery,
  handleRunWorkflow,
  loading,
  error,
  result,
  outputs,
}: CheckInDialogProps) {

  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CheckInTrigger onOpen={setOpen} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Check-in</DialogTitle>
          <DialogDescription>How are you feeling today?</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EmotionForm
            query={query}
            setQuery={setQuery}
            handleRunWorkflow={handleRunWorkflow}
            loading={loading}
          />
          <ResultDisplay error={error} result={result} outputs={outputs} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
