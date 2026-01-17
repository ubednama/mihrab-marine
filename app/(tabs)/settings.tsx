import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  TextInput,
  LayoutAnimation,
  Linking,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
  MapPin,
  Info,
  Bell,
  Moon,
  ChevronRight,
  Globe,
  Smartphone,
  ChevronDown,
  Save,
  Navigation,
  RefreshCw,
} from "lucide-react-native";
import { useAppUpdates } from "@/hooks/useAppUpdates";
import Constants from "expo-constants";
import { usePrayerSchool } from "@/contexts/PrayerSchoolContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLocationContext } from "@/contexts/LocationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { CalculationMethodType } from "@/types";
import { GlassView } from "@/components/common/GlassView";
import { theme } from "@/theme";
import { CalculationMethodModal } from "@/components/settings/CalculationMethodModal";

// Reusable Setting Item Component
const SettingItem = ({
  icon,
  label,
  value,
  onPress,
  isLast,
  rightElement,
  subtitle,
  theme,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  rightElement?: React.ReactNode;
  subtitle?: string;
  theme: any;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
    className={`flex-row items-center px-4 py-4 ${!isLast ? "border-b" : ""}`}
    style={!isLast ? { borderColor: theme.colors.glass.border } : {}}
  >
    {icon && <View className="mr-4">{icon}</View>}
    <View className="flex-1">
      <Text className="text-[16px] font-medium" style={{ color: theme.colors.text.primary }}>{label}</Text>
      {subtitle && (
        <Text className="text-xs mt-0.5" style={{ color: theme.colors.text.secondary }}>{subtitle}</Text>
      )}
    </View>
    <View className="flex-row items-center">
      {value && (
        <Text className="text-[15px] mr-2" style={{ color: theme.colors.text.secondary }}>{value}</Text>
      )}
      {rightElement}
      {onPress && !rightElement && (
        <ChevronRight size={20} color={theme.colors.text.secondary} />
      )}
    </View>
  </TouchableOpacity>
);

// Section Header Component
const SectionHeader = ({ title, color }: { title: string, color: string }) => (
  <Text className="text-xs uppercase font-bold tracking-widest ml-4 mb-3 mt-8" style={{ color }}>
    {title}
  </Text>
);

export default function SettingsScreen() {
  const {
    notificationsEnabled,
    notificationTiming,
    toggleNotifications,
    setNotificationTiming,
  } = useNotifications();
  const { prayerSchool, setPrayerSchool, calculationMethod, setCalculationMethod } = usePrayerSchool();
  const { location, updateLocation, detectLocation, isLoading: isLoadingLocation, isManual } = useLocationContext();
  const { themeMode, setThemeMode, activeTheme, isDark } = useTheme();
  const { checkForUpdates, isChecking, isDownloading } = useAppUpdates();

  // Location UI State
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLong, setManualLong] = useState("");

  // Notifications UI State
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const [isCalculationModalVisible, setIsCalculationModalVisible] = useState(false);

  const toggleNotificationsAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsNotificationsExpanded(!isNotificationsExpanded);
  };

  useEffect(() => {
    if (location) {
      setManualLat(location.latitude.toString());
      setManualLong(location.longitude.toString());
    }
  }, [location]);

  const toggleLocationAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLocationExpanded(!isLocationExpanded);
  };

  const handleSaveLocation = async () => {
    const lat = parseFloat(manualLat);
    const long = parseFloat(manualLong);
    if (!isNaN(lat) && !isNaN(long)) {
      await updateLocation(lat, long);
    }
  };

  const handleUseCurrentLocation = async () => {
    await detectLocation();
  };

  return (
    <View style={{ flex: 1, backgroundColor: activeTheme.colors.background }}>
      {/* Header */}
      <GlassView
        intensity={20}
        tint={isDark ? "dark" : "light"}
        borderRadius={0}
        style={{
          paddingTop: 64,
          paddingBottom: 24,
          paddingHorizontal: 24,
          borderBottomWidth: 1,
          borderColor: activeTheme.colors.glass.border,
          backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          zIndex: 10,
        }}
      >
        <Text className="text-3xl font-bold tracking-tight" style={{ color: activeTheme.colors.text.primary }}>
          Settings
        </Text>
      </GlassView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Notifications Section */}
        <SectionHeader title="Notifications" color={activeTheme.colors.text.secondary} />
        <View className="mx-4 rounded-2xl overflow-hidden border" style={{ borderColor: activeTheme.colors.glass.border }}>
          <GlassView intensity={15} tint={isDark ? "dark" : "light"} borderRadius={0}>
            <TouchableOpacity
              onPress={toggleNotificationsAccordion}
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-4"
            >
              <View className="bg-red-500/20 p-2 rounded-lg mr-4">
                <Bell size={18} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-[16px] font-medium" style={{ color: activeTheme.colors.text.primary }}>
                  Notifications
                </Text>
                <Text className="text-xs mt-0.5" style={{ color: activeTheme.colors.text.secondary }}>
                  {notificationsEnabled ? "On" : "Off"}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{
                    false: isDark ? "#3a3a3c" : "#e2e8f0",
                    true: theme.colors.primary,
                  }}
                  thumbColor={"#ffffff"}
                />
                <ChevronDown
                  size={20}
                  color={activeTheme.colors.text.secondary}
                  style={{
                    transform: [{ rotate: isNotificationsExpanded ? "180deg" : "0deg" }],
                  }}
                />
              </View>
            </TouchableOpacity>

            {isNotificationsExpanded && (
              <View className="px-4 py-4 border-t" style={{ borderColor: activeTheme.colors.glass.border }}>
                {notificationsEnabled ? (
                  <>
                    <View className="flex-row justify-between mb-4">
                      <Text className="font-medium" style={{ color: activeTheme.colors.text.primary }}>
                        Reminder Timing
                      </Text>
                      <Text className="font-bold" style={{ color: theme.colors.primary }}>
                        {notificationTiming} min before
                      </Text>
                    </View>
                    <Slider
                      style={{ width: "100%", height: 40 }}
                      minimumValue={5}
                      maximumValue={60}
                      step={5}
                      value={notificationTiming}
                      onValueChange={setNotificationTiming}
                      minimumTrackTintColor={theme.colors.primary}
                      maximumTrackTintColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                      thumbTintColor={isDark ? "#ffffff" : theme.colors.primary}
                    />
                  </>
                ) : (
                  <Text style={{ color: activeTheme.colors.text.secondary, textAlign: 'center' }}>
                    Enable notifications to customize reminder timing.
                  </Text>
                )}
              </View>
            )}
          </GlassView>
        </View>

        {/* Appearance Section */}
        <SectionHeader title="Appearance" color={activeTheme.colors.text.secondary} />
        <View className="mx-4 rounded-2xl overflow-hidden border" style={{ borderColor: activeTheme.colors.glass.border }}>
          <GlassView intensity={15} tint={isDark ? "dark" : "light"} borderRadius={0}>
            <SettingItem
              theme={activeTheme}
              icon={
                <View className="bg-purple-500/20 p-2 rounded-lg">
                  <Moon size={18} color="#a855f7" />
                </View>
              }
              label="Theme"
              value={themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
              isLast={true}
              onPress={() => {
                const modes: ('system' | 'dark' | 'light')[] = ['system', 'dark', 'light'];
                const currentIndex = modes.indexOf(themeMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                setThemeMode(modes[nextIndex]);
              }}
              subtitle="Tap to change"
            />
          </GlassView>
        </View>

        {/* Preferences Section */}
        <SectionHeader title="Preferences" color={activeTheme.colors.text.secondary} />
        <View className="mx-4 rounded-2xl overflow-hidden border" style={{ borderColor: activeTheme.colors.glass.border }}>
          <GlassView intensity={15} tint={isDark ? "dark" : "light"} borderRadius={0}>
            <SettingItem
              theme={activeTheme}
              icon={
                <View className="bg-indigo-500/20 p-2 rounded-lg">
                  <Globe size={18} color="#818cf8" />
                </View>
              }
              label="Calculation Method"
              value={calculationMethod}
              onPress={() => {
                const methods: CalculationMethodType[] = ["MWL", "ISNA", "Egypt", "Makkah", "Karachi", "Tehran", "Singapore"];
                const currentIndex = methods.indexOf(calculationMethod);
                const nextIndex = (currentIndex + 1) % methods.length;
                setCalculationMethod(methods[nextIndex]);
              }}
              subtitle="Tap to cycle convention"
              rightElement={
                <TouchableOpacity onPress={() => setIsCalculationModalVisible(true)} className="ml-2">
                  <View className="bg-blue-500/20 p-1.5 rounded-full">
                    <Info size={14} color="#3b82f6" />
                  </View>
                </TouchableOpacity>
              }
            />

            <SettingItem
              theme={activeTheme}
              icon={
                <View className="bg-indigo-500/20 p-2 rounded-lg">
                  <Moon size={18} color="#818cf8" />
                </View>
              }
              label="Juristics Method"
              value={prayerSchool === "shafi" ? "Shafi'i (Standard)" : "Hanafi"}
              isLast={true}
              onPress={() =>
                setPrayerSchool(prayerSchool === "shafi" ? "hanafi" : "shafi")
              }
              subtitle="Asr Time Calculation"
            />
          </GlassView>
        </View>

        {/* Location Section */}
        <SectionHeader title="Location" color={activeTheme.colors.text.secondary} />
        <View className="mx-4 rounded-2xl overflow-hidden border" style={{ borderColor: activeTheme.colors.glass.border }}>
          <GlassView intensity={15} tint={isDark ? "dark" : "light"} borderRadius={0}>
            <TouchableOpacity
              onPress={toggleLocationAccordion}
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-4"
            >
              <View className="bg-blue-500/20 p-2 rounded-lg mr-4">
                <MapPin size={18} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-[16px] font-medium" style={{ color: activeTheme.colors.text.primary }}>
                  Update Location
                </Text>
                <Text className="text-xs mt-0.5" style={{ color: activeTheme.colors.text.secondary }}>
                  {isManual ? "Manual Override" : "Using GPS"}
                </Text>
              </View>
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color={activeTheme.colors.text.primary} />
              ) : (
                <ChevronDown
                  size={20}
                  color={activeTheme.colors.text.secondary}
                  style={{
                    transform: [{ rotate: isLocationExpanded ? "180deg" : "0deg" }],
                  }}
                />
              )}
            </TouchableOpacity>

            {isLocationExpanded && (
              <View className="px-4 pb-4 pt-2 border-t" style={{ borderColor: activeTheme.colors.glass.border }}>
                <TouchableOpacity
                  onPress={handleUseCurrentLocation}
                  className="flex-row items-center justify-center py-3 rounded-xl mb-4"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                >
                  <Navigation size={16} color={activeTheme.colors.text.primary} className="mr-2" />
                  <Text className="font-medium ml-2" style={{ color: activeTheme.colors.text.primary }}>
                    Use Current Location
                  </Text>
                </TouchableOpacity>

                <View className="flex-row gap-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-xs mb-1 ml-1" style={{ color: activeTheme.colors.text.secondary }}>
                      Latitude
                    </Text>
                    <TextInput
                      value={manualLat}
                      onChangeText={setManualLat}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor={activeTheme.colors.text.muted}
                      className="p-3 rounded-xl border"
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        borderColor: activeTheme.colors.glass.border,
                        color: activeTheme.colors.text.primary
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs mb-1 ml-1" style={{ color: activeTheme.colors.text.secondary }}>
                      Longitude
                    </Text>
                    <TextInput
                      value={manualLong}
                      onChangeText={setManualLong}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor={activeTheme.colors.text.muted}
                      className="p-3 rounded-xl border"
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        borderColor: activeTheme.colors.glass.border,
                        color: activeTheme.colors.text.primary
                      }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSaveLocation}
                  className="bg-emerald-500/20 border border-emerald-500/50 py-3 rounded-xl items-center flex-row justify-center"
                >
                  <Save size={16} color="#34d399" className="mr-2" />
                  <Text className="text-emerald-400 font-medium ml-2">
                    Save Coordinates
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassView>
        </View>

        {/* About Section */}
        <SectionHeader title="About" color={activeTheme.colors.text.secondary} />
        <View className="mx-4 rounded-2xl overflow-hidden border mb-10" style={{ borderColor: activeTheme.colors.glass.border }}>
          <GlassView intensity={15} tint={isDark ? "dark" : "light"} borderRadius={0}>
            {/* <SettingItem
              theme={activeTheme}
              icon={
                <View className="bg-emerald-500/20 p-2 rounded-lg">
                  <RefreshCw size={18} color="#34d399" />
                </View>
              }
              label="Check for Updates"
              onPress={checkForUpdates}
              rightElement={
                (isChecking || isDownloading) ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : undefined
              }
              subtitle={isDownloading ? "Downloading..." : "Tap to check"}
            /> */}
            <SettingItem
              theme={activeTheme}
              icon={
                <View className="bg-slate-600/20 p-2 rounded-lg">
                  <Info size={18} color="#cbd5e1" />
                </View>
              }
              label="Version"
              value={`v${Constants.expoConfig?.version} (${Platform.OS === 'android'
                ? (Constants.expoConfig?.android?.versionCode?.toString() || "1")
                : (Constants.expoConfig?.ios?.buildNumber || "1")
                })`}
              isLast={true}
            />
          </GlassView>
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://github.com/ubednama")}
          className="items-center mb-8"
        >
          <Text className="text-xs font-medium" style={{ color: activeTheme.colors.text.muted }}>
            Built by ubednama
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CalculationMethodModal
        isVisible={isCalculationModalVisible}
        onClose={() => setIsCalculationModalVisible(false)}
        activeTheme={activeTheme}
      />
    </View >
  );
}
