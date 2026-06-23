import { Platform, TextStyle } from "react-native";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const shadow = {
  sm: Platform.select({
    ios: {
      shadowColor: "#7C3AED",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#7C3AED",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: "#7C3AED",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
    default: {},
  }),
};

export const font = {
  regular: Platform.select({ ios: "Poppins-Regular", android: "Poppins-Regular", default: "System" }),
  medium: Platform.select({ ios: "Poppins-Medium", android: "Poppins-Medium", default: "System" }),
  semiBold: Platform.select({ ios: "Poppins-SemiBold", android: "Poppins-SemiBold", default: "System" }),
  bold: Platform.select({ ios: "Poppins-Bold", android: "Poppins-Bold", default: "System" }),
  interRegular: Platform.select({ ios: "Inter-Regular", android: "Inter-Regular", default: "System" }),
  interMedium: Platform.select({ ios: "Inter-Medium", android: "Inter-Medium", default: "System" }),
};

export const typography = {
  h1: { fontSize: 32, lineHeight: 40, fontFamily: font.bold, letterSpacing: -0.5 } as TextStyle,
  h2: { fontSize: 24, lineHeight: 32, fontFamily: font.bold, letterSpacing: -0.3 } as TextStyle,
  h3: { fontSize: 20, lineHeight: 28, fontFamily: font.semiBold, letterSpacing: -0.2 } as TextStyle,
  h4: { fontSize: 16, lineHeight: 24, fontFamily: font.semiBold } as TextStyle,
  body: { fontSize: 15, lineHeight: 22, fontFamily: font.interRegular } as TextStyle,
  bodyMedium: { fontSize: 14, lineHeight: 20, fontFamily: font.interMedium } as TextStyle,
  label: { fontSize: 12, lineHeight: 16, fontFamily: font.interMedium, letterSpacing: 0.3 } as TextStyle,
  caption: { fontSize: 11, lineHeight: 14, fontFamily: font.interRegular } as TextStyle,
};
