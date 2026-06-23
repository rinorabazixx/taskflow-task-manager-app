import React, { useEffect } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "@/constants/colors";

const { width, height } = Dimensions.get("window");

type BackgroundGradientProps = {
  colors: AppColors;
  children?: React.ReactNode;
};

export function BackgroundGradient({
  colors,
  children,
}: BackgroundGradientProps) {
  const blob1X = useSharedValue(width * 0.1);
  const blob1Y = useSharedValue(height * 0.1);
  const blob2X = useSharedValue(width * 0.5);
  const blob2Y = useSharedValue(height * 0.4);
  const blob3X = useSharedValue(width * 0.2);
  const blob3Y = useSharedValue(height * 0.7);

  useEffect(() => {
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
  const blobSize1 = width * 0.7;
  const blobSize2 = width * 0.8;
  const blobSize3 = width * 0.65;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Blob 1 — primary purple */}
      <Animated.View
        style={[
          styles.blob,
          { width: blobSize1, height: blobSize1, borderRadius: blobSize1 / 2 },
          animatedBlob1,
        ]}
      >
        {isWeb ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.primary,
                borderRadius: blobSize1 / 2,
                opacity: 0.15,
                ...(({ filter: "blur(120px)" }) as any),
              },
            ]}
          />
        ) : (
          <LinearGradient
            colors={[colors.primary + "28", colors.primary + "10", "transparent"]}
            style={[StyleSheet.absoluteFill, { borderRadius: blobSize1 / 2 }]}
          />
        )}
      </Animated.View>

      {/* Blob 2 — accent amber */}
      <Animated.View
        style={[
          styles.blob,
          { width: blobSize2, height: blobSize2, borderRadius: blobSize2 / 2 },
          animatedBlob2,
        ]}
      >
        {isWeb ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.accent,
                borderRadius: blobSize2 / 2,
                opacity: 0.12,
                ...(({ filter: "blur(140px)" }) as any),
              },
            ]}
          />
        ) : (
          <LinearGradient
            colors={[colors.accent + "28", colors.accent + "10", "transparent"]}
            style={[StyleSheet.absoluteFill, { borderRadius: blobSize2 / 2 }]}
          />
        )}
      </Animated.View>

      {/* Blob 3 — success green */}
      <Animated.View
        style={[
          styles.blob,
          { width: blobSize3, height: blobSize3, borderRadius: blobSize3 / 2 },
          animatedBlob3,
        ]}
      >
        {isWeb ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.success,
                borderRadius: blobSize3 / 2,
                opacity: 0.1,
                ...(({ filter: "blur(100px)" }) as any),
              },
            ]}
          />
        ) : (
          <LinearGradient
            colors={[colors.success + "28", colors.success + "10", "transparent"]}
            style={[StyleSheet.absoluteFill, { borderRadius: blobSize3 / 2 }]}
          />
        )}
      </Animated.View>

      {/* Screen content sits on top */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    left: -100,
    overflow: "hidden",
    position: "absolute",
    top: -100,
  },
  container: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
});

