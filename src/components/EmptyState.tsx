import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";

type EmptyStateProps = {
  title: string;
  message: string;
  colors: AppColors;
  onAction?: () => void;
  actionLabel?: string;
};

const ILLUSTRATIONS = {
  empty: "📋",
  noResults: "🔍",
  allDone: "🎉",
};

export function EmptyState({ title, message, colors, onAction, actionLabel }: EmptyStateProps) {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    opacity.value = withSpring(1, { damping: 15 });
    // Gentle float
    const interval = setInterval(() => {
      bounce.value = withSpring(-6, { damping: 8 }, () => {
        bounce.value = withSpring(0, { damping: 8 });
      });
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const isNoResults = title.toLowerCase().includes("no matching") || title.toLowerCase().includes("no results");
  const isAllDone = title.toLowerCase().includes("all done");
  const emoji = isAllDone ? ILLUSTRATIONS.allDone : isNoResults ? ILLUSTRATIONS.noResults : ILLUSTRATIONS.empty;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.illustration, illustrationStyle]}>{emoji}</Animated.Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.secondary }]}>{message}</Text>
      {onAction && actionLabel && (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  buttonText: {
    color: "#FFFFFF",
    ...typography.label,
    fontWeight: "700",
    fontSize: 14,
  },
  container: {
    alignItems: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  illustration: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  title: {
    ...typography.h3,
    textAlign: "center",
  },
});
