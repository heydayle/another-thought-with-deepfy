export type GoalStatus = "not_started" | "in_progress" | "completed";
export type GoalCategory = "health" | "mindfulness" | "fitness" | "learning" | "social" | "other";

export interface Goal {
    id: string;
    title: string;
    description: string;
    category: GoalCategory;
    status: GoalStatus;
    progress: number; // 0-100
    target: number;   // target count (e.g. 30 days)
    current: number;  // current count
    unit: string;     // e.g. "days", "sessions", "minutes"
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = "deepfy-goals";

function loadGoals(): Goal[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export const goalsService = {
    getAll(): Goal[] {
        return loadGoals();
    },

    add(goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "progress" | "status">): Goal {
        const goals = loadGoals();
        const now = new Date().toISOString();
        const newGoal: Goal = {
            ...goal,
            id: crypto.randomUUID(),
            status: goal.current > 0 ? "in_progress" : "not_started",
            progress: goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0,
            createdAt: now,
            updatedAt: now,
        };
        goals.push(newGoal);
        saveGoals(goals);
        return newGoal;
    },

    update(id: string, updates: Partial<Pick<Goal, "title" | "description" | "category" | "target" | "current" | "unit">>): Goal | null {
        const goals = loadGoals();
        const index = goals.findIndex((g) => g.id === id);
        if (index === -1) return null;

        const goal = goals[index];
        Object.assign(goal, updates);
        goal.progress = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
        goal.status = goal.progress >= 100 ? "completed" : goal.current > 0 ? "in_progress" : "not_started";
        goal.updatedAt = new Date().toISOString();

        goals[index] = goal;
        saveGoals(goals);
        return goal;
    },

    incrementProgress(id: string, amount: number = 1): Goal | null {
        const goals = loadGoals();
        const index = goals.findIndex((g) => g.id === id);
        if (index === -1) return null;

        const goal = goals[index];
        goal.current = Math.min(goal.target, goal.current + amount);
        goal.progress = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
        goal.status = goal.progress >= 100 ? "completed" : "in_progress";
        goal.updatedAt = new Date().toISOString();

        goals[index] = goal;
        saveGoals(goals);
        return goal;
    },

    delete(id: string): boolean {
        const goals = loadGoals();
        const filtered = goals.filter((g) => g.id !== id);
        if (filtered.length === goals.length) return false;
        saveGoals(filtered);
        return true;
    },

    toggleComplete(id: string): Goal | null {
        const goals = loadGoals();
        const index = goals.findIndex((g) => g.id === id);
        if (index === -1) return null;

        const goal = goals[index];
        if (goal.status === "completed") {
            goal.status = "in_progress";
            goal.current = Math.min(goal.current, goal.target - 1);
            goal.progress = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
        } else {
            goal.status = "completed";
            goal.current = goal.target;
            goal.progress = 100;
        }
        goal.updatedAt = new Date().toISOString();
        goals[index] = goal;
        saveGoals(goals);
        return goal;
    },
};

export const CATEGORY_CONFIG: Record<GoalCategory, { label: string; color: string; emoji: string }> = {
    health: { label: "Health", color: "#ef4444", emoji: "❤️" },
    mindfulness: { label: "Mindfulness", color: "#8b5cf6", emoji: "🧘" },
    fitness: { label: "Fitness", color: "#f59e0b", emoji: "💪" },
    learning: { label: "Learning", color: "#3b82f6", emoji: "📚" },
    social: { label: "Social", color: "#10b981", emoji: "🤝" },
    other: { label: "Other", color: "#6b7280", emoji: "🎯" },
};

export const STATUS_CONFIG: Record<GoalStatus, { label: string; color: string }> = {
    not_started: { label: "Not Started", color: "#6b7280" },
    in_progress: { label: "In Progress", color: "#f59e0b" },
    completed: { label: "Completed", color: "#10b981" },
};
