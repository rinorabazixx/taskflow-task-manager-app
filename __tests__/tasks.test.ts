jest.mock("uuid", () => ({
  v4: () => "mock-task-id"
}));

import { addTaskToList, createTask, deleteTaskFromList, toggleTaskInList } from "@/hooks/useTasks";

describe("task operations", () => {
  const firstTask = createTask("Plan week", "Review schedule", "task-1", "2026-06-22T10:00:00.000Z");
  const secondTask = createTask("Write notes", "", "task-2", "2026-06-22T11:00:00.000Z");

  it("adds new tasks to the top of the list", () => {
    expect(addTaskToList([firstTask], secondTask)).toEqual([secondTask, firstTask]);
  });

  it("toggles completion without changing other tasks", () => {
    const result = toggleTaskInList([firstTask, secondTask], "task-1");

    expect(result[0]).toEqual({ ...firstTask, completed: true });
    expect(result[1]).toEqual(secondTask);
  });

  it("deletes a task by id", () => {
    expect(deleteTaskFromList([firstTask, secondTask], "task-2")).toEqual([firstTask]);
  });
});
