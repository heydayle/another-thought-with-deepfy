import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ScoreDistributionPoint } from "./useChartEmotionsData";

interface EmotionBarChartProps {
  data: ScoreDistributionPoint[];
}

const chartConfig = {
  count: {
    label: "Entries",
  },
} satisfies ChartConfig;

export function EmotionBarChart({ data }: EmotionBarChartProps) {
  const hasData = data.some((d) => d.count > 0);

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
        Score Distribution
      </p>

      {!hasData ? (
        <div className="flex items-center justify-center h-[110px] text-muted-foreground text-xs">
          No data yet
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[110px] w-full">
          <BarChart
            data={data}
            barCategoryGap="20%"
            margin={{ top: 4, right: 0, left: -28, bottom: 0 }}
          >
            <XAxis
              dataKey="tier"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(v: string) => v.split(" ")[0]}
              tickMargin={4}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
              content={
                <ChartTooltipContent
                  nameKey="count"
                  labelFormatter={(label) => (
                    <span className="font-medium text-foreground">{label}</span>
                  )}
                />
              }
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  opacity={entry.count === 0 ? 0.2 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}
