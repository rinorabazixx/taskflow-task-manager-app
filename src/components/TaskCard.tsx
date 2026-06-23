import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { memo, useEffect } from "react";
import { Pressable, StyleSheet, View, Platform } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { AppColors, darkPriorityColors, priorityColors } from "@/constants/colors";
import { radius, shadow, spacing, typography } from "@/constants/spacing";
import { CATEGORY_EMOJIS, Task } from "@/types/task";
import { formatRelativeDate } from "@/utils/date";

type TaskCardProps = {
  task: Task;
  colors: AppColors;
  isDark: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index?: number;
};

const PRIORITY_BARS: Record<Task["priority"], string> = {
  high: "#DC2626",
  medium: "#F59E0B",
  low: "#10B981",
};

function TaskCardComponent({ task, colors, isDark, onToggle, onDelete, index = 0 }: TaskCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const checkScale = useSharedValue(1);
  const pulse = useSharedValue(1);

  const pc = isDark ? darkPriorityColors : priorityColors;
  const relative = task.dueDate ? formatRelativeDate(task.dueDate) : null;

  // Staggered entry animation
  useEffect(() => {
    const delay = index * 50;
    const timeout = setTimeout(() => {
      opacity.value = withSpring(1, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  // Priority pulse animation for high priority incomplete tasks
  useEffect(() => {
    if (task.priority === "high" && !task.completed) {
      pulse.value = withRepeat(
        withTiming(1.06, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [task.priority, task.completed]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 12 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 });
  };

  const handleTogglePress = () => {
    checkScale.value = withSpring(1.35, { damping: 7 }, () => {
      checkScale.value = withSpring(1, { damping: 8 });
    });
    onToggle(task.id);
  };

  const openDetails = () => router.push(`/task/${task.id}`);
  const handleLongPress = () => void Haptics.selectionAsync();

  const renderLeftActions = () => (
    <RectButton
      style={[styles.action, { backgroundColor: colors.success }]}
      onPress={() => onToggle(task.id)}
      accessibilityRole="button"
      accessibilityLabel={task.completed ? "Mark task active" : "Mark task complete"}
    >
      <MaterialCommunityIcons
        name={task.completed ? "refresh" : "check"}
        size={22}
        color="#FFFFFF"
      />
      <Text style={styles.actionText}>{task.completed ? "Active" : "Done"}</Text>
    </RectButton>
  );

  const renderRightActions = () => (
    <RectButton
      style={[styles.action, { backgroundColor: colors.danger }]}
      onPress={() => onDelete(task.id)}
      accessibilityRole="button"
      accessibilityLabel="Delete task"
    >
      <MaterialCommunityIcons name="trash-can-outline" size={22} color="#FFFFFF" />
      <Text style={styles.actionText}>Delete</Text>
    </RectButton>
  );

  return (
    <Swipeable renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
      <Animated.View
        layout={LinearTransition.springify().duration(300)}
        exiting={FadeOut.duration(200)}
        style={cardStyle}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.glassBackground,
              borderColor: colors.glassBorder,
              borderWidth: 1.5,
              ...Platform.select({
                web: {
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                } as any,
                default: {},
              }),
            },
            shadow.sm,
          ]}
        >
          {/* Priority accent bar */}
          <View style={[styles.priorityBar, { backgroundColor: PRIORITY_BARS[task.priority] }]} />

          {/* Toggle button */}
          <Pressable
            onPress={handleTogglePress}
            style={styles.checkWrap}
            accessibilityRole="button"
            accessibilityLabel={task.completed ? "Mark task active" : "Mark task complete"}
            hitSlop={8}
          >
            <Animated.View style={checkStyle}>
              <MaterialCommunityIcons
                name={task.completed ? "check-circle" : "circle-outline"}
                size={26}
                color={task.completed ? colors.success : colors.secondary}
              />
            </Animated.View>
          </Pressable>

          {/* Sibling details click area to avoid nesting buttons */}
          <Pressable
            onPress={openDetails}
            onLongPress={handleLongPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel={`Open details for ${task.title}`}
            style={styles.detailsPressable}
          >
            {/* Content */}
            <View style={styles.content}>
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  {
                    color: task.completed ? colors.secondary : colors.text,
                    textDecorationLine: task.completed ? "line-through" : "none",
                  },
                ]}
              >
                {task.title}
              </Text>
              {task.description ? (
                <Text
                  numberOfLines={2}
                  style={[styles.description, { color: colors.secondary }]}
                >
                  {task.description}
                </Text>
              ) : null}

              {/* Badges row */}
              <View style={styles.badges}>
                {/* Priority badge */}
                <Animated.View
                  style={[
                    styles.badge,
                    pulseStyle,
                    { backgroundColor: pc[task.priority].bg, borderColor: pc[task.priority].border },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: pc[task.priority].text }]}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Text>
                </Animated.View>

                {/* Category badge */}
                {task.category && (
                  <View style={[styles.badge, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
                    <Text style={[styles.badgeText, { color: colors.secondary }]}>
                      {CATEGORY_EMOJIS[task.category]} {task.category}
                    </Text>
                  </View>
                )}

                {/* Due date badge */}
                {relative && (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: relative.isOverdue ? colors.dangerLight : colors.surfaceVariant,
                        borderColor: relative.isOverdue ? colors.danger : colors.border,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="calendar-outline"
                      size={10}
                      color={relative.isOverdue ? colors.danger : colors.secondary}
                    />
                    <Text
                      style={[
                        styles.badgeText,
                        { color: relative.isOverdue ? colors.danger : colors.secondary },
                      ]}
                    >
                      {relative.label}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.secondary} style={styles.chevron} />
          </Pressable>
        </View>
      </Animated.View>
    </Swipeable>
  );
}

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 96,
    paddingHorizontal: spacing.lg,
  },
  actionText: {
    color: "#FFFFFF",
    ...typography.label,
    fontWeight: "700",
  },
  badge: {
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: "600",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  card: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: spacing.md,
    minHeight: 88,
    overflow: "hidden",
  },
  checkWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    minHeight: 44,
    minWidth: 44,
    zIndex: 10,
  },
  detailsPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  chevron: {
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingRight: spacing.sm,
  },
  description: {
    ...typography.bodyMedium,
    marginTop: 2,
  },
  priorityBar: {
    alignSelf: "stretch",
    borderRadius: 0,
    width: 4,
  },
  title: {
    ...typography.h4,
  },
});
