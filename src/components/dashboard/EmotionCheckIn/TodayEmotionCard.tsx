import { QuoteIcon, Lightbulb, Heart } from "lucide-react";
import type { EmotionOutput } from "@/services/history";
import { getEmotionEmoji } from "@/constants/emojis";
import { getEmotionColor, getEmotionColorClass } from "@/utils/emotion";

interface TodayEmotionCardProps {
  emotion: EmotionOutput;
}

export function TodayEmotionCard({ emotion }: TodayEmotionCardProps) {
  const score = Number(emotion.score ?? 0);
  const { label, image } = getEmotionEmoji(Math.round(score));
  const colorClass = getEmotionColorClass(score);
  const accentColor = getEmotionColor(score);

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* Score row */}
      <div className="flex items-center gap-3">
        {/* Emoji */}
        <img
          src={image}
          alt={label}
          title={label}
          className={`w-12 h-12 object-contain shrink-0 ${colorClass}`}
        />

        {/* Score meter */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <span className={`text-sm font-semibold truncate ${colorClass}`}>
              {emotion.score_label}
            </span>
            <span
              className={`text-xs font-bold tabular-nums shrink-0 ${colorClass}`}
            >
              {score}/10
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(score / 10) * 100}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Quote */}
      {emotion.your_quote && (
        <div className="flex gap-2 min-w-0">
          <QuoteIcon
            className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground"
            strokeWidth={2.5}
          />
          <p className="text-xs italic text-muted-foreground leading-relaxed line-clamp-3 break-words">
            {emotion.your_quote}
          </p>
        </div>
      )}

      {/* Feeling */}
      {emotion.your_feeling && (
        <div className="flex gap-2 min-w-0">
          <Heart
            className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground"
            strokeWidth={2.5}
          />
          <p className="text-xs text-foreground leading-relaxed line-clamp-3 break-words">
            {emotion.your_feeling}
          </p>
        </div>
      )}

      {/* Advice */}
      {emotion.advice && (
        <div className="flex gap-2 min-w-0 p-2.5 rounded-lg bg-muted/60">
          <Lightbulb
            className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground"
            strokeWidth={2.5}
          />
          <p className="text-xs text-foreground leading-relaxed line-clamp-3 break-words">
            {emotion.advice}
          </p>
        </div>
      )}
    </div>
  );
}
