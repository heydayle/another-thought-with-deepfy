export function TodayBlock() {

    const today = new Date();
    const dayNum = today.getDate();
    const dayName = today.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = today.toLocaleDateString("en-US", { month: "long" });

    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col rounded-lg bg-white px-2.5 py-4 shrink-0 min-w-[200px] h-full">
                <span className="text-[10px] font-semibold uppercase tracking-widest leading-none text-muted-foreground">
                    {dayName}
                </span>
                <span className="text-4xl font-bold leading-tight tabular-nums text-foreground">
                    {dayNum}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest leading-none text-muted-foreground">
                    {monthName}
                </span>
            </div>
        </div>
    );
}