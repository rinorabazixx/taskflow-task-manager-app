import { TaskCategory, TaskPriority } from "@/types/task";

export type TaskFormValues = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string | null;
  category: TaskCategory | null;
};

export type TaskFormErrors = Partial<Record<keyof Pick<TaskFormValues, "title" | "description">, string>>;

export function validateTask(values: TaskFormValues) {
  const errors: TaskFormErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (!title) {
    errors.title = "Title is required";
  } else if (title.length > 100) {
    errors.title = "Title must be 100 characters or fewer";
  }

  if (values.description.length > 0 && !description) {
    errors.description = "Description cannot be only whitespace";
  } else if (description.length > 500) {
    errors.description = "Description must be 500 characters or fewer";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    values: {
      title,
      description,
      priority: values.priority,
      dueDate: values.dueDate,
      category: values.category,
    },
  };
}
