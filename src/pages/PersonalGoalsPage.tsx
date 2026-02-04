import React from "react";

const PersonalGoalsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Personal Goals
        </h1>
        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors shadow-lg shadow-primary/20 font-medium">
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards for goals */}
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                In Progress
              </span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Goal Title {item}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Description of the goal goes here. Keep it concise and motivating.
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>45%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalGoalsPage;
