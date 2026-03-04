import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import dayjs from "dayjs";
import { useChartEmotionsData } from "@/components/dashboard/ChartEmotions/useChartEmotionsData";
import { createMockResponse, createMockHistory, createMockResponseWithStringResult } from "../helpers/mockData";

describe("useChartEmotionsData", () => {
    describe("with empty history", () => {
        it("returns empty chart data", () => {
            const { result } = renderHook(() => useChartEmotionsData([], "last_7"));

            expect(result.current.chartData).toEqual([]);
            expect(result.current.averageScore).toBe(0);
            expect(result.current.highestScore).toBe(0);
            expect(result.current.lowestScore).toBe(0);
        });

        it("returns empty distribution with zero counts", () => {
            const { result } = renderHook(() => useChartEmotionsData([], "last_7"));

            expect(result.current.distribution).toHaveLength(5);
            result.current.distribution.forEach((d) => {
                expect(d.count).toBe(0);
            });
        });
    });

    describe("with valid history", () => {
        const history = createMockHistory([
            { score: 8, daysAgo: 0 },
            { score: 6, daysAgo: 1 },
            { score: 9, daysAgo: 2 },
            { score: 3, daysAgo: 3 },
            { score: 7, daysAgo: 5 },
        ]);

        it("calculates average score correctly", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "last_7"));

            const expectedAvg = (8 + 6 + 9 + 3 + 7) / 5;
            expect(result.current.averageScore).toBeCloseTo(expectedAvg);
        });

        it("finds highest score", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "last_7"));
            expect(result.current.highestScore).toBe(9);
        });

        it("finds lowest score", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "last_7"));
            expect(result.current.lowestScore).toBe(3);
        });

        it("sorts chart data by date ascending", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "last_7"));

            const dates = result.current.chartData.map((d) => d.fullDate);
            const sorted = [...dates].sort();
            expect(dates).toEqual(sorted);
        });

        it("deduplicates entries per day (last entry wins)", () => {
            const today = dayjs().format("YYYY-MM-DD");
            const dupeHistory = [
                createMockResponse({ score: 3, date: today }),
                createMockResponse({ score: 9, date: today }),
            ];

            const { result } = renderHook(() => useChartEmotionsData(dupeHistory, "last_7"));

            const todayEntries = result.current.chartData.filter((d) => d.fullDate === today);
            expect(todayEntries).toHaveLength(1);
            expect(todayEntries[0].score).toBe(9); // last wins
        });
    });

    describe("range filtering", () => {
        const history = createMockHistory([
            { score: 8, daysAgo: 0 },
            { score: 7, daysAgo: 5 },
            { score: 6, daysAgo: 10 },
            { score: 5, daysAgo: 20 },
            { score: 4, daysAgo: 40 },
        ]);

        it("last_7 includes only entries within 7 days", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "last_7"));
            expect(result.current.chartData.length).toBeLessThanOrEqual(2); // daysAgo 0 and 5
        });

        it("last_14 includes entries within 14 days", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "last_14"));
            expect(result.current.chartData.length).toBeLessThanOrEqual(3); // daysAgo 0, 5, 10
        });

        it("last_30 includes entries within 30 days", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "last_30"));
            expect(result.current.chartData.length).toBeLessThanOrEqual(4); // daysAgo 0, 5, 10, 20
        });

        it("all_time includes all entries", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "all_time"));
            expect(result.current.chartData).toHaveLength(5);
        });
    });

    describe("distribution", () => {
        const history = createMockHistory([
            { score: 1, daysAgo: 0 },
            { score: 3, daysAgo: 1 },
            { score: 5, daysAgo: 2 },
            { score: 7, daysAgo: 3 },
            { score: 9, daysAgo: 4 },
        ]);

        it("distributes scores into correct tiers", () => {
            const { result } = renderHook(() => useChartEmotionsData(history, "last_7"));
            const dist = result.current.distribution;

            expect(dist[0].tier).toBe("Very Low (1–2)");
            expect(dist[0].count).toBe(1); // score 1

            expect(dist[1].tier).toBe("Low (3–4)");
            expect(dist[1].count).toBe(1); // score 3

            expect(dist[2].tier).toBe("Neutral (5–6)");
            expect(dist[2].count).toBe(1); // score 5

            expect(dist[3].tier).toBe("High (7–8)");
            expect(dist[3].count).toBe(1); // score 7

            expect(dist[4].tier).toBe("Very High (9–10)");
            expect(dist[4].count).toBe(1); // score 9
        });
    });

    describe("string text_result handling", () => {
        it("parses string text_result correctly", () => {
            const history = [
                createMockResponseWithStringResult({ score: 8, date: dayjs().format("YYYY-MM-DD") }),
            ];

            const { result } = renderHook(() => useChartEmotionsData(history, "last_7"));
            expect(result.current.chartData).toHaveLength(1);
            expect(result.current.chartData[0].score).toBe(8);
        });
    });
});
