import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/types/task";

export const TASKS_STORAGE_KEY = "@taskflow/tasks";

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
