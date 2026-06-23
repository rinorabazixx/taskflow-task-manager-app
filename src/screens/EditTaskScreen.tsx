import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

export function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;
  const { tasks, editTask } = useTasks();
  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState<string | null>(task?.dueDate ?? null);
  const [category, setCategory] = useState<TaskCategory | null>(task?.category ?? null);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!task) router.back();
  }, [task]);

  const handleSave = () => {
    const result = validateTask({ title, description, priority, dueDate, category });
    setErrors(result.errors);

    if (!result.isValid) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      editTask(id, {
        title: result.values.title,
        description: result.values.description,
        priority,
        dueDate,
        category,
      });
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
          <View style={styles.fieldBlock}>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Title *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Task title"
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

          <View style={styles.fieldBlock}>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add details (optional)"
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

          <View style={styles.fieldBlock}>
            <PriorityPicker value={priority} onChange={setPriority} colors={colors} />
          </View>

          <View style={styles.fieldBlock}>
            <DueDatePicker value={dueDate} onChange={setDueDate} colors={colors} />
          </View>

          <View style={styles.fieldBlock}>
            <CategoryChip value={category} onChange={setCategory} colors={colors} />
          </View>

          <View style={styles.buttonRow}>
            <AppButton
              variant="outline"
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/");
                }
              }}
              accessibilityLabel="Cancel edit"
              style={{ flex: 1 }}
            >
              Cancel
            </AppButton>
            <AppButton
              onPress={handleSave}
              disabled={!isReady}
              loading={loading}
              accessibilityLabel="Save task changes"
              style={{ flex: 1 }}
            >
              Save Changes
            </AppButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
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
