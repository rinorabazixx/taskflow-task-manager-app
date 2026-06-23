import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AppColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";
import { TaskPriority } from "@/types/task";

type PriorityPickerProps = {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  colors: AppColors;
};

const PRIORITIES: { value: TaskPriority; label: string; emoji: string; color: string }[] = [
  { value: "high", label: "High", emoji: "🔴", color: "#DC2626" },
  { value: "medium", label: "Medium", emoji: "🟡", color: "#F59E0B" },
  { value: "low", label: "Low", emoji: "🟢", color: "#10B981" },
];

function PriorityItem({
  item,
  selected,
  onPress,
  colors,
}: {
  item: (typeof PRIORITIES)[0];
  selected: boolean;
  onPress: () => void;
  colors: AppColors;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    });
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{ flex: 1 }}
      accessibilityRole="button"
      accessibilityLabel={`Priority: ${item.label}`}
      accessibilityState={{ selected }}
    >
      <Animated.View
        style={[
          styles.pill,
          animatedStyle,
          selected
            ? {
                backgroundColor: item.color + "20",
                borderColor: item.color,
              }
            : { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text
          style={[
            styles.label,
            { color: selected ? item.color : colors.secondary },
          ]}
        >
          {item.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function PriorityPicker({ value, onChange, colors }: PriorityPickerProps) {
  return (
    <View>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Priority</Text>
      <View style={styles.row}>
        {PRIORITIES.map((item) => (
          <PriorityItem
            key={item.value}
            item={item}
            selected={value === item.value}
            onPress={() => onChange(item.value)}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 14,
  },
  label: {
    ...typography.label,
    fontSize: 13,
  },
  pill: {
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
});
