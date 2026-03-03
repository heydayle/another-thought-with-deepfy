import { HeartPulse } from "lucide-react";
import { useEmotionHistory } from "@/components/dashboard/hooks/useEmotionHistory";
import { useHealthInsights } from "@/components/health-insights/useHealthInsights";
import { WellnessScoreRing } from "@/components/health-insights/WellnessScoreRing";
import { InsightStatsGrid } from "@/components/health-insights/InsightStatsGrid";
import { DayOfWeekChart } from "@/components/health-insights/DayOfWeekChart";
import { MoodCalendar } from "@/components/health-insights/MoodCalendar";
import { EmotionHighlights } from "@/components/health-insights/EmotionHighlights";
import { RecommendationsPanel } from "@/components/health-insights/RecommendationsPanel";
import { EmptyInsights } from "@/components/health-insights/EmptyInsights";

export default function HealthInsightsPage() {
  const { history, loading } = useEmotionHistory(null);
  const insights = useHealthInsights(history);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading your insights…
          </p>
        </div>
      </div>
    );
  }

  if (!insights.dataPoints.length) {
    return <EmptyInsights />;
  }

  return (
    <div className="space-y-6 h-[calc(100svh-64px)] overflow-y-auto px-1 pb-8">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <HeartPulse className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Health Insights
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Your personalized emotional wellness analysis
        </p>
      </div>

      {/* Top section: Wellness Ring + Highlights + Day of Week */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_1fr] gap-4 items-start">
        {/* Wellness Score Ring */}
        <div className="bg-card rounded-xl border border-border p-6 flex items-center justify-center">
          <WellnessScoreRing score={insights.overallScore} />
        </div>

        {/* Emotion Highlights */}
        <EmotionHighlights
          highestScore={insights.highestScore}
          lowestScore={insights.lowestScore}
          mostCommonEmotion={insights.mostCommonEmotion}
          averageScore={insights.averageScore}
        />

        {/* Day of Week Chart */}
        <div className="md:col-span-2 lg:col-span-1">
          <DayOfWeekChart
            stats={insights.dayOfWeekStats}
            bestDay={insights.bestDay}
            worstDay={insights.worstDay}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <InsightStatsGrid
        averageScore={insights.averageScore}
        moodTrend={insights.moodTrend}
        streak={insights.streak}
        weekComparison={insights.weekComparison}
        moodStability={insights.moodStability}
        positiveRatio={insights.positiveRatio}
        last7DaysAvg={insights.last7DaysAvg}
      />

      {/* Bottom section: Calendar + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,380px)] gap-4 items-start">
        {/* Mood Calendar */}
        <MoodCalendar calendarData={insights.calendarData} />

        {/* Recommendations */}
        <RecommendationsPanel
          moodTrend={insights.moodTrend}
          bestDay={insights.bestDay}
          worstDay={insights.worstDay}
          streak={insights.streak}
          averageScore={insights.averageScore}
          positiveRatio={insights.positiveRatio}
          moodStability={insights.moodStability}
          mostCommonEmotion={insights.mostCommonEmotion}
          recentAdvice={insights.recentAdvice}
        />
      </div>
    </div>
  );
}
