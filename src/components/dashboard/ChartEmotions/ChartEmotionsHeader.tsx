import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmotionColorClass } from "@/utils/emotion";
import { getEmotionEmoji } from "@/constants/emojis";
import { RANGE_LABELS, type ChartRange } from "./useChartEmotionsData";

interface ChartEmotionsHeaderProps {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  range: ChartRange;
  onRangeChange: (range: ChartRange) => void;
  totalEntries: number;
}

function StatBadge({
  label,
  score,
  size = "md",
}: {
  label: string;
  score: number;
  size?: "sm" | "md";
}) {
  const { label: emotionLabel, image } = getEmotionEmoji(Math.round(score));
  const colorClass = getEmotionColorClass(Math.round(score));

  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <img
        src={image}
        alt={emotionLabel}
        className={`object-contain ${size === "md" ? "w-9 h-9" : "w-6 h-6"} ${colorClass}`}
      />
      <span
        className={`font-bold tabular-nums ${size === "md" ? "text-lg" : "text-sm"} ${colorClass}`}
      >
        {score > 0 ? score.toFixed(1) : "–"}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">
        {label}
      </span>
    </div>
  );
}

export function ChartEmotionsHeader({
  averageScore,
  highestScore,
  lowestScore,
  range,
  onRangeChange,
  totalEntries,
}: ChartEmotionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      {/* Left – title + stats */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-xl font-semibold leading-none">Emotion Trends</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {totalEntries} {totalEntries === 1 ? "entry" : "entries"} ·{" "}
            {RANGE_LABELS[range]}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-5 divide-x divide-border">
          <div className="pr-5">
            <StatBadge label="Average" score={averageScore} size="md" />
          </div>
          <div className="pl-5 pr-5">
            <StatBadge label="Peak" score={highestScore} size="sm" />
          </div>
          <div className="pl-5">
            <StatBadge label="Lowest" score={lowestScore} size="sm" />
          </div>
        </div>
      </div>

      {/* Right – range selector */}
      <Select
        value={range}
        onValueChange={(v) => onRangeChange(v as ChartRange)}
      >
        <SelectTrigger className="w-full sm:w-[160px] shrink-0">
          <SelectValue placeholder="Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {(Object.entries(RANGE_LABELS) as [ChartRange, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ),
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
