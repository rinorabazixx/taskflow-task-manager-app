import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";
import { formatRelativeDate } from "@/utils/date";

// NOTE: This file is the native (iOS / Android) implementation.
// Metro automatically serves DueDatePicker.web.tsx on web, so this file
// never runs in a browser — no web-guard needed.

type DueDatePickerProps = {
  value: string | null;
  onChange: (date: string | null) => void;
  colors: AppColors;
};

export function DueDatePicker({ value, onChange, colors }: DueDatePickerProps) {
  const [show, setShow] = useState(false);
  const relative = value ? formatRelativeDate(value) : null;
  const handleClear = () => onChange(null);

  const handleNativeChange = (_: unknown, date?: Date) => {
    setShow(Platform.OS === "ios");
    if (date) onChange(date.toISOString());
  };

  // Safe require for native DateTimePicker
  const NativeDateTimePicker = (() => {
    if (Platform.OS === "web") return null;
    try {
      return require("@react-native-community/datetimepicker").default;
    } catch {
      return null;
    }
  })();

  return (
    <View>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Due Date</Text>

      <View
        style={[
          styles.row,
          {
            backgroundColor: colors.surface,
            borderColor: relative?.isOverdue ? colors.danger : colors.border,
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
            style={{ zIndex: 2 }}
          >
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.secondary} />
          </Pressable>
        )}

        {/* Tapping anywhere on the row opens the native date picker */}
        <Pressable
          onPress={() => setShow(true)}
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel={value ? `Due date: ${relative?.label}` : "Set due date"}
        />
      </View>

      {/* Native date picker modal */}
      {show && NativeDateTimePicker && (
        <NativeDateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={handleNativeChange}
        />
      )}
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
    overflow: "hidden",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
});
