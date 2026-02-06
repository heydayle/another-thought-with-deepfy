import { Button } from "@/components/ui/button";
import { getEmotionColorClass } from '@/utils/emotion';
import { ChevronDown } from "lucide-react";

interface WeeklyHeaderProps {
  improvementPercentage?: number;
}

export function WeeklyHeader({
  improvementPercentage = 6,
}: WeeklyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Weekly Emotion</h2>
        <p className="text-sm text-muted-foreground">
          Your mood is <b className={getEmotionColorClass(improvementPercentage)}>better {improvementPercentage}%</b> this week - great
          progress!
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="text-primary bg-white rounded-none border-0 border-b border-b-primary shadow-none cursor-pointer hover:bg-primary/10 hover:border-b-primary hover:text-primary"
      >
        This week <ChevronDown />
      </Button>
    </div>
  );
}
