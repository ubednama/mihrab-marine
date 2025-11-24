import React, { memo } from "react";
import { View, Text } from "react-native";
import Animated, {
    useAnimatedStyle,
    withTiming,
    FadeInDown,
} from "react-native-reanimated";
import { GlassView } from "@/components/common/GlassView";
import { theme } from "@/theme";
import { PrayerTime } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";

interface PrayerTimeCardProps {
    prayer: PrayerTime;
    isNext: boolean;
    timeUntilNext?: string;
}

export const PrayerTimeCard = memo(
    ({ prayer, isNext, timeUntilNext }: PrayerTimeCardProps) => {
        const { activeTheme, isDark } = useTheme();

        // Separate animated style for scale transform
        const scaleStyle = useAnimatedStyle(() => ({
            transform: [{ scale: withTiming(isNext ? 1.01 : 1, { duration: 300 }) }],
        }));

        return (
            // Outer view handles layout animation (entering)
            <Animated.View
                entering={FadeInDown.delay(100).springify()}
                className="mx-4 mb-3"
            >
                {/* Inner view handles transform animation (scale) to avoid conflict */}
                <Animated.View style={scaleStyle}>
                    <GlassView
                        intensity={isNext ? 40 : 20}
                        tint={isDark ? "dark" : "light"}
                        borderRadius={20}
                        borderOpacity={isNext ? 0.3 : 0.1}
                        style={{
                            padding: 16,
                            flexDirection: "column",
                            gap: 12,
                            backgroundColor: isNext
                                ? "rgba(16, 185, 129, 0.15)"
                                : (isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.4)"),
                            borderColor: isNext
                                ? theme.colors.primary
                                : activeTheme.colors.glass.border,
                            borderWidth: 1,
                        }}
                    >
                        <View className="flex-row justify-between items-center w-full">
                            <View className="flex-row items-center gap-4">
                                <View
                                    className={`w-1.5 h-12 rounded-full ${isNext ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : ""}`}
                                    style={!isNext ? { backgroundColor: isDark ? '#475569' : '#cbd5e1' } : {}}
                                />
                                <View>
                                    <Text
                                        className={`${isNext
                                            ? "font-bold"
                                            : "font-bold"
                                            } text-lg`}
                                        style={{ color: isNext ? theme.colors.primary : activeTheme.colors.text.primary }}
                                    >
                                        {prayer.name}
                                    </Text>
                                    <Text
                                        className="text-xs font-light tracking-wider uppercase opacity-70"
                                        style={{ color: isNext ? theme.colors.primary : activeTheme.colors.text.secondary }}
                                    >
                                        {prayer.arabicName}
                                    </Text>
                                </View>
                            </View>

                            <View className="items-end justify-center">
                                {isNext && timeUntilNext && (
                                    <View
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            marginBottom: 4,
                                            borderColor: theme.colors.primary,
                                            borderWidth: 1,
                                            borderRadius: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text
                                            className="text-xs font-bold tracking-wide text-center uppercase"
                                            style={{ color: theme.colors.primary }}
                                        >
                                            in {timeUntilNext}
                                        </Text>
                                    </View>
                                )}
                                <Text
                                    className="text-3xl font-light tracking-tight"
                                    style={{ color: isNext ? theme.colors.primary : activeTheme.colors.text.primary }}
                                >
                                    {prayer.time.toLocaleTimeString([], {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Text>
                            </View>
                        </View>
                    </GlassView>
                </Animated.View>
            </Animated.View>
        );
    }
);
