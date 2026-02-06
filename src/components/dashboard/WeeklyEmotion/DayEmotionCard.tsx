interface DayEmotionCardProps {
  dayName: string;
  score: string | number;
}

// Map score (1-10) to emotion shapes/emojis
const getEmotionShape = (score: string | number): string => {
  const numScore = typeof score === 'string' ? parseInt(score) : score;
  
  const emotionMap: Record<number, string> = {
    1: '😭',  // Very sad/crying
    2: '😢',  // Sad/tearful
    3: '😔',  // Disappointed
    4: '😕',  // Confused/slightly sad
    5: '😐',  // Neutral
    6: '🙂',  // Slightly happy
    7: '😊',  // Happy
    8: '😄',  // Very happy
    9: '😁',  // Joyful
    10: '🤩', // Ecstatic/amazing
  };
  
  return emotionMap[numScore] || '❓';
};

export function DayEmotionCard({ dayName, score }: DayEmotionCardProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-4xl">{getEmotionShape(score)}</p>
      <h2>{dayName}</h2>
    </div>
  );
}
