import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/types/task";
import { InspirationTodo } from "@/services/api";

export const TASKS_STORAGE_KEY = "@taskflow/tasks";
export const INSPIRATION_STORAGE_KEY = "@taskflow/daily-inspiration";

export type StoredInspiration = {
  dateKey: string;
  todo: InspirationTodo;
};

export async function loadTasks() {
  try {
    const raw = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]) {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage failures should not interrupt task editing.
  }
}

export async function loadDailyInspiration() {
  try {
    const raw = await AsyncStorage.getItem(INSPIRATION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredInspiration) : null;
  } catch {
    return null;
  }
}

export async function saveDailyInspiration(inspiration: StoredInspiration) {
  try {
    await AsyncStorage.setItem(INSPIRATION_STORAGE_KEY, JSON.stringify(inspiration));
  } catch {
    // Inspiration storage is optional; the UI can still show the fetched item.
  }
}
