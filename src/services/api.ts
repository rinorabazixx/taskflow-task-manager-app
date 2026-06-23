export type InspirationTodo = {
  id: number;
  todo: string;
  completed: boolean;
};

type DummyJsonResponse = {
  todos: InspirationTodo[];
};

export async function fetchDailyInspiration() {
  const response = await fetch("https://dummyjson.com/todos");

  if (!response.ok) {
    throw new Error("Unable to load inspiration");
  }

  const data = (await response.json()) as DummyJsonResponse;
  const todos = data.todos ?? [];

  if (todos.length === 0) {
    throw new Error("No inspiration available");
  }

  return todos[Math.floor(Math.random() * todos.length)];
}
