import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { AppButton } from "@/components/AppButton";
import { CategoryChip } from "@/components/CategoryChip";
import { DueDatePicker } from "@/components/DueDatePicker";
import { PriorityPicker } from "@/components/PriorityPicker";
import { darkColors, lightColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";
import { useTasks } from "@/hooks/useTasks";
import { TaskCategory, TaskPriority } from "@/types/task";
import { validateTask } from "@/utils/validation";

export function AddTaskScreen() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [category, setCategory] = useState<TaskCategory | null>(null);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    const result = validateTask({ title, description, priority, dueDate, category });
    setErrors(result.errors);

    if (!result.isValid) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      addTask(result.values.title, result.values.description, priority, dueDate, category);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }, 300);
  };

  const isReady = title.trim().length > 0;

  return (
    <BackgroundGradient colors={colors}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.screen, { backgroundColor: "transparent" }]}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Title *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              mode="outlined"
              maxLength={100}
              error={Boolean(errors.title)}
              accessibilityLabel="Task title"
              outlineColor={colors.glassBorder}
              activeOutlineColor={colors.primary}
              outlineStyle={{ borderRadius: radius.md, borderWidth: 1.5 }}
              style={[styles.input, { backgroundColor: colors.glassBackground }]}
              right={<TextInput.Affix text={`${title.length}/100`} />}
              theme={{ colors: { primary: colors.primary } }}
            />
            <HelperText type="error" visible={Boolean(errors.title)}>
              {errors.title}
            </HelperText>
          </View>

          {/* Description */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details (optional)"
              mode="outlined"
              multiline
              maxLength={500}
              error={Boolean(errors.description)}
              accessibilityLabel="Task description"
              outlineColor={colors.glassBorder}
              activeOutlineColor={colors.primary}
              outlineStyle={{ borderRadius: radius.md, borderWidth: 1.5 }}
              style={[styles.description, { backgroundColor: colors.glassBackground }]}
              right={<TextInput.Affix text={`${description.length}/500`} />}
              theme={{ colors: { primary: colors.primary } }}
            />
            <HelperText type="error" visible={Boolean(errors.description)}>
              {errors.description}
            </HelperText>
          </View>

          {/* Priority */}
          <View style={styles.fieldBlock}>
            <PriorityPicker value={priority} onChange={setPriority} colors={colors} />
          </View>

          {/* Due Date */}
          <View style={styles.fieldBlock}>
            <DueDatePicker value={dueDate} onChange={setDueDate} colors={colors} />
          </View>

          {/* Category */}
          <View style={styles.fieldBlock}>
            <CategoryChip value={category} onChange={setCategory} colors={colors} />
          </View>

          {/* Submit */}
          <AppButton
            onPress={handleSubmit}
            disabled={!isReady}
            loading={loading}
            accessibilityLabel="Create task"
          >
            Create Task
          </AppButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  description: {
    minHeight: 120,
  },
  fieldBlock: {
    gap: 0,
  },
  input: {
    fontSize: 16,
  },
  screen: {
    flex: 1,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
});
