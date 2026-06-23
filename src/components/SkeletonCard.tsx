import { useEffect } from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { AppColors } from "@/constants/colors";
import { radius, spacing } from "@/constants/spacing";

type SkeletonCardProps = {
  colors: AppColors;
};

function SkeletonLine({ width, height = 12, colors }: { width: DimensionValue; height?: number; colors: AppColors }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    // Wrap in plain View so the `width: string | number` never touches Animated.View's stricter types
    <Animated.View style={animatedStyle}>
      <View style={{ width, height, borderRadius: radius.sm, backgroundColor: colors.skeleton }} />
    </Animated.View>
  );
}

export function SkeletonCard({ colors }: SkeletonCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.circle, { backgroundColor: colors.skeleton }]} />
      <View style={styles.content}>
        <SkeletonLine width="70%" height={14} colors={colors} />
        <View style={styles.gap} />
        <SkeletonLine width="90%" height={10} colors={colors} />
        <View style={styles.gap} />
        <SkeletonLine width="40%" height={10} colors={colors} />
      </View>
    </View>
  );
}

export function SkeletonList({ colors }: SkeletonCardProps) {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} colors={colors} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: spacing.md,
    minHeight: 88,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  circle: {
    borderRadius: radius.full,
    height: 36,
    marginRight: spacing.md,
    width: 36,
  },
  content: {
    flex: 1,
    gap: 0,
  },
  gap: {
    height: 6,
  },
});
