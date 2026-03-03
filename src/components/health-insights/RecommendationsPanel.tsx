import { Lightbulb, Sparkles } from "lucide-react";
import type {
    MoodTrend,
    DayOfWeekStat,
    StreakInfo,
} from "./useHealthInsights";

interface RecommendationsPanelProps {
    moodTrend: MoodTrend;
    bestDay: DayOfWeekStat | null;
    worstDay: DayOfWeekStat | null;
    streak: StreakInfo;
    averageScore: number;
    positiveRatio: number;
    moodStability: number;
    mostCommonEmotion: { label: string; emoji: string; count: number } | null;
    recentAdvice: string[];
}

interface Recommendation {
    icon: React.ReactNode;
    title: string;
    description: string;
    type: "positive" | "neutral" | "actionable";
}

function generateRecommendations(props: RecommendationsPanelProps): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Trend-based
    if (props.moodTrend.direction === "improving") {
        recommendations.push({
            icon: <Sparkles className="w-4 h-4" />,
            title: "Great momentum!",
            description:
                "Your mood has been trending upward. Keep doing what works — reflection regularly helps sustain positive patterns.",
            type: "positive",
        });
    } else if (props.moodTrend.direction === "declining") {
        recommendations.push({
            icon: <Lightbulb className="w-4 h-4" />,
            title: "Take a mindful pause",
            description:
                "Your mood trend shows a slight dip. Consider what might have changed recently, and try a calming activity like a walk or journaling.",
            type: "actionable",
        });
    }

    // Streak
    if (props.streak.currentStreak >= 7) {
        recommendations.push({
            icon: <Sparkles className="w-4 h-4" />,
            title: `${props.streak.currentStreak}-day streak! 🔥`,
            description:
                "Consistent check-ins build self-awareness over time. You're doing amazing at tracking your emotional journey.",
            type: "positive",
        });
    } else if (props.streak.currentStreak === 0) {
        recommendations.push({
            icon: <Lightbulb className="w-4 h-4" />,
            title: "Restart your streak",
            description:
                "You haven't checked in today yet. Even a quick note about how you feel can provide valuable insight.",
            type: "actionable",
        });
    }

    // Best/worst day insight
    if (props.bestDay && props.worstDay && props.bestDay.day !== props.worstDay.day) {
        recommendations.push({
            icon: <Lightbulb className="w-4 h-4" />,
            title: `${props.bestDay.day}s are your best days`,
            description: `You tend to feel happiest on ${props.bestDay.day}s (avg ${props.bestDay.avgScore.toFixed(1)}) and lowest on ${props.worstDay.day}s (avg ${props.worstDay.avgScore.toFixed(1)}). Plan uplifting activities on your toughest days.`,
            type: "neutral",
        });
    }

    // Stability
    if (props.moodStability < 40) {
        recommendations.push({
            icon: <Lightbulb className="w-4 h-4" />,
            title: "Emotional variability is high",
            description:
                "Your mood scores vary quite a bit. Establishing a daily routine with consistent sleep and meals can help stabilize your emotional baseline.",
            type: "actionable",
        });
    } else if (props.moodStability >= 75) {
        recommendations.push({
            icon: <Sparkles className="w-4 h-4" />,
            title: "Emotionally consistent",
            description:
                "Your mood stability is excellent — this suggests a healthy emotional foundation. Keep nurturing your current habits.",
            type: "positive",
        });
    }

    // Most common emotion
    if (props.mostCommonEmotion) {
        recommendations.push({
            icon: (
                <img
                    src={props.mostCommonEmotion.emoji}
                    alt={props.mostCommonEmotion.label}
                    className="w-4 h-4"
                />
            ),
            title: `Most felt: ${props.mostCommonEmotion.label}`,
            description: `You\'ve felt "${props.mostCommonEmotion.label}" ${props.mostCommonEmotion.count} time${props.mostCommonEmotion.count > 1 ? "s" : ""}. Understanding your dominant emotion helps tailor your self-care approach.`,
            type: "neutral",
        });
    }

    return recommendations;
}

const typeColors = {
    positive: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: "text-emerald-500",
    },
    actionable: {
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: "text-amber-500",
    },
    neutral: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: "text-blue-500",
    },
};

export function RecommendationsPanel(props: RecommendationsPanelProps) {
    const recommendations = generateRecommendations(props);

    return (
        <div className="bg-card rounded-xl border border-border p-5">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                    Personalized Insights
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Based on your emotion patterns
                </p>
            </div>

            <div className="space-y-3">
                {recommendations.map((rec, i) => {
                    const colors = typeColors[rec.type];
                    return (
                        <div
                            key={i}
                            className={`flex gap-3 p-3 rounded-lg border ${colors.bg} ${colors.border} transition-all duration-200 hover:scale-[1.01]`}
                        >
                            <div className={`shrink-0 mt-0.5 ${colors.icon}`}>
                                {rec.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground">
                                    {rec.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    {rec.description}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {recommendations.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">
                            Start tracking your emotions to get personalized insights!
                        </p>
                    </div>
                )}
            </div>

            {/* Recent advice from AI */}
            {props.recentAdvice.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Recent AI Advice
                    </p>
                    <div className="space-y-2">
                        {props.recentAdvice.slice(0, 3).map((advice, i) => (
                            <div
                                key={i}
                                className="flex gap-2 p-2.5 rounded-lg bg-muted/40"
                            >
                                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                                <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
                                    {advice}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
