import { Link, Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Compass, Home } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { GlassView } from "@/components/common/GlassView";
import { LinearGradient } from "expo-linear-gradient";

export default function NotFoundScreen() {
  const { activeTheme, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: activeTheme.colors.background }}>
      <Stack.Screen options={{ title: "Lost at Sea?", headerShown: false }} />

      {/* Background Gradient Effect */}
      <LinearGradient
        colors={isDark
          ? [activeTheme.colors.background, activeTheme.colors.primary + '20']
          : [activeTheme.colors.background, activeTheme.colors.primary + '10']}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View className="flex-1 items-center justify-center p-6">
        <GlassView
          intensity={20}
          tint={isDark ? "dark" : "light"}
          style={{ width: '100%', padding: 32, alignItems: 'center' }}
        >
          {/* Icon */}
          <View
            className="mb-6 p-6 rounded-full"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              borderColor: activeTheme.colors.glass.border,
              borderWidth: 1
            }}
          >
            <Compass
              size={64}
              color={activeTheme.colors.primary}
              strokeWidth={1.5}
            />
          </View>

          {/* Text Content */}
          <Text
            className="text-2xl font-bold mb-2 text-center"
            style={{ color: activeTheme.colors.text.primary }}
          >
            Lost at Sea?
          </Text>

          <Text
            className="text-center mb-8 text-base leading-6"
            style={{ color: activeTheme.colors.text.secondary }}
          >
            The coordinates you're looking for don't exist on our map.
          </Text>

          {/* Action Button */}
          <Link href="/" asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row items-center justify-center px-6 py-3.5 rounded-xl border w-full"
              style={{
                backgroundColor: activeTheme.colors.primary + '15',
                borderColor: activeTheme.colors.primary + '40',
              }}
            >
              <Home size={18} color={activeTheme.colors.primary} className="mr-2.5" />
              <Text
                className="font-semibold text-base"
                style={{ color: activeTheme.colors.primary }}
              >
                Return to Home
              </Text>
            </TouchableOpacity>
          </Link>
        </GlassView>
      </View>
    </View>
  );
}