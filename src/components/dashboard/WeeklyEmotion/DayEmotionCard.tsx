import { getEmotionColorClass } from "@/utils/emotion";
import { getEmotionEmoji } from "@/constants/emojis";

interface DayEmotionCardProps {
  dayName: string;
  score: string | number;
}

export function DayEmotionCard({ dayName, score }: DayEmotionCardProps) {
  const { label, image } = getEmotionEmoji(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <img
        src={image}
        alt={label || dayName}
        title={label || dayName}
        className={`w-14 h-14 object-contain ${getEmotionColorClass(score)}`}
      />
      <h2 className="text-sm font-medium">{dayName}</h2>
    </div>
  );
}
