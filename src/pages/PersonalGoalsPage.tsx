import { useState, useCallback, useMemo } from "react";
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  ChevronUp,
  Trophy,
  Flame,
  X,
} from "lucide-react";
import {
  goalsService,
  CATEGORY_CONFIG,
  STATUS_CONFIG,
  type Goal,
  type GoalCategory,
  type GoalStatus,
} from "@/services/goals";

/* ────────────────────────────────────────────────────────────────────── */
/*  Goal Form Dialog                                                     */
/* ────────────────────────────────────────────────────────────────────── */

interface GoalFormProps {
  onSubmit: (goal: {
    title: string;
    description: string;
    category: GoalCategory;
    target: number;
    current: number;
    unit: string;
  }) => void;
  onClose: () => void;
  initial?: Goal;
}

function GoalFormDialog({ onSubmit, onClose, initial }: GoalFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<GoalCategory>(initial?.category ?? "health");
  const [target, setTarget] = useState(initial?.target ?? 30);
  const [current, setCurrent] = useState(initial?.current ?? 0);
  const [unit, setUnit] = useState(initial?.unit ?? "days");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), category, target, current, unit });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {initial ? "Edit Goal" : "New Goal"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Goal Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meditate daily"
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this goal important to you?"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(CATEGORY_CONFIG) as [GoalCategory, typeof CATEGORY_CONFIG[GoalCategory]][]).map(
                ([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${category === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/30"
                      }`}
                  >
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Target & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                Target
              </label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
                min={1}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="days">Days</option>
                <option value="sessions">Sessions</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="times">Times</option>
                <option value="pages">Pages</option>
                <option value="km">Kilometers</option>
              </select>
            </div>
          </div>

          {/* Current progress (only for editing) */}
          {initial && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                Current Progress
              </label>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(Math.max(0, Math.min(target, Number(e.target.value))))}
                min={0}
                max={target}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors shadow-lg shadow-primary/20"
            >
              {initial ? "Save Changes" : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Goal Card                                                            */
/* ────────────────────────────────────────────────────────────────────── */

interface GoalCardProps {
  goal: Goal;
  onIncrement: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
}

function GoalCard({ goal, onIncrement, onToggleComplete, onDelete, onEdit }: GoalCardProps) {
  const catConfig = CATEGORY_CONFIG[goal.category];
  const statusConfig = STATUS_CONFIG[goal.status];
  const isCompleted = goal.status === "completed";

  return (
    <div
      className={`group relative rounded-xl bg-card border p-5 transition-all duration-300 hover:shadow-lg overflow-hidden ${isCompleted
        ? "border-emerald-500/30 hover:border-emerald-500/50"
        : "border-border hover:border-primary/40 hover:shadow-primary/5"
        }`}
    >
      {/* Subtle gradient top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: catConfig.color, opacity: isCompleted ? 0.3 : 0.6 }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{catConfig.emoji}</span>
          <div className="min-w-0">
            <h3
              className={`text-base font-semibold leading-tight truncate ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                }`}
            >
              {goal.title}
            </h3>
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: catConfig.color }}>
              {catConfig.label}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <span
          className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${statusConfig.color}18`,
            color: statusConfig.color,
          }}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {goal.description}
        </p>
      )}

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-baseline justify-between gap-1 mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {goal.current} / {goal.target} {goal.unit}
          </span>
          <span className="text-xs font-bold tabular-nums" style={{ color: catConfig.color }}>
            {goal.progress}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${goal.progress}%`,
              backgroundColor: isCompleted ? "#10b981" : catConfig.color,
            }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-border mt-3">
        {!isCompleted && (
          <button
            onClick={() => onIncrement(goal.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            +1
          </button>
        )}
        <button
          onClick={() => onToggleComplete(goal.id)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${isCompleted
            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
        >
          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          {isCompleted ? "Done" : "Complete"}
        </button>
        <button
          onClick={() => onEdit(goal)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors ml-auto"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Empty State                                                          */
/* ────────────────────────────────────────────────────────────────────── */

function EmptyGoals({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 mb-4">
        <Target className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-1">No Goals Yet</h2>
      <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed mb-5">
        Set personal goals to track your progress and build healthy habits.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium text-sm shadow-lg shadow-primary/20 hover:scale-[1.02]"
      >
        <Plus className="w-4 h-4" />
        Create Your First Goal
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Stats Banner                                                         */
/* ────────────────────────────────────────────────────────────────────── */

function StatsBanner({ goals }: { goals: Goal[] }) {
  const stats = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter((g) => g.status === "completed").length;
    const inProgress = goals.filter((g) => g.status === "in_progress").length;
    const avgProgress = total > 0 ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / total) : 0;
    return { total, completed, inProgress, avgProgress };
  }, [goals]);

  if (goals.length === 0) return null;

  const items = [
    { icon: <Target className="w-4 h-4" />, label: "Total", value: stats.total, color: "var(--color-brand-500)" },
    { icon: <Flame className="w-4 h-4" />, label: "In Progress", value: stats.inProgress, color: "#f59e0b" },
    { icon: <Trophy className="w-4 h-4" />, label: "Completed", value: stats.completed, color: "#10b981" },
    { icon: <CheckCircle2 className="w-4 h-4" />, label: "Avg Progress", value: `${stats.avgProgress}%`, color: "#8b5cf6" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-card border border-border"
        >
          <div
            className="p-1.5 rounded-lg shrink-0"
            style={{ backgroundColor: `${item.color}15`, color: item.color }}
          >
            {item.icon}
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-foreground leading-none">{item.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Main Page                                                            */
/* ────────────────────────────────────────────────────────────────────── */

type FilterStatus = "all" | GoalStatus;

export default function PersonalGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(() => goalsService.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const refresh = useCallback(() => setGoals(goalsService.getAll()), []);

  const handleAdd = useCallback(
    (data: { title: string; description: string; category: GoalCategory; target: number; current: number; unit: string }) => {
      goalsService.add(data);
      refresh();
      setShowForm(false);
    },
    [refresh]
  );

  const handleEdit = useCallback(
    (data: { title: string; description: string; category: GoalCategory; target: number; current: number; unit: string }) => {
      if (!editingGoal) return;
      goalsService.update(editingGoal.id, data);
      refresh();
      setEditingGoal(null);
    },
    [editingGoal, refresh]
  );

  const handleIncrement = useCallback(
    (id: string) => {
      goalsService.incrementProgress(id);
      refresh();
    },
    [refresh]
  );

  const handleToggleComplete = useCallback(
    (id: string) => {
      goalsService.toggleComplete(id);
      refresh();
    },
    [refresh]
  );

  const handleDelete = useCallback(
    (id: string) => {
      goalsService.delete(id);
      refresh();
    },
    [refresh]
  );

  const filteredGoals = useMemo(() => {
    if (filterStatus === "all") return goals;
    return goals.filter((g) => g.status === filterStatus);
  }, [goals, filterStatus]);

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "in_progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
    { key: "not_started", label: "Not Started" },
  ];

  return (
    <div className="space-y-5 h-[calc(100svh-64px)] overflow-y-auto px-1 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Personal Goals
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Track your progress and build healthy habits
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Stats */}
      <StatsBanner goals={goals} />

      {/* Filter tabs */}
      {goals.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => {
            const count = f.key === "all" ? goals.length : goals.filter((g) => g.status === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${filterStatus === f.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
              >
                {f.label}
                <span
                  className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${filterStatus === f.key
                    ? "bg-primary-foreground/20"
                    : "bg-muted"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Goals grid */}
      {goals.length === 0 ? (
        <EmptyGoals onAdd={() => setShowForm(true)} />
      ) : filteredGoals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No goals match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onIncrement={handleIncrement}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={(g) => setEditingGoal(g)}
            />
          ))}
        </div>
      )}

      {/* Create dialog */}
      {showForm && (
        <GoalFormDialog
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit dialog */}
      {editingGoal && (
        <GoalFormDialog
          onSubmit={handleEdit}
          onClose={() => setEditingGoal(null)}
          initial={editingGoal}
        />
      )}
    </div>
  );
}
