import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";

type StatsRingProps = {
  completionRate: number;
  completed: number;
  total: number;
  colors: AppColors;
};

export function StatsRing({ completionRate, completed, total, colors }: StatsRingProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(completionRate, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [completionRate]);

  // Animate the filled portion using flex: progress / 100
  const fillStyle = useAnimatedStyle(() => ({
    flex: progress.value,
  }));

  // Animate the empty portion as the remaining flex
  const emptyStyle = useAnimatedStyle(() => ({
    flex: Math.max(100 - progress.value, 0),
  }));

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
      accessibilityLabel={`${completionRate}% of tasks completed`}
    >
      <Text style={[styles.percent, { color: colors.primary }]}>{completionRate}%</Text>
      <Text style={[styles.sub, { color: colors.secondary }]}>
        {completed}/{total} done
      </Text>
      {/* Animated progress bar */}
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        {completionRate > 0 && (
          <Animated.View
            style={[styles.fill, { backgroundColor: colors.primary }, fillStyle]}
          />
        )}
        <Animated.View style={emptyStyle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minWidth: 88,
  },
  fill: {
    borderRadius: radius.full,
    height: "100%",
  },
  percent: {
    ...typography.h4,
    fontWeight: "800",
    fontSize: 15,
  },
  sub: {
    ...typography.caption,
    fontSize: 10,
  },
  track: {
    borderRadius: radius.full,
    flexDirection: "row",
    height: 5,
    overflow: "hidden",
    width: "100%",
  },
});
