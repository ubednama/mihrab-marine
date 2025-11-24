import { Tabs } from 'expo-router';
import { Clock, Compass, Bell } from 'lucide-react-native';
import { View, Platform } from 'react-native';
import { GlassView } from '@/components/common/GlassView';
import { useTheme } from '@/contexts/ThemeContext';
import { theme } from '@/theme';

interface TabIconProps {
  color: string;
  size: number;
}

export default function TabLayout() {
  const { activeTheme, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 25 : 20,
          left: 40,
          right: 40,
          height: 60,
          borderRadius: 30,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent', // Let GlassView handle background
          paddingBottom: 0,
        },
        tabBarBackground: () => (
          <GlassView
            intensity={80}
            tint={isDark ? "dark" : "light"}
            borderRadius={30}
            style={{
              flex: 1,
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: activeTheme.colors.glass.border,
              borderWidth: 1,
            }}
          />
        ),
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: activeTheme.colors.text.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Prayer Times",
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <View className="items-center justify-center top-4">
              <Clock size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          title: "Qibla",
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <View className="items-center justify-center top-4">
              <Compass size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <View className="items-center justify-center top-4">
              <Bell size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
