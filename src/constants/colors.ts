export const lightColors = {
  background: "#F5F3FF",
  surface: "#FFFFFF",
  surfaceVariant: "#EDE9FE",
  primary: "#7C3AED",
  primaryLight: "#A78BFA",
  accent: "#F59E0B",
  success: "#10B981",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",
  text: "#0F0A1E",
  secondary: "#6B7280",
  border: "#DDD6FE",
  overlay: "rgba(124,58,237,0.08)",
  skeleton: "#E5E7EB",
  skeletonHighlight: "#F9FAFB",
  glassBackground: "rgba(255, 255, 255, 0.65)",
  glassBorder: "rgba(124, 58, 237, 0.12)",
  aurora: ["#EEF2FF", "#F5F3FF", "#FAF5FF"] as [string, string, string],
};

export const darkColors = {
  background: "#05030A",
  surface: "#0E0A22",
  surfaceVariant: "#181332",
  primary: "#A78BFA",
  primaryLight: "#C4B5FD",
  accent: "#FBBF24",
  success: "#34D399",
  danger: "#F87171",
  dangerLight: "#450A0A",
  text: "#F5F3FF",
  secondary: "#9CA3AF",
  border: "#20183F",
  overlay: "rgba(167,139,250,0.08)",
  skeleton: "#181332",
  skeletonHighlight: "#20183F",
  glassBackground: "rgba(14, 10, 34, 0.65)",
  glassBorder: "rgba(167, 139, 250, 0.12)",
  aurora: ["#05030A", "#0E0720", "#140727"] as [string, string, string],
};

export const priorityColors = {
  high: { bg: "#FEF2F2", border: "#DC2626", text: "#DC2626", dot: "#DC2626" },
  medium: { bg: "#FFFBEB", border: "#F59E0B", text: "#D97706", dot: "#F59E0B" },
  low: { bg: "#F0FDF4", border: "#10B981", text: "#059669", dot: "#10B981" },
};

export const darkPriorityColors = {
  high: { bg: "#450A0A", border: "#F87171", text: "#F87171", dot: "#F87171" },
  medium: { bg: "#451A00", border: "#FBBF24", text: "#FBBF24", dot: "#FBBF24" },
  low: { bg: "#022C22", border: "#34D399", text: "#34D399", dot: "#34D399" },
};

export const gradients = {
  primary: ["#7C3AED", "#A78BFA"] as [string, string],
  primaryDark: ["#A78BFA", "#C4B5FD"] as [string, string],
  accent: ["#F59E0B", "#FCD34D"] as [string, string],
  danger: ["#DC2626", "#F87171"] as [string, string],
  success: ["#059669", "#34D399"] as [string, string],
  card: ["rgba(124,58,237,0.04)", "rgba(124,58,237,0.0)"] as [string, string],
};

export type AppColors = typeof lightColors;
export type Priority = "high" | "medium" | "low";
