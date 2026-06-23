import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";
import { TaskFilter } from "@/types/task";

type FilterTabsProps = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
  counts: { all: number; active: number; completed: number };
};

const TABS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
];

function TabItem({
  tab,
  isActive,
  count,
  onPress,
}: {
  tab: (typeof TABS)[0];
  isActive: boolean;
  count: number;
  onPress: () => void;
}) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.93, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isActive ? colors.primary : "transparent", { duration: 180 }),
  }));

  return (
    <Pressable
      onPress={handlePress}
      style={{ flex: 1 }}
      accessibilityRole="tab"
      accessibilityLabel={`${tab.label} tasks`}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={[styles.tab, bgStyle, animatedStyle]}>
        <Text style={[styles.label, { color: isActive ? "#FFFFFF" : colors.secondary }]}>
          {tab.label}
        </Text>
        {count > 0 && (
          <View
            style={[
              styles.badge,
              { backgroundColor: isActive ? "rgba(255,255,255,0.25)" : colors.surfaceVariant },
            ]}
          >
            <Text style={[styles.badgeText, { color: isActive ? "#FFFFFF" : colors.secondary }]}>
              {count}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
      {TABS.map((tab) => (
        <TabItem
          key={tab.value}
          tab={tab}
          isActive={value === tab.value}
          count={counts[tab.value]}
          onPress={() => onChange(tab.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderRadius: radius.full,
    height: 18,
    justifyContent: "center",
    minWidth: 18,
    paddingHorizontal: 5,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: "700",
    fontSize: 10,
  },
  container: {
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 44,
    overflow: "hidden",
    padding: 3,
  },
  label: {
    ...typography.label,
    fontSize: 13,
    fontWeight: "600",
  },
  tab: {
    alignItems: "center",
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: spacing.sm,
  },
});
