import {
  chooseDailyInspiration,
  formatCountdown,
  getDeviceClockSnapshot,
  getLocalDateKey,
  InspirationTodo,
} from "@/services/api";

const todos: InspirationTodo[] = [
  { id: 1, todo: "First idea", completed: false },
  { id: 2, todo: "Second idea", completed: false },
  { id: 3, todo: "Third idea", completed: true },
];

describe("daily inspiration", () => {
  it("returns the same inspiration for the same local date", () => {
    const first = chooseDailyInspiration(todos, "2026-06-23");
    const second = chooseDailyInspiration(todos, "2026-06-23");

    expect(second).toEqual(first);
  });

  it("builds a date key from the viewer's local calendar date", () => {
    const date = new Date(2026, 5, 23, 13, 30, 0);

    expect(getLocalDateKey(date)).toBe("2026-06-23");
  });

  it("counts down to the next local midnight", () => {
    const clock = getDeviceClockSnapshot(new Date(2026, 5, 23, 13, 30, 0));

    expect(clock.msUntilNextQuote).toBe(10.5 * 60 * 60 * 1000);
    expect(formatCountdown(clock.msUntilNextQuote)).toBe("10h 30m");
  });
});
