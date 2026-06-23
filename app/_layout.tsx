import { Stack } from "expo-router";
import { useColorScheme, LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TaskProvider } from "@/hooks/useTasks";
import { darkColors, lightColors } from "@/constants/colors";

LogBox.ignoreLogs([
  "props.pointerEvents is deprecated",
  "Animated: `useNativeDriver` is not supported",
  "[Reanimated] Reduced motion setting is enabled"
]);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? darkColors : lightColors;

  const theme = {
    ...(isDark ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDark ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: colors.primary,
      background: colors.background,
      surface: colors.surface,
      error: colors.danger,
      onSurface: colors.text,
      secondaryContainer: colors.surfaceVariant,
      onSecondaryContainer: colors.text,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <TaskProvider>
            <Stack
              screenOptions={{
                headerShadowVisible: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: colors.background },
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.primary,
                headerTitleStyle: { color: colors.text, fontWeight: "700" },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="add" options={{ title: "New Task", headerBackTitle: "Back" }} />
              <Stack.Screen name="task/[id]" options={{ title: "Task Details", headerBackTitle: "Back" }} />
              <Stack.Screen name="edit/[id]" options={{ title: "Edit Task", headerBackTitle: "Back" }} />
            </Stack>
          </TaskProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
