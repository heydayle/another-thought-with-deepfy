import { useMemo } from "react";
import { Day } from "@/utils/help";
import { getEmotionColor } from "@/utils/emotion";
import { getEmotionEmoji } from "@/constants/emojis";
import type { InsightDataPoint } from "./useHealthInsights";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MoodCalendarProps {
    calendarData: Map<string, InsightDataPoint>;
}

export function MoodCalendar({ calendarData }: MoodCalendarProps) {
    const { weeks, monthLabels } = useMemo(() => {
        const today = Day.instance();
        const startDate = today.subtract(12, "week").startOf("week");
        const weeks: { date: string; dayjs: ReturnType<typeof Day.instance> }[][] = [];
        const monthLabels: { label: string; weekIndex: number }[] = [];

        let current = startDate;
        let currentWeek: { date: string; dayjs: ReturnType<typeof Day.instance> }[] = [];
        let lastMonth = -1;

        while (current.isBefore(today) || current.isSame(today, "day")) {
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            const month = current.month();
            if (month !== lastMonth) {
                monthLabels.push({
                    label: current.format("MMM"),
                    weekIndex: weeks.length,
                });
                lastMonth = month;
            }

            currentWeek.push({
                date: current.format("YYYY-MM-DD"),
                dayjs: current,
            });
            current = current.add(1, "day");
        }

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return { weeks, monthLabels };
    }, []);

    const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

    return (
        <div className="bg-card rounded-xl border border-border p-5">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">Mood Calendar</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Last 12 weeks of check-ins
                </p>
            </div>

            <TooltipProvider delayDuration={100}>
                <div className="overflow-x-auto">
                    {/* Month labels */}
                    <div className="flex gap-[3px] mb-1.5 ml-[32px]">
                        {weeks.map((_, weekIdx) => {
                            const monthLabel = monthLabels.find((m) => m.weekIndex === weekIdx);
                            return (
                                <div
                                    key={`month-${weekIdx}`}
                                    className="w-[14px] shrink-0 text-[10px] text-muted-foreground"
                                >
                                    {monthLabel?.label ?? ""}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-0">
                        {/* Day labels */}
                        <div className="flex flex-col gap-[3px] mr-1.5 shrink-0">
                            {dayLabels.map((label, i) => (
                                <div
                                    key={i}
                                    className="h-[14px] text-[10px] text-muted-foreground flex items-center justify-end w-[24px]"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, weekIdx) => (
                                <div key={weekIdx} className="flex flex-col gap-[3px]">
                                    {week.map((day) => {
                                        const data = calendarData.get(day.date);
                                        const isToday = Day.isToday(day.dayjs);
                                        const isFuture = day.dayjs.isAfter(Day.instance());

                                        if (isFuture) {
                                            return (
                                                <div
                                                    key={day.date}
                                                    className="w-[14px] h-[14px] rounded-[3px]"
                                                />
                                            );
                                        }

                                        const bgColor = data
                                            ? getEmotionColor(Math.round(data.score))
                                            : "var(--color-muted)";

                                        return (
                                            <Tooltip key={day.date}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={`w-[14px] h-[14px] rounded-[3px] transition-all duration-200 hover:scale-[1.6] hover:z-10 cursor-pointer ${isToday ? "ring-1 ring-primary ring-offset-1 ring-offset-background" : ""
                                                            }`}
                                                        style={{
                                                            backgroundColor: bgColor,
                                                            opacity: data ? 0.9 : 0.15,
                                                        }}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="top"
                                                    className="text-xs"
                                                >
                                                    <p className="font-semibold">
                                                        {day.dayjs.format("ddd, MMM D")}
                                                    </p>
                                                    {data ? (
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <img
                                                                src={getEmotionEmoji(Math.round(data.score)).image}
                                                                alt={data.label}
                                                                className="w-4 h-4"
                                                            />
                                                            <span>
                                                                Score: {data.score} — {data.label}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-muted-foreground">No check-in</p>
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-3 ml-[32px]">
                        <span className="text-[10px] text-muted-foreground">Less</span>
                        {[2, 4, 6, 8, 10].map((score) => (
                            <div
                                key={score}
                                className="w-[12px] h-[12px] rounded-[2px]"
                                style={{ backgroundColor: getEmotionColor(score), opacity: 0.9 }}
                            />
                        ))}
                        <span className="text-[10px] text-muted-foreground">More</span>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    );
}
