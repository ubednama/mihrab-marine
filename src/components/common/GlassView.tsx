import React from "react";
import { View, Platform, ViewProps, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

interface GlassViewProps extends ViewProps {
  intensity?: number;
  tint?: "light" | "dark" | "default" | "prominent" | "systemThinMaterial" | "systemMaterial" | "systemThickMaterial" | "systemChromeMaterial" | "systemUltraThinMaterial" | "systemThinMaterialLight" | "systemMaterialLight" | "systemThickMaterialLight" | "systemChromeMaterialLight" | "systemUltraThinMaterialLight" | "systemThinMaterialDark" | "systemMaterialDark" | "systemThickMaterialDark" | "systemChromeMaterialDark" | "systemUltraThinMaterialDark";
  borderRadius?: number;
  borderOpacity?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({
  children,
  style,
  intensity = 50,
  tint = "dark",
  borderRadius = 20,
  borderOpacity = 0.1,
  ...props
}) => {
  const isAndroid = Platform.OS === "android";

  if (isAndroid) {
    // Android Fallback: Semi-transparent background with border
    return (
      <View
        style={[
          styles.androidContainer,
          {
            borderRadius,
            backgroundColor: tint === "dark" ? "rgba(20, 20, 25, 0.85)" : "rgba(255, 255, 255, 0.85)",
            borderColor: tint === "dark" ? `rgba(255, 255, 255, ${borderOpacity})` : `rgba(0, 0, 0, ${borderOpacity})`,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  // iOS: Real Blur
  return (
    <View
      style={[
        styles.iosContainer,
        {
          borderRadius,
          borderColor: tint === "dark" ? `rgba(255, 255, 255, ${borderOpacity})` : `rgba(0, 0, 0, ${borderOpacity})`,
        },
        style,
      ]}
      {...props}
    >
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  androidContainer: {
    overflow: "hidden",
    borderWidth: 1,
  },
  iosContainer: {
    overflow: "hidden",
    borderWidth: 1,
    backgroundColor: "transparent", // Important for BlurView
  },
  contentContainer: {
    zIndex: 1,
  },
});
