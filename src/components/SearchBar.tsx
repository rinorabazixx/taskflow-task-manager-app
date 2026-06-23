import { Pressable, StyleSheet, TextInput, View, useColorScheme } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolateColor } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { darkColors, lightColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;
  const isFocused = useSharedValue(0);

  const handleFocus = () => {
    isFocused.value = withSpring(1, { damping: 12 });
  };

  const handleBlur = () => {
    isFocused.value = withSpring(0, { damping: 12 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        isFocused.value,
        [0, 1],
        [colors.border, colors.primary]
      ),
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        animatedStyle,
      ]}
    >
      <MaterialCommunityIcons name="magnify" size={20} color={value ? colors.primary : colors.secondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search tasks..."
        placeholderTextColor={colors.secondary}
        accessibilityRole="search"
        accessibilityLabel="Search tasks"
        style={[styles.input, { color: colors.text }]}
        returnKeyType="search"
      />
      {value ? (
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
        >
          <MaterialCommunityIcons name="close-circle" size={18} color={colors.secondary} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 50,
    paddingHorizontal: spacing.md,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: 44,
    outlineStyle: "none" as never,
  },
});
