import { HeartPulse, ArrowRight } from "lucide-react";
import { NavLink } from "react-router";

export function EmptyInsights() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="relative mb-6">
                {/* Animated pulse rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/5 animate-ping" />
                </div>
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <HeartPulse className="w-10 h-10 text-primary" />
                </div>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2">
                No Health Insights Yet
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm leading-relaxed mb-6">
                Start tracking your emotions on the dashboard to unlock personalized
                health insights, mood trends, and recommendations.
            </p>

            <NavLink
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]"
            >
                Go to Mood Tracker
                <ArrowRight className="w-4 h-4" />
            </NavLink>
        </div>
    );
}
