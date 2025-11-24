import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FontProvider } from "./FontContext";
import { PrayerSchoolProvider } from "./PrayerSchoolContext";
import { NotificationProvider } from "./NotificationContext";
import { LocationProvider } from "./LocationContext";
import { ThemeProvider } from "./ThemeContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FontProvider>
          <LocationProvider>
            <PrayerSchoolProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </PrayerSchoolProvider>
          </LocationProvider>
        </FontProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};
