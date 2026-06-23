import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SkeletonLine } from "@/components/SkeletonCard";
import { AppColors } from "@/constants/colors";
import { radius, spacing, typography } from "@/constants/spacing";
import {
  fetchDailyInspiration,
  fetchViewerClock,
  formatCountdown,
  getDeviceClockSnapshot,
  InspirationTodo,
  ViewerClock,
} from "@/services/api";
import {
  loadDailyInspiration,
  saveDailyInspiration,
} from "@/services/storage";

type Props = { colors: AppColors; isDark: boolean };
type LoadState = "loading" | "done" | "error";

const COUNTDOWN_TICK_MS = 1000;
const CLOCK_SYNC_MS = 5 * 60 * 1000;

function getRemainingMs(clock: ViewerClock) {
  return Math.max(clock.msUntilNextQuote - (Date.now() - clock.receivedAt), 0);
}

export function InspirationCard({ colors }: Props) {
  const [status, setStatus] = useState<LoadState>("loading");
  const [todo, setTodo] = useState<InspirationTodo | null>(null);
  const [clock, setClock] = useState(() => getDeviceClockSnapshot());
  const [countdown, setCountdown] = useState(() =>
    formatCountdown(clock.msUntilNextQuote)
  );

  const load = useCallback(async (key: string) => {
    setStatus("loading");

    const cached = await loadDailyInspiration();
    if (cached?.dateKey === key) {
      setTodo(cached.todo);
      setStatus("done");
      return;
    }

    try {
      const result = await fetchDailyInspiration(key);
      setTodo(result);
      setStatus("done");
      await saveDailyInspiration({ dateKey: key, todo: result });
    } catch {
      setStatus("error");
    }
  }, []);

  const syncClock = useCallback(async () => {
    const nextClock = await fetchViewerClock();
    setClock(nextClock);
    setCountdown(formatCountdown(nextClock.msUntilNextQuote));
  }, []);

  useEffect(() => {
    void syncClock();
  }, [syncClock]);

  useEffect(() => {
    void load(clock.dateKey);
  }, [clock.dateKey, load]);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemainingMs(clock);
      setCountdown(formatCountdown(remaining));

      if (remaining <= 0 || status === "error") {
        void syncClock();
      }
    }, COUNTDOWN_TICK_MS);

    return () => clearInterval(interval);
  }, [clock, status, syncClock]);

  useEffect(() => {
    const interval = setInterval(() => {
      void syncClock();
    }, CLOCK_SYNC_MS);

    return () => clearInterval(interval);
  }, [syncClock]);

  return (
    <View
      testID="daily-inspiration-card"
      style={[
        styles.card,
        {
          backgroundColor: colors.glassBackground,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.labelRow}>
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={14}
            color={colors.primary}
          />
          <Text style={[styles.label, { color: colors.primary }]}>Daily Drop</Text>
        </View>
        <View style={[styles.countdownPill, { backgroundColor: colors.overlay }]}>
          <Text style={[styles.countdownText, { color: colors.primary }]}>Next quote in: {countdown}</Text>
        </View>
      </View>

      {status === "loading" && (
        <View style={styles.skeletonWrap}>
          <SkeletonLine width="95%" height={13} colors={colors} />
          <View style={{ height: 6 }} />
          <SkeletonLine width="70%" height={13} colors={colors} />
        </View>
      )}

      {status === "done" && todo && (
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={[styles.todoText, { color: colors.text }]}>
            {todo.todo}
          </Text>
        </Animated.View>
      )}

      {status === "error" && (
        <View style={styles.errorWrap}>
          <Text style={[styles.errorText, { color: colors.secondary }]}>Today's drop is warming up. We'll retry automatically.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  countdownPill: {
    borderRadius: radius.full,
    flexShrink: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  countdownText: {
    ...typography.caption,
    fontWeight: "700",
    textAlign: "right",
  },
  errorText: {
    ...typography.bodyMedium,
  },
  errorWrap: {
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  label: {
    ...typography.label,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    gap: spacing.xs,
  },
  skeletonWrap: {
    paddingVertical: spacing.xs,
  },
  todoText: {
    ...typography.body,
    lineHeight: 22,
  },
});

