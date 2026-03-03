import { useMemo } from "react";
import { Day, parseTextResult } from "@/utils/help";
import type { WorkflowRunResponse } from "@/services/dify";
import { SCORE_TO_EMOTION } from "@/constants/emojis";

export interface InsightDataPoint {
    date: string;       // "YYYY-MM-DD"
    displayDate: string; // "DD MMM"
    score: number;
    label: string;
    emoji: string;
    feeling: string;
    advice: string;
    quote: string;
    dayOfWeek: string;  // "Mon", "Tue", etc.
}

export interface DayOfWeekStat {
    day: string;
    avgScore: number;
    count: number;
}

export interface WeekComparison {
    thisWeekAvg: number;
    lastWeekAvg: number;
    change: number;         // positive = improvement
    changePercent: number;
}

export interface StreakInfo {
    currentStreak: number;
    longestStreak: number;
    totalEntries: number;
    totalDays: number;
}

export interface MoodTrend {
    direction: "improving" | "declining" | "stable";
    magnitude: number; // 0-10 how strong the trend is
}

export interface HealthInsightsData {
    dataPoints: InsightDataPoint[];
    overallScore: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    moodTrend: MoodTrend;
    streak: StreakInfo;
    weekComparison: WeekComparison;
    dayOfWeekStats: DayOfWeekStat[];
    bestDay: DayOfWeekStat | null;
    worstDay: DayOfWeekStat | null;
    mostCommonEmotion: { label: string; emoji: string; count: number } | null;
    recentAdvice: string[];
    moodStability: number; // 0-100 (100 = very stable)
    positiveRatio: number; // 0-100 percentage of days with score >= 7
    last7DaysAvg: number;
    last30DaysAvg: number;
    calendarData: Map<string, InsightDataPoint>;
}

function extractDataPoint(item: WorkflowRunResponse): InsightDataPoint | null {
    const raw = item.data.outputs.text_result;
    const parsed = typeof raw === "string" ? parseTextResult(raw) : raw;
    if (!parsed) return null;

    const score = Number(parsed.score ?? 0);
    const emotion = SCORE_TO_EMOTION[score];
    const d = Day.instance(item.data.created_at);

    return {
        date: d.format("YYYY-MM-DD"),
        displayDate: d.format("DD MMM"),
        score,
        label: emotion?.label ?? parsed.score_label ?? "",
        emoji: emotion?.image ?? "",
        feeling: parsed.your_feeling ?? "",
        advice: parsed.advice ?? "",
        quote: parsed.your_quote ?? "",
        dayOfWeek: d.format("ddd"),
    };
}

