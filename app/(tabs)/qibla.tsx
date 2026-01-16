import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { Magnetometer, DeviceMotion } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { CheckCircle2, Rotate3D } from "lucide-react-native";
import { GlassView } from "@/components/common/GlassView";
import { theme } from "@/theme";
import { Compass } from "@/components/features/Compass";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");
const COMPASS_SIZE = width * 0.8;

// --- Helper Logic ---
const calculateQiblaAngle = (latitude: number, longitude: number) => {
  const PI = Math.PI;
  const latK = (21.4225 * PI) / 180.0;
  const longK = (39.8264 * PI) / 180.0;
  const lat = (latitude * PI) / 180.0;
  const long = (longitude * PI) / 180.0;
  const longDiff = longK - long;

  const y = Math.sin(longDiff) * Math.cos(latK);
  const x =
    Math.cos(lat) * Math.sin(latK) -
    Math.sin(lat) * Math.cos(latK) * Math.cos(longDiff);

  return ((Math.atan2(y, x) * 180.0) / PI + 360) % 360;
};

export default function QiblaScreen() {
  const { activeTheme, isDark } = useTheme();
  // Logic State
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [heading, setHeading] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const [displayHeading, setDisplayHeading] = useState(0);

  // Tilt / Level State
  const [pitch, setPitch] = useState(0);
  const [isFlat, setIsFlat] = useState(false);
  const levelLineY = useSharedValue(0);
  const isFlatAnim = useSharedValue(0);

  useEffect(() => {
    setupLocationAndCompass();
    return () => {
      Magnetometer.removeAllListeners();
      DeviceMotion.removeAllListeners();
    };
  }, []);

  // Smooth heading filter
  useEffect(() => {
    const smoothFactor = 0.15;
    let diff = heading - displayHeading;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) > 0.5) {
      setDisplayHeading((prev) => {
        let next = prev + diff * smoothFactor;
        return (next + 360) % 360;
      });
    }
  }, [heading]);

  const setupLocationAndCompass = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);

    if (status === "granted") {
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const qibla = calculateQiblaAngle(
          loc.coords.latitude,
          loc.coords.longitude
        );
        setQiblaAngle(qibla);
      } catch (error) {
        console.warn("Error getting location for Qibla:", error);
      }
    }

    // Magnetometer Setup
    Magnetometer.setUpdateInterval(50);
    Magnetometer.addListener((data) => {
      let { x, y } = data;
      let angle = 0;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
      angle = angle - 90;
      if (angle < 0) angle += 360;
      setHeading(angle);
    });

    // Device Motion (Tilt) Setup
    DeviceMotion.setUpdateInterval(100);
    DeviceMotion.addListener((data) => {
      if (data.rotation) {
        // Beta is rotation around X-axis (Pitch) in radians
        const betaDegrees = data.rotation.beta * (180 / Math.PI);
        setPitch(betaDegrees);

        // Animate level line (5 pixels per degree)
        levelLineY.value = withSpring(betaDegrees * 5, {
          damping: 15,
          stiffness: 100,
        });

        // Flat detection (< 2 degrees)
        const flat = Math.abs(betaDegrees) < 2;
        setIsFlat(flat);
        isFlatAnim.value = withTiming(flat ? 1 : 0, { duration: 300 });
      }
    });
  };

  // Tilt Animations
  const levelLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: levelLineY.value }],
  }));

  const levelColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      isFlatAnim.value,
      [0, 1],
      [isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)", theme.colors.primary]
    );
    return {
      backgroundColor: color,
      shadowColor: color,
    };
  });

  const levelTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      isFlatAnim.value,
      [0, 1],
      [activeTheme.colors.text.secondary, theme.colors.primary]
    );
    return { color };
  });

  return (
    <View style={{ flex: 1, backgroundColor: activeTheme.colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header Section */}
      <GlassView
        intensity={20}
        tint={isDark ? "dark" : "light"}
        borderRadius={0}
        style={{
          paddingTop: 64,
          paddingBottom: 32,
          paddingHorizontal: 24,
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: activeTheme.colors.glass.border,
          backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          zIndex: 20,
        }}
      >
        <Text className="text-3xl font-bold mb-6 tracking-tight" style={{ color: activeTheme.colors.text.primary }}>
          Qibla Compass
        </Text>

        <View className="flex-row w-full justify-between px-8">
          <View className="items-center">
            <Text className="text-xs uppercase tracking-widest mb-1" style={{ color: activeTheme.colors.text.secondary }}>
              Qibla Angle
            </Text>
            <Text className="text-sky-400 text-2xl font-bold font-mono">
              {qiblaAngle.toFixed(0)}°
            </Text>
          </View>
          <View className="w-[1px] h-full bg-slate-700" style={{ backgroundColor: activeTheme.colors.glass.border }} />
          <View className="items-center">
            <Text className="text-xs uppercase tracking-widest mb-1" style={{ color: activeTheme.colors.text.secondary }}>
              Heading
            </Text>
            <Text className="text-2xl font-bold font-mono" style={{ color: activeTheme.colors.text.primary }}>
              {displayHeading.toFixed(0)}°
            </Text>
          </View>
        </View>

        {permissionStatus !== "granted" && (
          <TouchableOpacity
            onPress={setupLocationAndCompass}
            className="mt-6 bg-blue-600 px-6 py-2 rounded-full shadow-lg shadow-blue-900/50"
          >
            <Text className="text-white font-semibold">Enable Location</Text>
          </TouchableOpacity>
        )}
      </GlassView>

      {/* Compass Area with Overlaid Tilt Checker */}
      <View className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center">
        <Animated.View entering={FadeIn.delay(300).duration(1000)}>
          {/* We pass the Qibla Angle directly so the internal component can place the marker */}
          <Compass heading={displayHeading} qiblaAngle={qiblaAngle} size={COMPASS_SIZE} />
        </Animated.View>

        {/* --- TILT INDICATOR OVERLAY --- */}
        <View
          className="absolute items-center justify-center pointer-events-none"
          style={{ width: COMPASS_SIZE, height: COMPASS_SIZE }}
        >
          {/* Center Reference Circle (Glass effect) */}
          <GlassView
            intensity={30}
            tint={isDark ? "dark" : "light"}
            borderRadius={999}
            style={{
              width: 96,
              height: 96,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: activeTheme.colors.glass.border,
            }}
          >
            <View className="w-1 h-1 rounded-full" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
          </GlassView>

          {/* The Moving Horizon Line */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: COMPASS_SIZE * 0.7,
                height: 2,
                borderRadius: 2,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 8,
              },
              levelLineStyle,
              levelColorStyle,
            ]}
          />

          {/* Tilt Degree Text */}
          <Animated.View
            style={[levelLineStyle, { position: "absolute", right: 20 }]}
          >
            <Animated.Text
              style={[
                {
                  fontSize: 10,
                  fontWeight: "bold",
                  fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                },
                levelTextStyle,
              ]}
            >
              {Math.abs(Math.round(pitch))}°
            </Animated.Text>
          </Animated.View>
        </View>

        {/* Fixed Crosshair */}
        <View className="absolute items-center justify-center pointer-events-none">
          <View className="w-[1px] h-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />
          <View className="h-[1px] w-4 absolute" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />
        </View>

        {/* Bottom Status Container */}
        <View className="absolute bottom-32 w-full px-6">
          <View className="flex gap-3">
            <GlassView
              intensity={20}
              tint={isDark ? "dark" : "light"}
              borderOpacity={0}
              style={{
                flex: 1,
                backgroundColor: isFlat
                  ? "rgba(16, 185, 129, 0.1)"
                  : (isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"),
              }}
            >
              <View className="flex-row items-center justify-center w-full h-full gap-2">
                {isFlat ? (
                  <CheckCircle2 size={18} color={theme.colors.primary} />
                ) : (
                  <Rotate3D size={18} color={activeTheme.colors.text.secondary} />
                )}
                <Text
                  className="text-xs font-medium py-4"
                  style={{ color: isFlat ? theme.colors.primary : activeTheme.colors.text.secondary }}
                >
                  {isFlat ? "Perfectly Flat" : "Device Tilted"}
                </Text>
              </View>
            </GlassView>

            {/* Instruction Box */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
              }}
            >
              <Text className="text-center text-[10px]" style={{ color: activeTheme.colors.text.secondary }}>
                Align{" "}
                <Text className="font-bold" style={{ color: theme.colors.primary }}>Green Arrow</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
