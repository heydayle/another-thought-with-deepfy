import { initDB } from '@/lib/db';
import type { WorkflowRunResponse } from '@/services/dify';

export interface EmotionOutput {
    timestamp: string;
    score: number;
    score_label: string;
    your_quote: string;
    your_feeling: string;
    advice: string;
}

export interface SavedWorkflowRun {
    log_id: string;
    inputs: Record<string, string>;
    response: WorkflowRunResponse;
    created_at: string;
}

export const historyService = {
    async addRun(run: SavedWorkflowRun) {
        const db = await initDB();
        await db.put('workflow_runs', run);
    },

    async getAllRuns() {
        const db = await initDB();
        // Return structured as SavedWorkflowRun[]
        return db.getAllFromIndex('workflow_runs', 'created_at') as Promise<SavedWorkflowRun[]>;
    },

    async getRun(logId: string) {
        const db = await initDB();
        return db.get('workflow_runs', logId) as Promise<SavedWorkflowRun | undefined>;
    },

    async deleteRun(logId: string) {
        const db = await initDB();
        await db.delete('workflow_runs', logId);
    },

    async clearHistory() {
        const db = await initDB();
        await db.clear('workflow_runs');
    }
};
