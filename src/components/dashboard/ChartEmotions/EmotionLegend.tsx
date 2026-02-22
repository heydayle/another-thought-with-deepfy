import { SCORE_TO_EMOTION } from "@/constants/emojis";
import { getEmotionColorClass } from "@/utils/emotion";

interface EmotionLegendProps {
  /** Optional set of scores that actually appear in the chart data */
  activeScores?: Set<number>;
}

const TIER_GROUPS = [
  { label: "Very Low", scores: [1, 2] },
  { label: "Low", scores: [3, 4] },
  { label: "Neutral", scores: [5, 6] },
  { label: "High", scores: [7, 8] },
  { label: "Very High", scores: [9, 10] },
];

export function EmotionLegend({ activeScores }: EmotionLegendProps) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Emotion Scale
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {TIER_GROUPS.map(({ label, scores }) => {
          // Representative score for the tier (first one)
          const rep = scores[0];
          const colorClass = getEmotionColorClass(rep);
          const isActive =
            !activeScores || scores.some((s) => activeScores.has(s));

          return (
            <div
              key={label}
              className={`flex items-center gap-1.5 transition-opacity ${
                isActive ? "opacity-100" : "opacity-30"
              }`}
            >
              {/* Mini emoji strip */}
              <div className="flex -space-x-1">
                {scores.map((score) => {
                  const { image, label: emojiLabel } = SCORE_TO_EMOTION[score];
                  return (
                    <img
                      key={score}
                      src={image}
                      alt={emojiLabel}
                      title={`${emojiLabel} (${score})`}
                      className={`w-5 h-5 object-contain ${colorClass}`}
                    />
                  );
                })}
              </div>
              <span className={`text-xs font-medium ${colorClass}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
