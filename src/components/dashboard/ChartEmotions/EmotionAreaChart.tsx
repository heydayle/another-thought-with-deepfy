import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { getEmotionColor } from "@/utils/emotion";
import { getEmotionEmoji } from "@/constants/emojis";
import type { ChartDataPoint } from "./useChartEmotionsData";

interface EmotionAreaChartProps {
  data: ChartDataPoint[];
  averageScore: number;
}

const chartConfig = {
  score: {
    label: "Emotion Score",
    color: "var(--color-brand-500)",
  },
} satisfies ChartConfig;

/** Custom dot that renders the emoji SVG centered on the data point */
function EmotionDot(props: any) {
  const { cx, cy, payload } = props;
  const { image, label } = getEmotionEmoji(Math.round(payload.score));
  const size = 22;

  return (
    <image
      key={`dot-${payload.fullDate}`}
      href={image}
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      aria-label={label}
    />
  );
}

/** Custom active dot (slightly larger) */
function EmotionActiveDot(props: any) {
  const { cx, cy, payload } = props;
  const { image, label } = getEmotionEmoji(Math.round(payload.score));
  const size = 30;

  return (
    <image
      key={`dot-active-${payload.fullDate}`}
      href={image}
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      aria-label={label}
    />
  );
}

export function EmotionAreaChart({
  data,
  averageScore,
}: EmotionAreaChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
        No data available for this range.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-brand-500)"
              stopOpacity={0.25}
            />
            <stop
              offset="95%"
              stopColor="var(--color-brand-500)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          stroke="var(--color-border)"
          strokeOpacity={0.5}
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickMargin={8}
          interval="preserveStartEnd"
        />

        <YAxis
          domain={[0, 10]}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          ticks={[0, 2, 4, 6, 8, 10]}
        />

        {/* Average score reference line */}
        <ReferenceLine
          y={averageScore}
          stroke="var(--color-muted-foreground)"
          strokeDasharray="4 4"
          strokeOpacity={0.5}
          label={{
            value: `avg ${averageScore.toFixed(1)}`,
            position: "right",
            fontSize: 10,
            fill: "var(--color-muted-foreground)",
          }}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, _name, _item) => {
                const score = Number(value);
                const { label } = getEmotionEmoji(Math.round(score));
                return (
                  <span
                    style={{ color: getEmotionColor(score) }}
                    className="font-semibold"
                  >
                    {score} – {label}
                  </span>
                );
              }}
              labelFormatter={(label) => (
                <span className="font-medium text-foreground">{label}</span>
              )}
            />
          }
        />

        <Area
          type="monotone"
          dataKey="score"
          stroke="var(--color-brand-500)"
          strokeWidth={2}
          fill="url(#scoreGradient)"
          dot={<EmotionDot />}
          activeDot={<EmotionActiveDot />}
          isAnimationActive
        />
      </AreaChart>
    </ChartContainer>
  );
}
