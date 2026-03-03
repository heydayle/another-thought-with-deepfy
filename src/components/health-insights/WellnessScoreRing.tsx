import { useMemo } from "react";
import { getEmotionColor } from "@/utils/emotion";

interface WellnessScoreRingProps {
    score: number; // 0-10
    label?: string;
}

export function WellnessScoreRing({ score, label = "Wellness Score" }: WellnessScoreRingProps) {
    const percentage = (score / 10) * 100;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const accentColor = getEmotionColor(Math.round(score));

    const statusText = useMemo(() => {
        if (score >= 8) return "Excellent";
        if (score >= 6) return "Good";
        if (score >= 4) return "Fair";
        if (score >= 2) return "Low";
        return "Very Low";
    }, [score]);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-[180px] h-[180px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    {/* Background ring */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        opacity={0.3}
                    />
                    {/* Score ring */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Glow effect */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        opacity={0.2}
                        filter="blur(6px)"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="text-4xl font-bold tabular-nums"
                        style={{ color: accentColor }}
                    >
                        {score.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium mt-0.5">
                        out of 10
                    </span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{statusText}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}
