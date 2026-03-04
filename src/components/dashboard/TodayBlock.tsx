import { useMemo } from "react";
import { Flame, TrendingUp, TrendingDown, Minus, Sun, Moon, CloudSun } from "lucide-react";
import { Day, parseTextResult } from "@/utils/help";
import { getEmotionEmoji } from "@/constants/emojis";
import { getEmotionColor } from "@/utils/emotion";
import type { WorkflowRunResponse } from "@/services/dify";

interface TodayBlockProps {
    history: WorkflowRunResponse[];
}

function getGreeting(): { text: string; icon: React.ReactNode } {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: <Sun className="w-4 h-4 text-amber-400" /> };
    if (hour < 18) return { text: "Good afternoon", icon: <CloudSun className="w-4 h-4 text-orange-400" /> };
    return { text: "Good evening", icon: <Moon className="w-4 h-4 text-indigo-400" /> };
}

function getScore(item: WorkflowRunResponse): number {
    const raw = item.data?.outputs?.text_result;
    const parsed = typeof raw === "string" ? parseTextResult(raw) : raw;
    return Number(parsed?.score ?? 0);
}

export function TodayBlock({ history }: TodayBlockProps) {
    const today = new Date();
    const dayNum = today.getDate();
    const dayName = today.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = today.toLocaleDateString("en-US", { month: "long" });
    const year = today.getFullYear();

    const greeting = getGreeting();

    // Current streak
    const streak = useMemo(() => {
        const dates = new Set(
            history.map((item) => Day.instance(item.data.created_at).format("YYYY-MM-DD"))
        );
        const now = Day.instance();
        let count = 0;
        for (let i = 0; i <= 365; i++) {
            const checkDate = now.subtract(i, "day").format("YYYY-MM-DD");
            if (dates.has(checkDate)) {
                count++;
            } else if (i > 0) {
                break;
            }
        }
        return count;
    }, [history]);

    // Today's score
    const todayScore = useMemo(() => {
        const todayStr = Day.instance().format("YYYY-MM-DD");
        const todayEntry = history.find(
            (item) => Day.instance(item.data.created_at).format("YYYY-MM-DD") === todayStr
        );
        if (!todayEntry) return null;
        return getScore(todayEntry);
    }, [history]);

    // Week comparison (this week avg vs last week avg)
    const weekTrend = useMemo(() => {
        const now = Day.instance();
        const thisWeekStart = now.startOf("week");
        const lastWeekStart = thisWeekStart.subtract(7, "day");
        const lastWeekEnd = thisWeekStart.subtract(1, "day");

        const thisWeek = history.filter((item) => {
            const d = Day.instance(item.data.created_at);
            return d.isBetween(thisWeekStart, now, null, "[]");
        });
        const lastWeek = history.filter((item) => {
            const d = Day.instance(item.data.created_at);
            return d.isBetween(lastWeekStart, lastWeekEnd, null, "[]");
        });

        const thisAvg = thisWeek.length
            ? thisWeek.reduce((s, i) => s + getScore(i), 0) / thisWeek.length
            : null;
        const lastAvg = lastWeek.length
            ? lastWeek.reduce((s, i) => s + getScore(i), 0) / lastWeek.length
            : null;

        if (thisAvg === null) return null;
        if (lastAvg === null) return { direction: "stable" as const, thisAvg };
        const diff = thisAvg - lastAvg;
        return {
            direction: diff > 0.5 ? ("up" as const) : diff < -0.5 ? ("down" as const) : ("stable" as const),
            thisAvg,
        };
    }, [history]);

    // Mini week dots (last 7 days)
    const weekDots = useMemo(() => {
        const now = Day.instance();
        return Array.from({ length: 7 }, (_, i) => {
            const d = now.subtract(6 - i, "day");
            const dateStr = d.format("YYYY-MM-DD");
            const entry = history.find(
                (item) => Day.instance(item.data.created_at).format("YYYY-MM-DD") === dateStr
            );
            const score = entry ? getScore(entry) : 0;
            return {
                label: d.format("dd")[0], // M, T, W, ...
                score,
                isToday: i === 6,
            };
        });
    }, [history]);

    const todayEmoji = todayScore ? getEmotionEmoji(Math.round(todayScore)) : null;
    const todayColor = todayScore ? getEmotionColor(Math.round(todayScore)) : null;

    return (
        <div className="flex flex-col rounded-xl bg-card border border-border p-4 gap-3 w-full">
            {/* Top: Greeting + Date */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        {greeting.icon}
                        <span className="text-xs font-medium text-muted-foreground">
                            {greeting.text}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold tabular-nums text-foreground leading-none">
                            {dayNum}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight">
                                {dayName}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground/70 leading-tight">
                                {monthName} {year}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Today's emoji */}
                {todayEmoji && (
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${todayColor}15` }}
                    >
                        <img
                            src={todayEmoji.image}
                            alt={todayEmoji.label}
                            className="w-7 h-7 object-contain"
                        />
                    </div>
                )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3">
                {/* Streak */}
                {streak > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-bold text-amber-600 tabular-nums">
                            {streak}
                        </span>
                    </div>
                )}

                {/* Week trend */}
                {weekTrend && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {weekTrend.direction === "up" ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        ) : weekTrend.direction === "down" ? (
                            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                            <Minus className="w-3.5 h-3.5" />
                        )}
                        <span className="font-medium">
                            {weekTrend.thisAvg.toFixed(1)} avg
                        </span>
                    </div>
                )}
            </div>

            {/* Mini week visualization */}
            <div className="flex items-center gap-1.5">
                {weekDots.map((dot, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                            className={`w-full h-1.5 rounded-full transition-all ${dot.isToday ? "ring-1 ring-primary/40 ring-offset-1 ring-offset-card" : ""
                                }`}
                            style={{
                                backgroundColor: dot.score > 0
                                    ? getEmotionColor(Math.round(dot.score))
                                    : "var(--color-muted)",
                                opacity: dot.score > 0 ? 0.85 : 0.2,
                            }}
                        />
                        <span className={`text-[9px] leading-none ${dot.isToday ? "font-bold text-foreground" : "text-muted-foreground/60"
                            }`}>
                            {dot.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}