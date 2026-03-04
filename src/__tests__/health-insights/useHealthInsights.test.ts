import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import dayjs from "dayjs";
import { useHealthInsights } from "@/components/health-insights/useHealthInsights";
import { createMockResponse, createMockHistory } from "../helpers/mockData";

describe("useHealthInsights", () => {
    describe("with empty history", () => {
        it("returns zero values for all metrics", () => {
            const { result } = renderHook(() => useHealthInsights([]));

            expect(result.current.dataPoints).toEqual([]);
            expect(result.current.averageScore).toBe(0);
            expect(result.current.highestScore).toBe(0);
            expect(result.current.lowestScore).toBe(0);
            expect(result.current.overallScore).toBe(0);
            expect(result.current.positiveRatio).toBe(0);
            expect(result.current.last7DaysAvg).toBe(0);
            expect(result.current.last30DaysAvg).toBe(0);
        });

        it("returns stable mood trend", () => {
            const { result } = renderHook(() => useHealthInsights([]));
            expect(result.current.moodTrend.direction).toBe("stable");
            expect(result.current.moodTrend.magnitude).toBe(0);
        });

        it("returns zero streak", () => {
            const { result } = renderHook(() => useHealthInsights([]));
            expect(result.current.streak.currentStreak).toBe(0);
            expect(result.current.streak.longestStreak).toBe(0);
            expect(result.current.streak.totalEntries).toBe(0);
        });

        it("returns null for bestDay, worstDay, mostCommonEmotion", () => {
            const { result } = renderHook(() => useHealthInsights([]));
            expect(result.current.bestDay).toBeNull();
            expect(result.current.worstDay).toBeNull();
            expect(result.current.mostCommonEmotion).toBeNull();
        });

        it("returns empty advice", () => {
            const { result } = renderHook(() => useHealthInsights([]));
            expect(result.current.recentAdvice).toEqual([]);
        });

        it("returns full stability for empty data", () => {
            // With < 2 data points, stability defaults to 100
            const { result } = renderHook(() => useHealthInsights([]));
            expect(result.current.moodStability).toBe(100);
        });
    });

    describe("basic stats", () => {
        const history = createMockHistory([
            { score: 8, daysAgo: 0 },
            { score: 6, daysAgo: 1 },
            { score: 9, daysAgo: 2 },
            { score: 3, daysAgo: 3 },
            { score: 7, daysAgo: 4 },
        ]);

        it("calculates average score", () => {
            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.averageScore).toBeCloseTo((8 + 6 + 9 + 3 + 7) / 5);
        });

        it("finds highest score", () => {
            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.highestScore).toBe(9);
        });

        it("finds lowest score", () => {
            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.lowestScore).toBe(3);
        });

        it("calculates total entries", () => {
            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.streak.totalEntries).toBe(5);
        });

        it("sorts data points by date ascending", () => {
            const { result } = renderHook(() => useHealthInsights(history));
            const dates = result.current.dataPoints.map((d) => d.date);
            const sorted = [...dates].sort();
            expect(dates).toEqual(sorted);
        });
    });

    describe("streak calculation", () => {
        it("counts consecutive days from today", () => {
            const history = createMockHistory([
                { score: 7, daysAgo: 0 },
                { score: 7, daysAgo: 1 },
                { score: 7, daysAgo: 2 },
                // gap at daysAgo: 3
                { score: 7, daysAgo: 4 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.streak.currentStreak).toBe(3);
        });

        it("streak starts from yesterday if no entry today", () => {
            const history = createMockHistory([
                { score: 7, daysAgo: 1 },
                { score: 7, daysAgo: 2 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            // The algorithm skips today (i=0), then counts daysAgo 1 and 2
            expect(result.current.streak.currentStreak).toBe(2);
        });

        it("calculates longest streak", () => {
            const history = createMockHistory([
                { score: 7, daysAgo: 0 },
                { score: 7, daysAgo: 1 },
                // gap
                { score: 7, daysAgo: 5 },
                { score: 7, daysAgo: 6 },
                { score: 7, daysAgo: 7 },
                { score: 7, daysAgo: 8 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.streak.longestStreak).toBe(4); // daysAgo 5-8
        });
    });

    describe("mood trend", () => {
        it("detects improving trend", () => {
            // First half low, second half high
            const history = createMockHistory([
                { score: 2, daysAgo: 7 },
                { score: 3, daysAgo: 6 },
                { score: 2, daysAgo: 5 },
                { score: 3, daysAgo: 4 },
                { score: 8, daysAgo: 3 },
                { score: 9, daysAgo: 2 },
                { score: 8, daysAgo: 1 },
                { score: 9, daysAgo: 0 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.moodTrend.direction).toBe("improving");
        });

        it("detects declining trend", () => {
            const history = createMockHistory([
                { score: 9, daysAgo: 7 },
                { score: 8, daysAgo: 6 },
                { score: 9, daysAgo: 5 },
                { score: 8, daysAgo: 4 },
                { score: 2, daysAgo: 3 },
                { score: 3, daysAgo: 2 },
                { score: 2, daysAgo: 1 },
                { score: 3, daysAgo: 0 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.moodTrend.direction).toBe("declining");
        });

        it("detects stable trend for consistent scores", () => {
            const history = createMockHistory([
                { score: 7, daysAgo: 7 },
                { score: 7, daysAgo: 6 },
                { score: 7, daysAgo: 5 },
                { score: 7, daysAgo: 4 },
                { score: 7, daysAgo: 3 },
                { score: 7, daysAgo: 2 },
                { score: 7, daysAgo: 1 },
                { score: 7, daysAgo: 0 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.moodTrend.direction).toBe("stable");
        });

        it("returns stable for fewer than 4 entries", () => {
            const history = createMockHistory([
                { score: 2, daysAgo: 0 },
                { score: 10, daysAgo: 1 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.moodTrend.direction).toBe("stable");
        });
    });

    describe("day of week stats", () => {
        it("returns all 7 days in order", () => {
            const { result } = renderHook(() => useHealthInsights([]));
            const days = result.current.dayOfWeekStats.map((d) => d.day);
            expect(days).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
        });

        it("calculates average per day of week", () => {
            // Create entries on known days
            const monday1 = dayjs().startOf("week").add(1, "day"); // Monday
            const monday2 = monday1.subtract(7, "day"); // Previous Monday

            const history = [
                createMockResponse({ score: 8, date: monday1.format("YYYY-MM-DD") }),
                createMockResponse({ score: 4, date: monday2.format("YYYY-MM-DD") }),
            ];

            const { result } = renderHook(() => useHealthInsights(history));
            const mondayStat = result.current.dayOfWeekStats.find((d) => d.day === "Mon");

            expect(mondayStat).toBeDefined();
            expect(mondayStat!.avgScore).toBeCloseTo(6); // (8 + 4) / 2
            expect(mondayStat!.count).toBe(2);
        });

        it("identifies best and worst days", () => {
            // Mon=high, Fri=low
            const monday = dayjs().startOf("week").add(1, "day");
            const friday = dayjs().startOf("week").add(5, "day");

            const history = [
                createMockResponse({ score: 9, date: monday.format("YYYY-MM-DD") }),
                createMockResponse({ score: 2, date: friday.format("YYYY-MM-DD") }),
            ];

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.bestDay?.day).toBe("Mon");
            expect(result.current.worstDay?.day).toBe("Fri");
        });
    });

    describe("positive ratio", () => {
        it("calculates percentage of scores >= 7", () => {
            const history = createMockHistory([
                { score: 8, daysAgo: 0 },
                { score: 9, daysAgo: 1 },
                { score: 3, daysAgo: 2 },
                { score: 7, daysAgo: 3 },
                { score: 5, daysAgo: 4 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            // 3 out of 5 are >= 7 → 60%
            expect(result.current.positiveRatio).toBe(60);
        });

        it("returns 100% when all scores are high", () => {
            const history = createMockHistory([
                { score: 8, daysAgo: 0 },
                { score: 9, daysAgo: 1 },
                { score: 10, daysAgo: 2 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.positiveRatio).toBe(100);
        });

        it("returns 0% when all scores are low", () => {
            const history = createMockHistory([
                { score: 2, daysAgo: 0 },
                { score: 3, daysAgo: 1 },
                { score: 1, daysAgo: 2 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.positiveRatio).toBe(0);
        });
    });

    describe("mood stability", () => {
        it("returns 100 for single entry", () => {
            const history = createMockHistory([{ score: 7, daysAgo: 0 }]);
            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.moodStability).toBe(100);
        });

        it("returns high stability for consistent scores", () => {
            const history = createMockHistory([
                { score: 7, daysAgo: 0 },
                { score: 7, daysAgo: 1 },
                { score: 7, daysAgo: 2 },
                { score: 7, daysAgo: 3 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.moodStability).toBe(100);
        });

        it("returns lower stability for varied scores", () => {
            const history = createMockHistory([
                { score: 1, daysAgo: 0 },
                { score: 10, daysAgo: 1 },
                { score: 1, daysAgo: 2 },
                { score: 10, daysAgo: 3 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.moodStability).toBeLessThan(50);
        });
    });

    describe("most common emotion", () => {
        it("finds the most frequent score", () => {
            const history = createMockHistory([
                { score: 7, daysAgo: 0 },
                { score: 7, daysAgo: 1 },
                { score: 7, daysAgo: 2 },
                { score: 3, daysAgo: 3 },
                { score: 5, daysAgo: 4 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.mostCommonEmotion).not.toBeNull();
            expect(result.current.mostCommonEmotion!.count).toBe(3);
        });
    });

    describe("recent advice", () => {
        it("returns up to 5 recent advice entries", () => {
            const history = createMockHistory([
                { score: 7, daysAgo: 0 },
                { score: 6, daysAgo: 1 },
                { score: 8, daysAgo: 2 },
                { score: 5, daysAgo: 3 },
                { score: 9, daysAgo: 4 },
                { score: 4, daysAgo: 5 },
                { score: 7, daysAgo: 6 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.recentAdvice.length).toBeGreaterThan(0);
            expect(result.current.recentAdvice.length).toBeLessThanOrEqual(5);
        });

        it("returns advice strings from data", () => {
            const history = [
                createMockResponse({ score: 7, date: dayjs().format("YYYY-MM-DD"), advice: "Take a walk" }),
            ];

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.recentAdvice).toContain("Take a walk");
        });
    });

    describe("calendar data", () => {
        it("creates a Map keyed by date", () => {
            const today = dayjs().format("YYYY-MM-DD");
            const history = [createMockResponse({ score: 8, date: today })];

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.calendarData).toBeInstanceOf(Map);
            expect(result.current.calendarData.has(today)).toBe(true);
            expect(result.current.calendarData.get(today)?.score).toBe(8);
        });
    });

    describe("overall (weighted) score", () => {
        it("gives more weight to recent entries", () => {
            // Old entries: low scores, recent entries: high scores
            const history = createMockHistory([
                { score: 2, daysAgo: 10 },
                { score: 2, daysAgo: 9 },
                { score: 2, daysAgo: 8 },
                { score: 9, daysAgo: 2 },
                { score: 9, daysAgo: 1 },
                { score: 9, daysAgo: 0 },
            ]);

            const { result } = renderHook(() => useHealthInsights(history));
            // Weighted should be higher than simple average since recent scores are higher
            const simpleAvg = (2 + 2 + 2 + 9 + 9 + 9) / 6; // 5.5
            expect(result.current.overallScore).toBeGreaterThan(simpleAvg);
        });
    });

    describe("deduplication", () => {
        it("deduplicates entries per day (last entry wins)", () => {
            const today = dayjs().format("YYYY-MM-DD");
            const history = [
                createMockResponse({ score: 3, date: today }),
                createMockResponse({ score: 9, date: today }),
            ];

            const { result } = renderHook(() => useHealthInsights(history));
            expect(result.current.dataPoints).toHaveLength(1);
            expect(result.current.dataPoints[0].score).toBe(9);
        });
    });
});
