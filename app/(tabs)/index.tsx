import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFontContext } from "@/contexts/FontContext";
import { MapPin, MapPinOff } from "lucide-react-native";
import { usePrayerSchool } from "@/contexts/PrayerSchoolContext";
import { useLocationContext } from "@/contexts/LocationContext";
import Animated, {
  useSharedValue,
  withTiming,
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from "react-native-reanimated";
import { getTimeOfDay, getTimeOfDayColors, TimeOfDay } from "@/utils/timeUtils";
import { getTimeOfDayIcon } from "@/components/features/SkyBackground";
import { formatCoordinates } from "@/utils/formatUtils";
import { GlassView } from "@/components/common/GlassView";
import { PrayerTimeCard } from "@/components/features/PrayerTimeCard";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useWeather } from "@/hooks/useWeather";
import { useHijriDate } from "@/hooks/useHijriDate";
import { useNotifications } from "@/contexts/NotificationContext";

const { width } = Dimensions.get("window");
import { useTimeOfDayAnimation } from "@/hooks/useTimeOfDayAnimation";
import { useTheme } from "@/contexts/ThemeContext";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function PrayerTimesScreen() {
  const { prayerSchool, calculationMethod } = usePrayerSchool();
  const { location, city, isLoading: isLoadingLocation, detectLocation, isManual } = useLocationContext();
  const { fontsLoaded } = useFontContext();
  const { activeTheme, isDark } = useTheme();
  const { setPrayerTimes } = useNotifications();

  // Custom Hooks
  const { prayers, nextPrayer, timeUntilNext } = usePrayerTimes({ location, prayerSchool, calculationMethod });
  const { temperature, aqi } = useWeather({ location });
  const { hijriDate, gregorianDate } = useHijriDate();
  const timeOfDayProgress = useTimeOfDayAnimation();

  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<ScrollView>();
  const yPositions = useRef<{ [key: number]: number }>({});

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Auto-scroll to next prayer
  useEffect(() => {
    if (nextPrayer && prayers.length > 0) {
      const index = prayers.findIndex((p) => p.name === nextPrayer.name);
      if (index !== -1) {
        // Small delay to ensure layout is ready
        setTimeout(() => {
          const y = yPositions.current[index];
          if (y !== undefined) {
            scrollRef.current?.scrollTo({ y: y - 20, animated: true });
          }
        }, 500);
      }
    }
  }, [nextPrayer, prayers]);

  // Auto-pass prayer times to notification context for scheduling
  useEffect(() => {
    if (prayers.length > 0) {
      setPrayerTimes(prayers);
    }
  }, [prayers]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: activeTheme.colors.background }} />;

  const timeOfDay = getTimeOfDay();
  const currentGradientColors = isDark ? getTimeOfDayColors() : (['#ffffff', '#f8fafc'] as const);

  return (
    <View style={{ flex: 1, backgroundColor: activeTheme.colors.background }}>
      <LinearGradient
        colors={currentGradientColors}
        className="flex-1"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header Content */}
        <View style={{ paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, marginBottom: 20 }}>
          {/* Location & Settings Icons */}

          <Animated.View entering={FadeInDown.duration(800)} className="items-center">
            {isLoadingLocation ? (
              <ActivityIndicator color={activeTheme.colors.text.primary} size="large" />
            ) : (
              <View className="items-center w-full">
                {/* Header Info */}
                <View className="flex-row items-start justify-between w-full px-4 mb-6">
                  <View className="flex-row items-center gap-3">
                    {/* Weather & AQI Pill */}
                    {(temperature || aqi) && (
                      <GlassView
                        className="flex-row items-center gap-3 justify-center px-4 py-2"
                        intensity={20}
                        tint={isDark ? "dark" : "light"}
                        borderRadius={16}
                      >
                        {temperature && (
                          <Text
                            className="font-semibold text-lg text-center"
                            style={{
                              includeFontPadding: false,
                              textAlignVertical: "center",
                              color: activeTheme.colors.text.primary
                            }}
                          >
                            {temperature}
                          </Text>
                        )}
                        {aqi && (
                          <View className="flex-row items-center gap-1 pl-2 border-l" style={{ borderColor: activeTheme.colors.glass.border }}>
                            <Text className="text-emerald-400 font-bold text-xs">AQI</Text>
                            <Text className="font-medium text-sm" style={{ color: activeTheme.colors.text.primary }}>{aqi}</Text>
                          </View>
                        )}
                      </GlassView>
                    )}
                  </View>

                  {/* Next Prayer & Location Group */}
                  <View className="flex-row items-center gap-2">
                    {/* Next Prayer Pill */}
                    {nextPrayer && (
                      <GlassView
                        intensity={20}
                        tint={isDark ? "dark" : "light"}
                        borderRadius={16}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Text className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                          Next
                        </Text>
                        <Text className="font-bold text-lg" style={{ color: activeTheme.colors.text.primary }}>
                          {nextPrayer.name}
                        </Text>
                      </GlassView>
                    )}

                    {/* Location Pill */}
                    <TouchableOpacity
                      onPress={detectLocation}
                      activeOpacity={0.7}
                    >
                      <GlassView
                        intensity={20}
                        tint={isDark ? "dark" : "light"}
                        borderRadius={16}
                        style={{
                          padding: 10,
                          backgroundColor: !isManual
                            ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
                            : 'rgba(239,68,68,0.1)',
                        }}
                      >
                        {!isManual ? (
                          <MapPin size={22} color={activeTheme.colors.text.primary} />
                        ) : (
                          <MapPinOff size={22} color="#fca5a5" />
                        )}
                      </GlassView>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Large Icon Center */}
                <View className="items-center mb-6">
                  {getTimeOfDayIcon(timeOfDay as TimeOfDay, 64, activeTheme.colors.text.primary)}
                </View>

                {/* Location Info */}
                <View
                  className="items-center px-6 py-3 rounded-3xl border w-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                    borderColor: activeTheme.colors.glass.border
                  }}
                >
                  <Text className="text-xl font-semibold tracking-wide text-center mb-1" style={{ color: activeTheme.colors.text.primary }}>
                    {city}
                  </Text>
                  {location && (
                    <View className="bg-blue-500/20 px-2 py-0.5 rounded mb-2">
                      <Text className="font-mono text-[10px]" style={{ color: isDark ? '#bfdbfe' : '#1d4ed8' }}>
                        {formatCoordinates(
                          location.latitude,
                          location.longitude
                        )}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-light tracking-widest text-center uppercase" style={{ color: activeTheme.colors.text.secondary }}>
                      {hijriDate}
                    </Text>
                    <Text className="text-xs font-light" style={{ color: activeTheme.colors.text.muted }}>|</Text>
                    <Text className="text-xs font-light tracking-wide text-center" style={{ color: activeTheme.colors.text.secondary }}>
                      {gregorianDate}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Prayer List */}
        <AnimatedScrollView
          ref={scrollRef}
          onScroll={scrollHandler}
          style={{ flex: 1, backgroundColor: activeTheme.colors.background }}
          contentContainerStyle={{ paddingBottom: 100, gap: 3 }}
          showsVerticalScrollIndicator={false}
        >
          {prayers.length > 0 ? (
            prayers.map((prayer, index) => (
              <View
                key={index}
                onLayout={(event) => {
                  yPositions.current[index] = event.nativeEvent.layout.y;
                }}
              >
                <PrayerTimeCard
                  prayer={prayer}
                  isNext={prayer.name === nextPrayer?.name}
                  timeUntilNext={timeUntilNext}
                />
              </View>
            ))
          ) : (
            <View className="items-center mt-20 opacity-50">
              {isLoadingLocation ? (
                <Text style={{ color: activeTheme.colors.text.muted }}>Fetching prayer times...</Text>
              ) : (
                <View className="items-center gap-4">
                  <Text style={{ color: activeTheme.colors.text.muted }}>Unable to load prayer times.</Text>
                  <TouchableOpacity
                    onPress={detectLocation}
                    className="px-4 py-2 rounded-full"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                  >
                    <Text className="font-medium" style={{ color: activeTheme.colors.text.primary }}>Retry Location</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </AnimatedScrollView>
      </LinearGradient>
    </View>
  );
}
