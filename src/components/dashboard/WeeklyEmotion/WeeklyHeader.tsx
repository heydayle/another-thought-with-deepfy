import { getEmotionColorClass } from '@/utils/emotion';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WeeklyHeaderProps {
  improvementPercentage?: number;
  range?: string;
  onRangeChange?: (range: string) => void;
}

export function WeeklyHeader({
  improvementPercentage = 6,
  range = "this_week",
  onRangeChange,
}: WeeklyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h2 className="text-xl font-semibold">Weekly Emotion</h2>
        <p className="text-sm text-muted-foreground">
          Your mood is <b className={getEmotionColorClass(improvementPercentage)}>better {improvementPercentage}%</b> this week - great
          progress!
        </p>
      </div>
      <Select value={range} onValueChange={onRangeChange}>
        <SelectTrigger className="w-full sm:w-[180px] shrink-0">
          <SelectValue placeholder="Range" className="text-primary bg-white rounded-none border-0 border-b border-b-primary shadow-none cursor-pointer hover:bg-primary/10 hover:border-b-primary hover:text-primary" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="this_week">This week</SelectItem>
            <SelectItem value="last_week">Last week</SelectItem>
            <SelectItem value="last_2_weeks">Last 2 weeks</SelectItem>
            <SelectItem value="this_month">This month</SelectItem>
            <SelectItem value="last_month">Last month</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
