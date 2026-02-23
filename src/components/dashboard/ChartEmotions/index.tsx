import { useMemo, useState } from "react";
import type { WorkflowRunResponse } from "@/services/dify";
import { useChartEmotionsData, type ChartRange } from "./useChartEmotionsData";
import { ChartEmotionsHeader } from "./ChartEmotionsHeader";
import { EmotionAreaChart } from "./EmotionAreaChart";
import { EmotionBarChart } from "./EmotionBarChart";
import { EmotionLegend } from "./EmotionLegend";

interface ChartEmotionsProps {
  history: WorkflowRunResponse[];
}

export function ChartEmotions({ history }: ChartEmotionsProps) {
  const [range, setRange] = useState<ChartRange>("last_14");

  const { chartData, distribution, averageScore, highestScore, lowestScore } =
    useChartEmotionsData(history, range);

  /** Set of scores actually present in the current data window */
  const activeScores = useMemo(
    () => new Set(chartData.map((d) => d.score)),
    [chartData],
  );

  return (
    <div className="bg-card rounded-xl p-5 h-fit flex flex-col gap-5">
      {/* Header: title, stats, range picker */}
      <ChartEmotionsHeader
        averageScore={averageScore}
        highestScore={highestScore}
        lowestScore={lowestScore}
        range={range}
        onRangeChange={setRange}
        totalEntries={chartData.length}
      />

      {/* Area chart: score over time */}
      <EmotionAreaChart data={chartData} averageScore={averageScore} />

      <div className="border-t border-border pt-4 grid grid-cols-[1fr_auto] gap-6 items-start">
        {/* Legend */}
        <EmotionLegend activeScores={activeScores} />

        {/* Bar chart: distribution */}
        <div className="w-[260px] shrink-0">
          <EmotionBarChart data={distribution} />
        </div>
      </div>
    </div>
  );
}
