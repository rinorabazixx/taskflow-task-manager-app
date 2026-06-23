import { validateTask } from "@/utils/validation";

describe("validateTask", () => {
  it("requires a non-empty title", () => {
    const result = validateTask({ title: "   ", description: "", priority: "medium", dueDate: null, category: null });

    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe("Title is required");
  });

  it("limits title and description length", () => {
    const result = validateTask({
      title: "a".repeat(101),
      description: "b".repeat(501),
      priority: "medium",
      dueDate: null,
      category: null
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe("Title must be 100 characters or fewer");
    expect(result.errors.description).toBe("Description must be 500 characters or fewer");
  });

  it("trims valid values before submission", () => {
    const result = validateTask({ title: "  Buy milk  ", description: "  Oat milk  ", priority: "medium", dueDate: null, category: null });

    expect(result.isValid).toBe(true);
    expect(result.values).toEqual({ title: "Buy milk", description: "Oat milk", priority: "medium", dueDate: null, category: null });
  });
});

