import { createElement } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";
import { formatRelativeDate } from "@/utils/date";

type DueDatePickerProps = {
  value: string | null;
  onChange: (date: string | null) => void;
  colors: AppColors;
};

export function DueDatePicker({ value, onChange, colors }: DueDatePickerProps) {
  const relative = value ? formatRelativeDate(value) : null;
  const handleClear = () => onChange(null);

  // We use a completely hidden native HTML5 date input overlaid on top of the pressable
  // This is the standard robust way to handle date picking on React Native Web
  const NativeDateInput = () =>
    createElement("input", {
      type: "date",
      value: value ? new Date(value).toISOString().split("T")[0] : "",
      onChange: (e: any) => {
        if (e.target.value) {
          onChange(new Date(e.target.value).toISOString());
        }
      },
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0,
        cursor: "pointer",
      },
    });

  return (
    <View>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Due Date</Text>
      <View
        accessibilityRole="button"
        style={[
          styles.row,
          {
            backgroundColor: colors.surface,
            borderColor: relative?.isOverdue ? colors.danger : colors.border,
            position: "relative",
            overflow: "hidden", // ensures the invisible input doesn't bleed out
          },
        ]}
      >
        <MaterialCommunityIcons
          name="calendar-outline"
          size={20}
          color={relative?.isOverdue ? colors.danger : colors.primary}
        />
        <Text
          style={[
            styles.label,
            { color: relative ? (relative.isOverdue ? colors.danger : colors.text) : colors.secondary },
          ]}
        >
          {relative ? relative.label : "Set a due date (optional)"}
        </Text>

        {value && (
          <Pressable
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel="Clear due date"
            hitSlop={8}
            style={{ zIndex: 10 }}
          >
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.secondary} />
          </Pressable>
        )}

        <NativeDateInput />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.body,
    flex: 1,
  },
  row: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
});
