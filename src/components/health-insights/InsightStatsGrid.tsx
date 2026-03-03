import {
    TrendingUp,
    TrendingDown,
    Minus,
    Flame,
    Trophy,
    Calendar,
    Target,
} from "lucide-react";
import type { StreakInfo, MoodTrend, WeekComparison } from "./useHealthInsights";

interface InsightStatsGridProps {
    averageScore: number;
    moodTrend: MoodTrend;
    streak: StreakInfo;
    weekComparison: WeekComparison;
    moodStability: number;
    positiveRatio: number;
    last7DaysAvg: number;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext?: string;
    accent?: string;
}

function StatCard({ icon, label, value, subtext, accent }: StatCardProps) {
    return (
        <div className="group relative rounded-xl bg-card border border-border p-4 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden">
            {/* Subtle gradient bg */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: accent
                        ? `linear-gradient(135deg, ${accent}08, transparent)`
                        : undefined,
                }}
            />
            <div className="relative flex items-start gap-3">
                <div
                    className="p-2 rounded-lg shrink-0"
                    style={{
                        backgroundColor: accent ? `${accent}15` : "var(--color-muted)",
                        color: accent ?? "var(--color-foreground)",
                    }}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {label}
                    </p>
                    <p className="text-xl font-bold text-foreground mt-0.5 tabular-nums">
                        {value}
                    </p>
                    {subtext && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {subtext}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export function InsightStatsGrid({
    averageScore,
    moodTrend,
    streak,
    weekComparison,
    moodStability,
    positiveRatio,
    last7DaysAvg,
}: InsightStatsGridProps) {
    const trendIcon =
        moodTrend.direction === "improving" ? (
            <TrendingUp className="w-5 h-5" />
        ) : moodTrend.direction === "declining" ? (
            <TrendingDown className="w-5 h-5" />
        ) : (
            <Minus className="w-5 h-5" />
        );

    const trendColor =
        moodTrend.direction === "improving"
            ? "var(--color-emotion-very-high)"
            : moodTrend.direction === "declining"
                ? "var(--color-emotion-very-low)"
                : "var(--color-emotion-neutral)";

    const trendLabel =
        moodTrend.direction === "improving"
            ? "Improving"
            : moodTrend.direction === "declining"
                ? "Declining"
                : "Stable";

    const weekChange = weekComparison.change;
    const weekChangeText =
        weekChange > 0
            ? `+${weekChange.toFixed(1)} from last week`
            : weekChange < 0
                ? `${weekChange.toFixed(1)} from last week`
                : "Same as last week";

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
                icon={trendIcon}
                label="Mood Trend"
                value={trendLabel}
                subtext={`Δ ${moodTrend.magnitude.toFixed(1)} pts`}
                accent={trendColor}
            />
            <StatCard
                icon={<Flame className="w-5 h-5" />}
                label="Current Streak"
                value={`${streak.currentStreak} day${streak.currentStreak !== 1 ? "s" : ""}`}
                subtext={`Best: ${streak.longestStreak} days`}
                accent="#f59e0b"
            />
            <StatCard
                icon={<Calendar className="w-5 h-5" />}
                label="This Week"
                value={weekComparison.thisWeekAvg ? weekComparison.thisWeekAvg.toFixed(1) : "—"}
                subtext={weekChangeText}
                accent="var(--color-brand-500)"
            />
            <StatCard
                icon={<Target className="w-5 h-5" />}
                label="7-Day Avg"
                value={last7DaysAvg ? last7DaysAvg.toFixed(1) : "—"}
                subtext={`Overall: ${averageScore.toFixed(1)}`}
                accent="var(--color-emotion-high)"
            />
            <StatCard
                icon={<Trophy className="w-5 h-5" />}
                label="Positive Days"
                value={`${positiveRatio}%`}
                subtext="Score ≥ 7"
                accent="var(--color-emotion-very-high)"
            />
            <StatCard
                icon={
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                }
                label="Stability"
                value={`${moodStability}%`}
                subtext={moodStability >= 70 ? "Very consistent" : moodStability >= 40 ? "Moderate swings" : "Highly variable"}
                accent="#8b5cf6"
            />
            <StatCard
                icon={
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                }
                label="Total Check-ins"
                value={`${streak.totalEntries}`}
                subtext={`Over ${streak.totalDays} day${streak.totalDays !== 1 ? "s" : ""}`}
                accent="var(--color-brand-400)"
            />
            <StatCard
                icon={
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                        <path d="m2 17 10 5 10-5" />
                        <path d="m2 12 10 5 10-5" />
                    </svg>
                }
                label="Avg Score"
                value={averageScore.toFixed(1)}
                subtext="All time"
                accent="var(--color-brand-600)"
            />
        </div>
    );
}
