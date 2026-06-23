import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Line, Polyline, Rect } from "react-native-svg";
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

function ClipboardIllustration({ colors }: { colors: AppColors }) {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      <Rect
        x="18"
        y="20"
        width="44"
        height="50"
        rx="6"
        stroke={colors.primary}
        strokeWidth="2.5"
        fill="none"
      />
      <Rect
        x="30"
        y="14"
        width="20"
        height="12"
        rx="4"
        stroke={colors.primary}
        strokeWidth="2.5"
        fill="none"
      />
      <Line
        x1="28"
        y1="40"
        x2="52"
        y2="40"
        stroke={colors.border}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="28"
        y1="50"
        x2="48"
        y2="50"
        stroke={colors.border}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="28"
        y1="60"
        x2="44"
        y2="60"
        stroke={colors.border}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function MagnifierIllustration({ colors }: { colors: AppColors }) {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      <Circle
        cx="34"
        cy="34"
        r="18"
        stroke={colors.primary}
        strokeWidth="2.5"
        fill="none"
      />
      <Line
        x1="47"
        y1="47"
        x2="62"
        y2="62"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="28"
        y1="34"
        x2="40"
        y2="34"
        stroke={colors.border}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="34"
        y1="28"
        x2="34"
        y2="40"
        stroke={colors.border}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CheckCircleIllustration({ colors }: { colors: AppColors }) {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      <Circle
        cx="40"
        cy="40"
        r="26"
        stroke={colors.success}
        strokeWidth="2.5"
        fill="none"
      />
      <Polyline
        points="26,40 36,52 54,30"
        stroke={colors.success}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EmptyState({
  title,
  message,
  colors,
  onAction,
  actionLabel,
}: EmptyStateProps) {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    opacity.value = withSpring(1, { damping: 15 });

    // Gentle float animation
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

  const isNoResults =
    title.toLowerCase().includes("no matching") ||
    title.toLowerCase().includes("no results");
  const isAllDone = title.toLowerCase().includes("all done");

  const Illustration = isAllDone
    ? () => <CheckCircleIllustration colors={colors} />
    : isNoResults
    ? () => <MagnifierIllustration colors={colors} />
    : () => <ClipboardIllustration colors={colors} />;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.illustrationWrap, illustrationStyle]}>
        <Illustration />
      </Animated.View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.secondary }]}>
        {message}
      </Text>
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
    ...typography.label,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  container: {
    alignItems: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  illustrationWrap: {
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
