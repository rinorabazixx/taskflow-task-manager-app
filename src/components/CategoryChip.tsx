import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AppColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";
import { CATEGORY_EMOJIS, CATEGORY_LABELS, TaskCategory } from "@/types/task";

type CategoryChipProps = {
  value: TaskCategory | null;
  onChange: (category: TaskCategory | null) => void;
  colors: AppColors;
};

const CATEGORIES = (Object.keys(CATEGORY_LABELS) as TaskCategory[]);

function CategoryItem({
  category,
  selected,
  onPress,
  colors,
}: {
  category: TaskCategory;
  selected: boolean;
  onPress: () => void;
  colors: AppColors;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.92, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    });
    onPress();
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={`Category: ${CATEGORY_LABELS[category]}`}>
      <Animated.View
        style={[
          styles.chip,
          animatedStyle,
          selected
            ? { backgroundColor: colors.primary, borderColor: colors.primary }
            : { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={styles.emoji}>{CATEGORY_EMOJIS[category]}</Text>
        <Text
          style={[
            styles.label,
            { color: selected ? "#FFFFFF" : colors.text },
          ]}
        >
          {CATEGORY_LABELS[category]}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function CategoryChip({ value, onChange, colors }: CategoryChipProps) {
  return (
    <View>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {CATEGORIES.map((cat) => (
          <CategoryItem
            key={cat}
            category={cat}
            selected={value === cat}
            onPress={() => onChange(value === cat ? null : cat)}
            colors={colors}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.xs,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    ...typography.label,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    paddingVertical: spacing.xs,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
});
