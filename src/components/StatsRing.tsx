import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppColors } from "@/constants/colors";
import { spacing, typography } from "@/constants/spacing";

type StatsRingProps = {
  completionRate: number;
  completed: number;
  total: number;
  colors: AppColors;
};

const SIZE = 72;
const STROKE = 6;

export function StatsRing({ completionRate, completed, total, colors }: StatsRingProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(completionRate / 100, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [completionRate]);

  // On Web: use a conic-gradient mask via the background style trick
  // On Native: animate border colors via two half-circle overlays
  const arcStyle = useAnimatedStyle(() => {
    const deg = Math.round(progress.value * 360);
    if (Platform.OS === "web") {
      return {
        background: `conic-gradient(${colors.primary} ${deg}deg, ${colors.border} ${deg}deg)`,
      } as any;
    }
    // Native fallback: simple border approach
    return {
      borderColor: colors.primary,
      transform: [{ rotate: `${deg - 360}deg` }],
    };
  });

  if (Platform.OS === "web") {
    return (
      <View
        style={[styles.card, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
        accessibilityLabel={`${completionRate}% of tasks completed`}
      >
        {/* Web: conic-gradient ring */}
        <View style={{ width: SIZE, height: SIZE, position: "relative" }}>
          <Animated.View
            style={[
              styles.ring,
              { width: SIZE, height: SIZE, borderRadius: SIZE / 2 },
              arcStyle,
            ]}
          />
          {/* Mask inner circle to create donut */}
          <View
            style={[
              styles.ringInner,
              {
                width: SIZE - STROKE * 2,
                height: SIZE - STROKE * 2,
                borderRadius: (SIZE - STROKE * 2) / 2,
                top: STROKE,
                left: STROKE,
                backgroundColor: colors.surfaceVariant,
              },
            ]}
          />
          {/* Centered percentage */}
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.textCenter}>
              <Text style={[styles.percent, { color: colors.primary }]}>
                {completionRate}%
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sub, { color: colors.secondary }]}>
          {completed}/{total} done
        </Text>
      </View>
    );
  }

  // Native: two semicircle border trick
  const leftVisible = completionRate > 50;
  const leftDeg = leftVisible ? ((completionRate - 50) / 50) * 180 : 0;
  const rightDeg = Math.min(completionRate / 50, 1) * 180;

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
      accessibilityLabel={`${completionRate}% of tasks completed`}
    >
      <View style={{ width: SIZE, height: SIZE }}>
        {/* Track circle */}
        <View
          style={[
            styles.track,
            {
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              borderColor: colors.border,
              borderWidth: STROKE,
            },
          ]}
        />

        {/* Right half progress */}
        <View style={[styles.halfCircleContainer, { width: SIZE / 2, left: SIZE / 2 }]}>
          <View
            style={[
              styles.halfCircle,
              {
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                borderColor: colors.primary,
                borderWidth: STROKE,
                transform: [{ rotate: `${rightDeg - 180}deg` }],
              },
            ]}
          />
        </View>

        {/* Left half progress (only visible when > 50%) */}
        {leftVisible && (
          <View style={[styles.halfCircleContainer, { width: SIZE / 2, left: 0 }]}>
            <View
              style={[
                styles.halfCircle,
                {
                  width: SIZE,
                  height: SIZE,
                  borderRadius: SIZE / 2,
                  borderColor: colors.primary,
                  borderWidth: STROKE,
                  right: 0,
                  left: undefined,
                  transform: [{ rotate: `${leftDeg}deg` }],
                },
              ]}
            />
          </View>
        )}

        {/* Center label */}
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.textCenter}>
            <Text style={[styles.percent, { color: colors.primary }]}>
              {completionRate}%
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sub, { color: colors.secondary }]}>
        {completed}/{total} done
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 2,
  },
  ring: {
    position: "absolute",
  },
  ringInner: {
    position: "absolute",
  },
  track: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  halfCircleContainer: {
    position: "absolute",
    top: 0,
    height: SIZE,
    overflow: "hidden",
  },
  halfCircle: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  textCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  percent: {
    ...typography.label,
    fontSize: 13,
    fontWeight: "800",
  },
  sub: {
    ...typography.caption,
    fontSize: 10,
  },
});

