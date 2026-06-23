export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatRelativeDate(value: string): { label: string; isOverdue: boolean } {
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffMs = date.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: `Overdue by ${Math.abs(diffDays)}d`, isOverdue: true };
  if (diffDays === 0) return { label: "Due Today", isOverdue: false };
  if (diffDays === 1) return { label: "Due Tomorrow", isOverdue: false };
  if (diffDays <= 6) return { label: `Due in ${diffDays}d`, isOverdue: false };

  return {
    label: `Due ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value))}`,
    isOverdue: false,
  };
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
