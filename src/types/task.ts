export type TaskPriority = "high" | "medium" | "low";
export type TaskCategory = "work" | "personal" | "health" | "study" | "other";

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskFilter = "all" | "active" | "completed";
export type TaskSort = "createdAt" | "priority" | "dueDate" | "title";

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const CATEGORY_LABELS: Record<NonNullable<Task["category"]>, string> = {
  work: "Work",
  personal: "Personal",
  health: "Health",
  study: "Study",
  other: "Other",
};

export const CATEGORY_EMOJIS: Record<NonNullable<Task["category"]>, string> = {
  work: "💼",
  personal: "🏠",
  health: "💪",
  study: "📚",
  other: "✨",
};
