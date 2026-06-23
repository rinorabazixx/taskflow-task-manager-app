import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { loadTasks, saveTasks } from "@/services/storage";
import { PRIORITY_ORDER, Task, TaskCategory, TaskPriority, TaskSort } from "@/types/task";

type TaskStats = {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  overdue: number;
};

type TaskContextValue = {
  tasks: Task[];
  isLoading: boolean;
  stats: TaskStats;
  addTask: (title: string, description: string, priority: TaskPriority, dueDate: string | null, category: TaskCategory | null) => Task;
  editTask: (id: string, updates: Partial<Pick<Task, "title" | "description" | "priority" | "dueDate" | "category">>) => void;
  deleteTask: (id: string) => void;
  restoreTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  reloadTasks: () => Promise<void>;
  sortTasks: (tasks: Task[], by: TaskSort) => Task[];
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

export function createTask(
  title: string,
  description: string,
  priority: TaskPriority = "medium",
  dueDate: string | null = null,
  category: TaskCategory | null = null,
  id = uuidv4(),
  createdAt = new Date().toISOString()
): Task {
  return {
    id,
    title,
    description,
    completed: false,
    priority,
    dueDate,
    category,
    createdAt,
    updatedAt: createdAt,
  };
}

export function addTaskToList(tasks: Task[], task: Task) {
  return [task, ...tasks];
}

export function deleteTaskFromList(tasks: Task[], id: string) {
  return tasks.filter((task) => task.id !== id);
}

export function toggleTaskInList(tasks: Task[], id: string) {
  const now = new Date().toISOString();
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed, updatedAt: now } : task
  );
}

export function editTaskInList(
  tasks: Task[],
  id: string,
  updates: Partial<Pick<Task, "title" | "description" | "priority" | "dueDate" | "category">>
) {
  const now = new Date().toISOString();
  return tasks.map((task) =>
    task.id === id ? { ...task, ...updates, updatedAt: now } : task
  );
}

export function sortTaskList(tasks: Task[], by: TaskSort): Task[] {
  return [...tasks].sort((a, b) => {
    if (by === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (by === "title") return a.title.localeCompare(b.title);
    if (by === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    // createdAt default — newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/** Migrate legacy tasks that lack new fields */
function migrateTasks(raw: unknown[]): Task[] {
  return raw.map((t: unknown) => {
    const task = t as Partial<Task> & { id: string; title: string; description: string; completed: boolean; createdAt: string };
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority ?? "medium",
      dueDate: task.dueDate ?? null,
      category: task.category ?? null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt ?? task.createdAt,
    };
  });
}

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const reloadTasks = async () => {
    setIsLoading(true);
    const storedTasks = await loadTasks();
    setTasks(migrateTasks(storedTasks as unknown[]));
    setHasLoaded(true);
    setIsLoading(false);
  };

  useEffect(() => {
    void reloadTasks();
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      void saveTasks(tasks);
    }
  }, [hasLoaded, tasks]);

  const stats = useMemo<TaskStats>(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const overdue = tasks.filter(isOverdue).length;
    return {
      total,
      completed,
      active,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      overdue,
    };
  }, [tasks]);

  const addTask = (
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate: string | null,
    category: TaskCategory | null
  ) => {
    const task = createTask(title, description, priority, dueDate, category);
    setTasks((current) => addTaskToList(current, task));
    return task;
  };

  const editTask = (
    id: string,
    updates: Partial<Pick<Task, "title" | "description" | "priority" | "dueDate" | "category">>
  ) => {
    setTasks((current) => editTaskInList(current, id, updates));
  };

  const deleteTask = (id: string) => {
    setTasks((current) => deleteTaskFromList(current, id));
  };

  const restoreTask = (task: Task) => {
    setTasks((current) => [task, ...current.filter((t) => t.id !== task.id)]);
  };

  const toggleTask = (id: string) => {
    setTasks((current) => toggleTaskInList(current, id));
  };

  const sortTasks = (taskList: Task[], by: TaskSort) => sortTaskList(taskList, by);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, stats, addTask, editTask, deleteTask, restoreTask, toggleTask, reloadTasks, sortTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used inside TaskProvider");
  return context;
}
