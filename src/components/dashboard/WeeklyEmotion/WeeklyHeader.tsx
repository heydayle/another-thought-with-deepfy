import { Button } from "@/components/ui/button";

interface WeeklyHeaderProps {
  improvementPercentage?: number;
}

export function WeeklyHeader({
  improvementPercentage = 6,
}: WeeklyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2>Weekly Emotion</h2>
        <p>
          Your mood is better {improvementPercentage}% this week - great
          progress!
        </p>
      </div>
      <Button>This week</Button>
    </div>
  );
}
