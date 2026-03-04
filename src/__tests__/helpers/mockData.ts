import dayjs from "dayjs";
import type { WorkflowRunResponse } from "@/services/dify";

/**
 * Create a mock WorkflowRunResponse for testing.
 */
export function createMockResponse(
    overrides: {
        score?: number;
        date?: string;
        feeling?: string;
        quote?: string;
        advice?: string;
        scoreLabel?: string;
    } = {}
): WorkflowRunResponse {
    const {
        score = 7,
        date = dayjs().format("YYYY-MM-DD"),
        feeling = "Feeling good",
        quote = "Life is beautiful",
        advice = "Keep going",
        scoreLabel = "Happy",
    } = overrides;

    return {
        log_id: crypto.randomUUID(),
        task_id: `task-${crypto.randomUUID()}`,
        data: {
            id: `run-${crypto.randomUUID()}`,
            workflow_id: "wf-test",
            status: "succeeded",
            outputs: {
                text_result: {
                    score,
                    score_label: scoreLabel,
                    your_feeling: feeling,
                    your_quote: quote,
                    advice,
                },
            },
            error: null,
            elapsed_time: 1.5,
            total_tokens: 100,
            total_steps: 3,
            created_at: date,
            finished_at: date,
        },
    };
}

/**
 * Create a mock response with text_result as a raw JSON string (unparsed).
 */
export function createMockResponseWithStringResult(
    overrides: {
        score?: number;
        date?: string;
        feeling?: string;
    } = {}
): WorkflowRunResponse {
    const {
        score = 7,
        date = dayjs().format("YYYY-MM-DD"),
        feeling = "Feeling good",
    } = overrides;

    return {
        log_id: crypto.randomUUID(),
        task_id: `task-${crypto.randomUUID()}`,
        data: {
            id: `run-${crypto.randomUUID()}`,
            workflow_id: "wf-test",
            status: "succeeded",
            outputs: {
                text_result: JSON.stringify({
                    score,
                    score_label: "Happy",
                    your_feeling: feeling,
                    your_quote: "A quote",
                    advice: "Some advice",
                }),
            },
            error: null,
            elapsed_time: 1.5,
            total_tokens: 100,
            total_steps: 3,
            created_at: date,
            finished_at: date,
        },
    };
}

/**
 * Generate an array of mock responses spanning multiple days.
 */
export function createMockHistory(
    entries: { score: number; daysAgo: number }[]
): WorkflowRunResponse[] {
    return entries.map(({ score, daysAgo }) =>
        createMockResponse({
            score,
            date: dayjs().subtract(daysAgo, "day").format("YYYY-MM-DD"),
        })
    );
}
