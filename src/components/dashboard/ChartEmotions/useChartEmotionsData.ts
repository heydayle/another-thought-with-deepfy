import { useMemo } from "react";
import { Day, parseTextResult } from "@/utils/help";
import type { WorkflowRunResponse } from "@/services/dify";
import { SCORE_TO_EMOTION } from "@/constants/emojis";

export interface ChartDataPoint {
    date: string;        // "DD MMM"
    fullDate: string;    // "YYYY-MM-DD"
    score: number;
    label: string;
    emoji: string;       // image path
}

export interface ScoreDistributionPoint {
    tier: string;
    count: number;
    fill: string;
}

export type ChartRange = "last_7" | "last_14" | "last_30" | "all_time";

const RANGE_LABELS: Record<ChartRange, string> = {
    last_7: "Last 7 days",
    last_14: "Last 14 days",
    last_30: "Last 30 days",
    all_time: "All time",
};

export { RANGE_LABELS };

export function useChartEmotionsData(
    history: WorkflowRunResponse[],
    range: ChartRange
) {
    const today = Day.instance();

    const filtered = useMemo(() => {
        let start: ReturnType<typeof Day.instance> | null = null;

        switch (range) {
            case "last_7":
                start = today.subtract(6, "day").startOf("day");
                break;
            case "last_14":
                start = today.subtract(13, "day").startOf("day");
                break;
            case "last_30":
                start = today.subtract(29, "day").startOf("day");
                break;
            case "all_time":
            default:
                start = null;
        }

        return history.filter((item) => {
            if (!start) return true;
            const d = Day.instance(item.data.created_at);
            return d.isBetween(start, today, null, "[]");
        });
    }, [history, range]);

    /** Deduplicated per day – last entry wins */
    const chartData: ChartDataPoint[] = useMemo(() => {
        const map = new Map<string, ChartDataPoint>();

        filtered.forEach((item) => {
            const raw = item.data.outputs.text_result;
            const parsed =
                typeof raw === "string" ? parseTextResult(raw) : raw;
            if (!parsed) return;

            const score = Number(parsed.score ?? 0);
            const emotion = SCORE_TO_EMOTION[score];
            const d = Day.instance(item.data.created_at);
            const fullDate = d.format("YYYY-MM-DD");

            map.set(fullDate, {
                date: d.format("DD MMM"),
                fullDate,
                score,
                label: emotion?.label ?? parsed.score_label ?? "",
                emoji: emotion?.image ?? "",
            });
        });

        return Array.from(map.values()).sort((a, b) =>
            a.fullDate.localeCompare(b.fullDate)
        );
    }, [filtered]);

    /** Score distribution tiers */
    const distribution: ScoreDistributionPoint[] = useMemo(() => {
        const tiers = [
            { tier: "Very Low (1–2)", min: 1, max: 2, fill: "var(--color-emotion-very-low)" },
            { tier: "Low (3–4)", min: 3, max: 4, fill: "var(--color-emotion-low)" },
            { tier: "Neutral (5–6)", min: 5, max: 6, fill: "var(--color-emotion-neutral)" },
            { tier: "High (7–8)", min: 7, max: 8, fill: "var(--color-emotion-high)" },
            { tier: "Very High (9–10)", min: 9, max: 10, fill: "var(--color-emotion-very-high)" },
        ];

        return tiers.map(({ tier, min, max, fill }) => ({
            tier,
            count: chartData.filter((d) => d.score >= min && d.score <= max).length,
            fill,
        }));
    }, [chartData]);

    const averageScore = useMemo(() => {
        if (!chartData.length) return 0;
        return (
            chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length
        );
    }, [chartData]);

    const highestScore = useMemo(
        () => (chartData.length ? Math.max(...chartData.map((d) => d.score)) : 0),
        [chartData]
    );

    const lowestScore = useMemo(
        () => (chartData.length ? Math.min(...chartData.map((d) => d.score)) : 0),
        [chartData]
    );

    return { chartData, distribution, averageScore, highestScore, lowestScore };
}
