import { ComponentProps } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { darkColors, lightColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";

type AppButtonProps = {
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline" | "danger";
  accessibilityLabel?: string;
  style?: ComponentProps<typeof View>["style"];
};

const VARIANTS = {
  primary: { bg: "#7C3AED", text: "#FFFFFF", border: "#7C3AED" },
  outline: { bg: "transparent", text: "#7C3AED", border: "#7C3AED" },
  danger: { bg: "#DC2626", text: "#FFFFFF", border: "#DC2626" },
};

export function AppButton({
  onPress,
  children,
  disabled = false,
  loading = false,
  variant = "primary",
  accessibilityLabel,
  style,
}: AppButtonProps) {
  const scale = useSharedValue(1);
  const v = VARIANTS[variant];

  // Theme-aware disabled colours — no hardcoded #9CA3AF
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? darkColors : lightColors;

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 10 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || loading }}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor:
              disabled || loading ? themeColors.surfaceVariant : v.bg,
            borderColor:
              disabled || loading ? themeColors.border : v.border,
          },
          animatedStyle,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={disabled ? themeColors.secondary : v.text}
          />
        ) : (
          <Text
            style={[
              styles.label,
              {
                color:
                  disabled || loading ? themeColors.secondary : v.text,
              },
            ]}
          >
            {children}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1.5,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.h4,
    fontWeight: "700",
  },
});
