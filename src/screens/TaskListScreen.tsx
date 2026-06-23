import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { EmptyState } from "@/components/EmptyState";
import { FilterTabs } from "@/components/FilterTabs";
import { SearchBar } from "@/components/SearchBar";
import { SkeletonList } from "@/components/SkeletonCard";
import { StatsRing } from "@/components/StatsRing";
import { TaskCard } from "@/components/TaskCard";
import { darkColors, lightColors } from "@/constants/colors";
import { radius, shadow, spacing, typography } from "@/constants/spacing";
import { useDebounce } from "@/hooks/useDebounce";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskFilter, TaskSort } from "@/types/task";
import { getGreeting } from "@/utils/date";

const SORT_OPTIONS: { value: TaskSort; label: string; icon: string }[] = [
  { value: "createdAt", label: "Date Created", icon: "clock-outline" },
  { value: "priority", label: "Priority", icon: "flag-outline" },
  { value: "dueDate", label: "Due Date", icon: "calendar-outline" },
  { value: "title", label: "Alphabetical", icon: "sort-alphabetical-ascending" },
];

export function TaskListScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = isDark ? darkColors : lightColors;
  const { tasks, isLoading, stats, deleteTask, restoreTask, toggleTask, reloadTasks, sortTasks } = useTasks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [sort, setSort] = useState<TaskSort>("createdAt");
  const [showSort, setShowSort] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  const filteredTasks = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        query.length === 0 ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);
      return matchesSearch && matchesFilter;
    });
    return sortTasks(filtered, sort);
  }, [tasks, debouncedSearch, filter, sort, sortTasks]);

  const counts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }), [tasks]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadTasks();
    setRefreshing(false);
  };

  const handleToggle = (id: string) => {
    toggleTask(id);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      deleteTask(id);
      setDeletedTask(task);
      setSnackVisible(true);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleUndo = () => {
    if (deletedTask) {
      restoreTask(deletedTask);
      setDeletedTask(null);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSnackVisible(false);
  };

  const handleFabPress = () => {
    fabScale.value = withSpring(0.88, { damping: 8 }, () => {
      fabScale.value = withSpring(1, { damping: 10 });
    });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/add");
  };

  const currentSort = SORT_OPTIONS.find((o) => o.value === sort);

  const renderTask = ({ item, index }: { item: Task; index: number }) => (
    <TaskCard
      task={item}
      colors={colors}
      isDark={isDark}
      onToggle={handleToggle}
      onDelete={handleDelete}
      index={index}
    />
  );

  return (
    <BackgroundGradient colors={colors}>
      <View testID="taskflow-home" style={[styles.screen, { backgroundColor: "transparent" }]}>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              {/* Header row: greeting + stats ring */}
              <View style={styles.headerRow}>
                <View style={styles.greetingBlock}>
                  <Text style={[styles.greeting, { color: colors.secondary }]}>{getGreeting()} 👋</Text>
                  <Text style={[styles.heading, { color: colors.text }]}>My Tasks</Text>
                </View>
                <StatsRing
                  completionRate={stats.completionRate}
                  completed={stats.completed}
                  total={stats.total}
                  colors={colors}
                />
              </View>

              {/* Overdue warning */}
              {stats.overdue > 0 && (
                <View style={[styles.overdueBar, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.danger} />
                  <Text style={[styles.overdueText, { color: colors.danger }]}>
                    {stats.overdue} task{stats.overdue > 1 ? "s" : ""} overdue
                  </Text>
                </View>
              )}

              <SearchBar value={search} onChangeText={setSearch} />
              <FilterTabs value={filter} onChange={setFilter} counts={counts} />

              {/* Sort row */}
              <View style={styles.sortRow}>
                <Text style={[styles.taskCount, { color: colors.secondary }]}>
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                </Text>
                <Pressable
                  onPress={() => setShowSort(!showSort)}
                  accessibilityRole="button"
                  accessibilityLabel="Sort tasks"
                  style={[styles.sortButton, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
                >
                  <MaterialCommunityIcons name="sort" size={16} color={colors.primary} />
                  <Text style={[styles.sortLabel, { color: colors.primary }]}>{currentSort?.label}</Text>
                </Pressable>
              </View>

              {/* Sort sheet */}
              {showSort && (
                <View style={[styles.sortSheet, { backgroundColor: colors.surface, borderColor: colors.border }, shadow.md]}>
                  {SORT_OPTIONS.map((opt) => (
                    <Pressable
                      key={opt.value}
                      onPress={() => { setSort(opt.value); setShowSort(false); }}
                      accessibilityRole="menuitem"
                      accessibilityLabel={`Sort by ${opt.label}`}
                      style={[
                        styles.sortOption,
                        opt.value === sort && { backgroundColor: colors.overlay },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={opt.icon as never}
                        size={18}
                        color={opt.value === sort ? colors.primary : colors.secondary}
                      />
                      <Text style={[styles.sortOptionText, { color: opt.value === sort ? colors.primary : colors.text }]}>
                        {opt.label}
                      </Text>
                      {opt.value === sort && (
                        <MaterialCommunityIcons name="check" size={16} color={colors.primary} style={{ marginLeft: "auto" }} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            isLoading ? (
              <View style={{ padding: spacing.md }}>
                <SkeletonList colors={colors} />
              </View>
            ) : (
              <EmptyState
                title={search || filter !== "all" ? "No matching tasks" : "No tasks yet"}
                message={
                  search || filter !== "all"
                    ? "Try adjusting your search or filter."
                    : "Tap + to create your first task and start the day with clarity."
                }
                colors={colors}
                onAction={!search && filter === "all" ? () => router.push("/add") : undefined}
                actionLabel="Create First Task"
              />
            )
          }
        />

        {/* FAB */}
        <Animated.View style={[styles.fab, { backgroundColor: colors.primary }, shadow.lg, fabStyle]}>
          <Pressable
            onPress={handleFabPress}
            accessibilityRole="button"
            accessibilityLabel="Add task"
            style={styles.fabInner}
          >
            <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
          </Pressable>
        </Animated.View>

        {/* Undo Snackbar */}
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={3500}
          action={{ label: "Undo", onPress: handleUndo, textColor: colors.primaryLight }}
          style={{ backgroundColor: colors.surface }}
        >
          <Text style={{ color: colors.text }}>Task deleted</Text>
        </Snackbar>
      </View>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  fab: {
    borderRadius: radius.full,
    bottom: spacing.xl,
    position: "absolute",
    right: spacing.lg,
  },
  fabInner: {
    alignItems: "center",
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  greeting: {
    ...typography.label,
    fontSize: 13,
    marginBottom: 2,
  },
  greetingBlock: {
    flex: 1,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingTop: spacing.lg,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    ...typography.h1,
  },
  overdueBar: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  overdueText: {
    ...typography.label,
    fontWeight: "600",
  },
  screen: {
    flex: 1,
  },
  sortButton: {
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  sortLabel: {
    ...typography.label,
    fontSize: 12,
    fontWeight: "600",
  },
  sortOption: {
    alignItems: "center",
    borderRadius: radius.sm,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
  },
  sortOptionText: {
    ...typography.bodyMedium,
  },
  sortRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sortSheet: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  taskCount: {
    ...typography.label,
    fontSize: 12,
  },
});
