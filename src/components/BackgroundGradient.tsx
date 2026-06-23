import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { AppColors } from "@/constants/colors";

const { width, height } = Dimensions.get("window");

type BackgroundGradientProps = {
  colors: AppColors;
  children?: React.ReactNode;
};

export function BackgroundGradient({ colors, children }: BackgroundGradientProps) {
  // Shared values for animating 3 blobs
  const blob1X = useSharedValue(width * 0.1);
  const blob1Y = useSharedValue(height * 0.1);

  const blob2X = useSharedValue(width * 0.5);
  const blob2Y = useSharedValue(height * 0.4);

  const blob3X = useSharedValue(width * 0.2);
  const blob3Y = useSharedValue(height * 0.7);

  useEffect(() => {
    // Blob 1 animation (slow drift)
    blob1X.value = withRepeat(
      withTiming(width * 0.4, { duration: 25000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob1Y.value = withRepeat(
      withTiming(height * 0.3, { duration: 28000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Blob 2 animation
    blob2X.value = withRepeat(
      withTiming(width * 0.1, { duration: 32000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob2Y.value = withRepeat(
      withTiming(height * 0.1, { duration: 26000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Blob 3 animation
    blob3X.value = withRepeat(
      withTiming(width * 0.6, { duration: 30000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob3Y.value = withRepeat(
      withTiming(height * 0.5, { duration: 27000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedBlob1 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob1X.value }, { translateY: blob1Y.value }],
  }));

  const animatedBlob2 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob2X.value }, { translateY: blob2Y.value }],
  }));

  const animatedBlob3 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob3X.value }, { translateY: blob3Y.value }],
  }));

  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Aurora Blobs */}
      <Animated.View
        style={[
          styles.blob,
          animatedBlob1,
          {
            backgroundColor: colors.primary,
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: (width * 0.7) / 2,
            opacity: isWeb ? 0.15 : 0.08,
          },
          isWeb && ({ filter: "blur(120px)" } as any),
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          animatedBlob2,
          {
            backgroundColor: colors.accent,
            width: width * 0.8,
            height: width * 0.8,
            borderRadius: (width * 0.8) / 2,
            opacity: isWeb ? 0.12 : 0.06,
          },
          isWeb && ({ filter: "blur(140px)" } as any),
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          animatedBlob3,
          {
            backgroundColor: colors.success,
            width: width * 0.65,
            height: width * 0.65,
            borderRadius: (width * 0.65) / 2,
            opacity: isWeb ? 0.1 : 0.05,
          },
          isWeb && ({ filter: "blur(100px)" } as any),
        ]}
      />

      {/* Children Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    top: -100,
    left: -100,
  },
  content: {
    flex: 1,
  },
});
