import { describe, it, expect } from "vitest";
import { createMockResponse, createMockResponseWithStringResult } from "../helpers/mockData";

/**
 * Import the ensureParsedTextResult logic by testing it indirectly
 * through the pattern used in useEmotionHistory.
 * We test the parsing logic directly here since the function is not exported.
 */
import { parseTextResult } from "@/utils/help";
import type { WorkflowRunResponse } from "@/services/dify";

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

describe("ensureParsedTextResult", () => {
    it("returns response as-is when text_result is already an object", () => {
        const response = createMockResponse({ score: 8 });
        const result = ensureParsedTextResult(response);

        expect(result.data.outputs.text_result.score).toBe(8);
        expect(typeof result.data.outputs.text_result).toBe("object");
    });

    it("parses string text_result into an object", () => {
        const response = createMockResponseWithStringResult({ score: 9 });
        expect(typeof response.data.outputs.text_result).toBe("string");

        const result = ensureParsedTextResult(response);
        expect(typeof result.data.outputs.text_result).toBe("object");
        expect(result.data.outputs.text_result.score).toBe(9);
    });

    it("preserves all other response fields", () => {
        const response = createMockResponseWithStringResult({ score: 5 });
        const result = ensureParsedTextResult(response);

        expect(result.log_id).toBe(response.log_id);
        expect(result.task_id).toBe(response.task_id);
        expect(result.data.id).toBe(response.data.id);
        expect(result.data.workflow_id).toBe(response.data.workflow_id);
        expect(result.data.status).toBe(response.data.status);
        expect(result.data.created_at).toBe(response.data.created_at);
    });

    it("handles markdown-wrapped JSON string", () => {
        const response = createMockResponse({ score: 7 });
        response.data.outputs.text_result = '```json\n{"score": 7, "your_feeling": "Good"}\n```';

        const result = ensureParsedTextResult(response);
        expect(result.data.outputs.text_result.score).toBe(7);
        expect(result.data.outputs.text_result.your_feeling).toBe("Good");
    });

    it("returns original response for unparseable string", () => {
        const response = createMockResponse({ score: 7 });
        response.data.outputs.text_result = "not valid json";

        const result = ensureParsedTextResult(response);
        expect(result.data.outputs.text_result).toBe("not valid json");
    });

    it("does not mutate the original response", () => {
        const response = createMockResponseWithStringResult({ score: 6 });
        const original = response.data.outputs.text_result;

        ensureParsedTextResult(response);
        expect(response.data.outputs.text_result).toBe(original);
    });
});

describe("WeeklyEmotion score access pattern", () => {
    it("accessing .score on parsed object returns the number", () => {
        const response = createMockResponse({ score: 8 });
        const parsed = ensureParsedTextResult(response);

        const score = parsed.data?.outputs?.text_result?.score || 0;
        expect(score).toBe(8);
    });

    it("accessing .score on unparsed string returns 0 (the bug case)", () => {
        const response = createMockResponseWithStringResult({ score: 8 });
        // WITHOUT parsing: .score on a string is undefined → falls back to 0
        const score = response.data?.outputs?.text_result?.score || 0;
        expect(score).toBe(0); // This was the daisy flower bug

        // WITH parsing: .score works correctly
        const fixed = ensureParsedTextResult(response);
        const fixedScore = fixed.data?.outputs?.text_result?.score || 0;
        expect(fixedScore).toBe(8);
    });
});
