import { getEmotionColor } from "@/utils/emotion";
import type { DayOfWeekStat } from "./useHealthInsights";

interface DayOfWeekChartProps {
    stats: DayOfWeekStat[];
    bestDay: DayOfWeekStat | null;
    worstDay: DayOfWeekStat | null;
}

export function DayOfWeekChart({ stats, bestDay, worstDay }: DayOfWeekChartProps) {
    return (
        <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Best Days</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Average mood by day of week
                    </p>
                </div>
                {bestDay && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10">
                        <span className="text-xs font-semibold text-emerald-600">
                            {bestDay.day}
                        </span>
                        <span className="text-[10px] text-emerald-500">
                            avg {bestDay.avgScore.toFixed(1)}
                        </span>
                    </div>
                )}
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-[140px]">
                {stats.map((stat) => {
                    const heightPercent = stat.avgScore > 0 ? (stat.avgScore / 10) * 100 : 2;
                    const isBest = bestDay && stat.day === bestDay.day;
                    const isWorst = worstDay && stat.day === worstDay.day;
                    const barColor = stat.avgScore > 0 ? getEmotionColor(Math.round(stat.avgScore)) : "var(--color-border)";

                    return (
                        <div
                            key={stat.day}
                            className="flex-1 flex flex-col items-center gap-1.5"
                        >
                            <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                                {stat.avgScore > 0 ? stat.avgScore.toFixed(1) : "—"}
                            </span>
                            <div className="w-full relative flex-1 flex items-end">
                                <div
                                    className="w-full rounded-t-md transition-all duration-700 ease-out relative overflow-hidden"
                                    style={{
                                        height: `${heightPercent}%`,
                                        backgroundColor: barColor,
                                        minHeight: "4px",
                                        opacity: stat.count > 0 ? 1 : 0.2,
                                    }}
                                >
                                    {/* Shine effect on best day */}
                                    {isBest && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/30" />
                                    )}
                                </div>
                            </div>
                            <span
                                className={`text-[11px] font-medium ${isBest
                                    ? "text-emerald-600 font-bold"
                                    : isWorst
                                        ? "text-red-400"
                                        : "text-muted-foreground"
                                    }`}
                            >
                                {stat.day}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
