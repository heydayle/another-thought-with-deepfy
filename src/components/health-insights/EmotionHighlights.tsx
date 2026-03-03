import { getEmotionColor } from "@/utils/emotion";
import { getEmotionEmoji } from "@/constants/emojis";

interface EmotionHighlightsProps {
    highestScore: number;
    lowestScore: number;
    mostCommonEmotion: { label: string; emoji: string; count: number } | null;
    averageScore: number;
}

export function EmotionHighlights({
    highestScore,
    lowestScore,
    mostCommonEmotion,
    averageScore,
}: EmotionHighlightsProps) {
    const highest = getEmotionEmoji(highestScore);
    const lowest = getEmotionEmoji(lowestScore);
    const average = getEmotionEmoji(Math.round(averageScore));

    const highlights = [
        {
            title: "Highest Recorded",
            score: highestScore,
            label: highest.label,
            image: highest.image,
            color: getEmotionColor(highestScore),
        },
        {
            title: "Average Mood",
            score: averageScore,
            label: average.label,
            image: average.image,
            color: getEmotionColor(Math.round(averageScore)),
        },
        {
            title: "Lowest Recorded",
            score: lowestScore,
            label: lowest.label,
            image: lowest.image,
            color: getEmotionColor(lowestScore),
        },
    ];

    return (
        <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
                Emotion Highlights
            </h3>

            <div className="grid grid-cols-3 gap-4">
                {highlights.map((h) => (
                    <div
                        key={h.title}
                        className="flex flex-col items-center text-center gap-2"
                    >
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center p-1"
                            style={{
                                backgroundColor: `${h.color}15`,
                                border: `1px solid ${h.color}30`,
                            }}
                        >
                            <img
                                src={h.image}
                                alt={h.label}
                                className="w-9 h-9 object-contain"
                            />
                        </div>
                        <div>
                            <p
                                className="text-lg font-bold tabular-nums"
                                style={{ color: h.color }}
                            >
                                {typeof h.score === "number" && h.score % 1 !== 0
                                    ? h.score.toFixed(1)
                                    : h.score}
                            </p>
                            <p className="text-[11px] font-medium text-foreground">
                                {h.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {h.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Most common emotion */}
            {mostCommonEmotion && (
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                    <img
                        src={mostCommonEmotion.emoji}
                        alt={mostCommonEmotion.label}
                        className="w-8 h-8 object-contain"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                            Most Common: {mostCommonEmotion.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Recorded {mostCommonEmotion.count} time{mostCommonEmotion.count > 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
