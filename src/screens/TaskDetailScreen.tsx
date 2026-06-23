import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Button, Dialog, Divider, Portal, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AppButton } from "@/components/AppButton";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import {
  darkColors,
  darkPriorityColors,
  lightColors,
  priorityColors,
} from "@/constants/colors";
import { radius, shadow, spacing, typography } from "@/constants/spacing";
import { useTasks } from "@/hooks/useTasks";
import { CATEGORY_EMOJIS, CATEGORY_LABELS } from "@/types/task";
import { formatDate, formatRelativeDate } from "@/utils/date";

const PRIORITY_BARS: Record<string, string> = {
  high: "#DC2626",
  medium: "#F59E0B",
  low: "#10B981",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "🔴 High Priority",
  medium: "🟡 Medium Priority",
  low: "🟢 Low Priority",
};

export function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = isDark ? darkColors : lightColors;
  const pc = isDark ? darkPriorityColors : priorityColors;
  const { tasks, toggleTask, deleteTask } = useTasks();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const task = tasks.find((item) => item.id === id);

  const toggleScale = useSharedValue(1);
  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: toggleScale.value }],
  }));

  // Task not found — still wrapped in BackgroundGradient for visual consistency
  if (!task) {
    return (
      <BackgroundGradient colors={colors}>
        <View style={styles.missing}>
          <Text style={styles.missingEmoji}>🔍</Text>
          <Text style={[typography.h3, { color: colors.text, textAlign: "center" }]}>
            Task not found
          </Text>
          <Button
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            Go Back
          </Button>
        </View>
      </BackgroundGradient>
    );
  }

  const relative = task.dueDate ? formatRelativeDate(task.dueDate) : null;

  const handleToggle = () => {
    toggleScale.value = withSpring(0.85, { damping: 8 }, () => {
      toggleScale.value = withSpring(1, { damping: 10 });
    });
    toggleTask(task.id);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setConfirmVisible(false);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.back();
  };

  return (
    <BackgroundGradient colors={colors}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow.sm,
          ]}
        >
          {/* Coloured priority bar at top of card */}
          <View
            style={[
              styles.heroPriorityBar,
              { backgroundColor: PRIORITY_BARS[task.priority] },
            ]}
          />
          <View style={styles.heroInner}>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor: pc[task.priority].bg,
                  borderColor: pc[task.priority].border,
                },
              ]}
            >
              <Text style={[typography.label, { color: pc[task.priority].text }]}>
                {PRIORITY_LABELS[task.priority]}
              </Text>
            </View>
            <Text
              style={[
                styles.heroTitle,
                {
                  color: task.completed ? colors.secondary : colors.text,
                  textDecorationLine: task.completed ? "line-through" : "none",
                },
              ]}
            >
              {task.title}
            </Text>
            {task.description ? (
              <Text style={[styles.heroDesc, { color: colors.secondary }]}>
                {task.description}
              </Text>
            ) : (
              <Text
                style={[
                  styles.heroDesc,
                  { color: colors.secondary, fontStyle: "italic" },
                ]}
              >
                No description
              </Text>
            )}
          </View>
        </View>

        {/* Meta info card */}
        <View
          style={[
            styles.metaCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow.sm,
          ]}
        >
          {/* Status row */}
          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={18}
              color={colors.secondary}
            />
            <Text style={[styles.metaLabel, { color: colors.secondary }]}>
              Status
            </Text>
            <Animated.View
              style={[
                styles.statusPill,
                {
                  backgroundColor: task.completed
                    ? colors.success + "20"
                    : colors.primary + "15",
                },
                toggleStyle,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: task.completed
                      ? colors.success
                      : colors.primary,
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: task.completed ? colors.success : colors.primary,
                  },
                ]}
              >
                {task.completed ? "Completed" : "Active"}
              </Text>
            </Animated.View>
          </View>

          <Divider style={{ backgroundColor: colors.border }} />

          {/* Due date row */}
          {task.dueDate && relative && (
            <>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={18}
                  color={relative.isOverdue ? colors.danger : colors.secondary}
                />
                <Text style={[styles.metaLabel, { color: colors.secondary }]}>
                  Due Date
                </Text>
                <Text
                  style={[
                    styles.metaValue,
                    {
                      color: relative.isOverdue ? colors.danger : colors.text,
                    },
                  ]}
                >
                  {relative.label}
                </Text>
              </View>
              <Divider style={{ backgroundColor: colors.border }} />
            </>
          )}

          {/* Category row */}
          {task.category && (
            <>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons
                  name="tag-outline"
                  size={18}
                  color={colors.secondary}
                />
                <Text style={[styles.metaLabel, { color: colors.secondary }]}>
                  Category
                </Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  {CATEGORY_EMOJIS[task.category]}{" "}
                  {CATEGORY_LABELS[task.category]}
                </Text>
              </View>
              <Divider style={{ backgroundColor: colors.border }} />
            </>
          )}

          {/* Created row */}
          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color={colors.secondary}
            />
            <Text style={[styles.metaLabel, { color: colors.secondary }]}>
              Created
            </Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>
              {formatDate(task.createdAt)}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <AppButton
            onPress={handleToggle}
            accessibilityLabel={
              task.completed ? "Mark task active" : "Mark task complete"
            }
          >
            {task.completed ? "Mark as Active" : "Mark as Complete ✓"}
          </AppButton>

          <Pressable
            onPress={() => router.push(`/edit/${task.id}`)}
            accessibilityRole="button"
            accessibilityLabel="Edit task"
            style={[
              styles.editButton,
              {
                borderColor: colors.primary,
                backgroundColor: colors.overlay,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={[styles.editButtonText, { color: colors.primary }]}>
              Edit Task
            </Text>
          </Pressable>

          <AppButton
            variant="danger"
            onPress={() => setConfirmVisible(true)}
            accessibilityLabel="Delete task"
          >
            Delete Task
          </AppButton>
        </View>

        {/* Delete confirmation dialog */}
        <Portal>
          <Dialog
            visible={confirmVisible}
            onDismiss={() => setConfirmVisible(false)}
            style={{ backgroundColor: colors.surface }}
          >
            <Dialog.Title style={{ color: colors.text }}>
              Delete task?
            </Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: colors.secondary }}>
                This cannot be undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setConfirmVisible(false)}
                textColor={colors.secondary}
              >
                Cancel
              </Button>
              <Button onPress={handleDelete} textColor={colors.danger}>
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  editButton: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  editButtonText: {
    ...typography.h4,
    fontWeight: "700",
  },
  heroCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  heroDesc: {
    ...typography.body,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  heroInner: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  heroPriorityBar: {
    height: 5,
    width: "100%",
  },
  heroTitle: {
    ...typography.h2,
  },
  metaCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  metaLabel: {
    ...typography.bodyMedium,
    flex: 1,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  metaValue: {
    ...typography.bodyMedium,
    fontWeight: "600",
  },
  missing: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    padding: spacing.md,
  },
  missingEmoji: {
    fontSize: 48,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  statusDot: {
    borderRadius: radius.full,
    height: 7,
    width: 7,
  },
  statusPill: {
    alignItems: "center",
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusText: {
    ...typography.label,
    fontWeight: "700",
  },
});