export function useHealthInsights(history: WorkflowRunResponse[]): HealthInsightsData {
    const dataPoints = useMemo(() => {
        const map = new Map<string, InsightDataPoint>();
        history.forEach((item) => {
            const point = extractDataPoint(item);
            if (point) map.set(point.date, point);
        });
        return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
    }, [history]);

    // Calendar data
    const calendarData = useMemo(() => {
        const map = new Map<string, InsightDataPoint>();
        dataPoints.forEach((p) => map.set(p.date, p));
        return map;
    }, [dataPoints]);

    // Basic stats
    const averageScore = useMemo(() => {
        if (!dataPoints.length) return 0;
        return dataPoints.reduce((sum, d) => sum + d.score, 0) / dataPoints.length;
    }, [dataPoints]);

    const highestScore = useMemo(
        () => dataPoints.length ? Math.max(...dataPoints.map((d) => d.score)) : 0,
        [dataPoints]
    );

    const lowestScore = useMemo(
        () => dataPoints.length ? Math.min(...dataPoints.map((d) => d.score)) : 0,
        [dataPoints]
    );

    // Last 7 and 30 days averages
    const last7DaysAvg = useMemo(() => {
        const cutoff = Day.instance().subtract(7, "day").startOf("day");
        const recent = dataPoints.filter((d) => Day.instance(d.date).isAfter(cutoff));
        if (!recent.length) return 0;
        return recent.reduce((s, d) => s + d.score, 0) / recent.length;
    }, [dataPoints]);

    const last30DaysAvg = useMemo(() => {
        const cutoff = Day.instance().subtract(30, "day").startOf("day");
        const recent = dataPoints.filter((d) => Day.instance(d.date).isAfter(cutoff));
        if (!recent.length) return 0;
        return recent.reduce((s, d) => s + d.score, 0) / recent.length;
    }, [dataPoints]);

    // Overall score (weighted: recent data matters more)
    const overallScore = useMemo(() => {
        if (!dataPoints.length) return 0;
        if (dataPoints.length <= 3) return averageScore;
        // Give more weight to recent entries
        const total = dataPoints.length;
        let weightedSum = 0;
        let weightTotal = 0;
        dataPoints.forEach((d, i) => {
            const weight = 1 + (i / total); // later entries get higher weight
            weightedSum += d.score * weight;
            weightTotal += weight;
        });
        return weightedSum / weightTotal;
    }, [dataPoints, averageScore]);

    // Mood trend (compare first half vs second half of recent data)
    const moodTrend = useMemo<MoodTrend>(() => {
        if (dataPoints.length < 4) return { direction: "stable", magnitude: 0 };
        const recent = dataPoints.slice(-14); // last 14 entries
        const mid = Math.floor(recent.length / 2);
        const firstHalf = recent.slice(0, mid);
        const secondHalf = recent.slice(mid);
        const avgFirst = firstHalf.reduce((s, d) => s + d.score, 0) / firstHalf.length;
        const avgSecond = secondHalf.reduce((s, d) => s + d.score, 0) / secondHalf.length;
        const diff = avgSecond - avgFirst;
        if (Math.abs(diff) < 0.5) return { direction: "stable", magnitude: Math.abs(diff) };
        return {
            direction: diff > 0 ? "improving" : "declining",
            magnitude: Math.abs(diff),
        };
    }, [dataPoints]);

    // Streak tracking
    const streak = useMemo<StreakInfo>(() => {
        if (!dataPoints.length) return { currentStreak: 0, longestStreak: 0, totalEntries: 0, totalDays: 0 };

        const dates = new Set(dataPoints.map((d) => d.date));
        const today = Day.instance();
        let current = 0;
        let longest = 0;
        let tempStreak = 0;

        // Check current streak (going backwards from today)
        for (let i = 0; i <= 365; i++) {
            const checkDate = today.subtract(i, "day").format("YYYY-MM-DD");
            if (dates.has(checkDate)) {
                current++;
            } else if (i > 0) {
                break;
            }
        }

        // Calculate longest streak
        const sortedDates = Array.from(dates).sort();
        tempStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = Day.instance(sortedDates[i - 1]);
            const currDate = Day.instance(sortedDates[i]);
            if (currDate.diff(prevDate, "day") === 1) {
                tempStreak++;
            } else {
                longest = Math.max(longest, tempStreak);
                tempStreak = 1;
            }
        }
        longest = Math.max(longest, tempStreak);

        // Total days range
        const firstDate = Day.instance(sortedDates[0]);
        const totalDays = today.diff(firstDate, "day") + 1;

        return {
            currentStreak: current,
            longestStreak: longest,
            totalEntries: dataPoints.length,
            totalDays,
        };
    }, [dataPoints]);

    // Week comparison
    const weekComparison = useMemo<WeekComparison>(() => {
        const today = Day.instance();
        const thisWeekStart = today.startOf("week");
        const lastWeekStart = thisWeekStart.subtract(7, "day");
        const lastWeekEnd = thisWeekStart.subtract(1, "day");

        const thisWeekData = dataPoints.filter((d) => {
            const date = Day.instance(d.date);
            return date.isBetween(thisWeekStart, today, null, "[]");
        });
        const lastWeekData = dataPoints.filter((d) => {
            const date = Day.instance(d.date);
            return date.isBetween(lastWeekStart, lastWeekEnd, null, "[]");
        });

        const thisWeekAvg = thisWeekData.length
            ? thisWeekData.reduce((s, d) => s + d.score, 0) / thisWeekData.length
            : 0;
        const lastWeekAvg = lastWeekData.length
            ? lastWeekData.reduce((s, d) => s + d.score, 0) / lastWeekData.length
            : 0;

        const change = thisWeekAvg - lastWeekAvg;
        const changePercent = lastWeekAvg > 0 ? (change / lastWeekAvg) * 100 : 0;

        return { thisWeekAvg, lastWeekAvg, change, changePercent };
    }, [dataPoints]);

    // Day of week stats
    const dayOfWeekStats = useMemo<DayOfWeekStat[]>(() => {
        const dayMap: Record<string, { total: number; count: number }> = {};
        const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        daysOrder.forEach((d) => (dayMap[d] = { total: 0, count: 0 }));

        dataPoints.forEach((d) => {
            if (dayMap[d.dayOfWeek]) {
                dayMap[d.dayOfWeek].total += d.score;
                dayMap[d.dayOfWeek].count++;
            }
        });

        return daysOrder.map((day) => ({
            day,
            avgScore: dayMap[day].count > 0 ? dayMap[day].total / dayMap[day].count : 0,
            count: dayMap[day].count,
        }));
    }, [dataPoints]);

    const bestDay = useMemo(() => {
        const withData = dayOfWeekStats.filter((d) => d.count > 0);
        if (!withData.length) return null;
        return withData.reduce((best, d) => (d.avgScore > best.avgScore ? d : best));
    }, [dayOfWeekStats]);

    const worstDay = useMemo(() => {
        const withData = dayOfWeekStats.filter((d) => d.count > 0);
        if (!withData.length) return null;
        return withData.reduce((worst, d) => (d.avgScore < worst.avgScore ? d : worst));
    }, [dayOfWeekStats]);

    // Most common emotion
    const mostCommonEmotion = useMemo(() => {
        if (!dataPoints.length) return null;
        const count: Record<number, number> = {};
        dataPoints.forEach((d) => {
            count[d.score] = (count[d.score] || 0) + 1;
        });
        const maxScore = Number(
            Object.entries(count).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
        );
        const emotion = SCORE_TO_EMOTION[maxScore];
        return {
            label: emotion?.label ?? "Unknown",
            emoji: emotion?.image ?? "",
            count: count[maxScore],
        };
    }, [dataPoints]);

    // Mood stability (stddev-based, lower stddev = more stable)
    const moodStability = useMemo(() => {
        if (dataPoints.length < 2) return 100;
        const mean = averageScore;
        const variance =
            dataPoints.reduce((sum, d) => sum + Math.pow(d.score - mean, 2), 0) /
            dataPoints.length;
        const stddev = Math.sqrt(variance);
        // Map: stddev 0 → 100, stddev 4 → 0
        return Math.max(0, Math.min(100, Math.round((1 - stddev / 4) * 100)));
    }, [dataPoints, averageScore]);

    // Positive ratio
    const positiveRatio = useMemo(() => {
        if (!dataPoints.length) return 0;
        const positiveCount = dataPoints.filter((d) => d.score >= 7).length;
        return Math.round((positiveCount / dataPoints.length) * 100);
    }, [dataPoints]);

    // Recent advice
    const recentAdvice = useMemo(() => {
        return dataPoints
            .slice(-5)
            .reverse()
            .filter((d) => d.advice)
            .map((d) => d.advice);
    }, [dataPoints]);

    return {
        dataPoints,
        overallScore,
        averageScore,
        highestScore,
        lowestScore,
        moodTrend,
        streak,
        weekComparison,
        dayOfWeekStats,
        bestDay,
        worstDay,
        mostCommonEmotion,
        recentAdvice,
        moodStability,
        positiveRatio,
        last7DaysAvg,
        last30DaysAvg,
        calendarData,
    };
}
