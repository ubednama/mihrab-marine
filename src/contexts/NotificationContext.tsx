import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Define the shape of a Prayer object to avoid 'any'
export interface PrayerTime {
  name: string;
  time: Date;
}

interface NotificationContextType {
  notificationsEnabled: boolean;
  notificationTiming: number; // minutes before prayer
  toggleNotifications: () => Promise<void>;
  setNotificationTiming: (minutes: number) => Promise<void>;
  schedulePrayerNotifications: (prayers: PrayerTime[]) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [notificationTiming, setNotificationTimingState] = useState<number>(15);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const enabled = await AsyncStorage.getItem("notificationsEnabled");
        const timing = await AsyncStorage.getItem("notificationTiming");

        if (timing) {
          setNotificationTimingState(parseInt(timing));
        }

        if (enabled === "true") {
          // verify permissions are still granted
          const { status } = await Notifications.getPermissionsAsync();
          setNotificationsEnabled(status === "granted");
        }
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    };

    // Configure global handler
    if (Constants.appOwnership !== 'expo') {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } else {
      console.warn("Notifications are not fully supported in Expo Go. Use a development build.");
    }

    loadSettings();
  }, []);

  const toggleNotifications = async () => {
    try {
      if (notificationsEnabled) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        setNotificationsEnabled(false);
        await AsyncStorage.setItem("notificationsEnabled", "false");
      } else {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          setNotificationsEnabled(true);
          await AsyncStorage.setItem("notificationsEnabled", "true");
        } else {
          alert("Permission required to enable notifications.");
          setNotificationsEnabled(false);
        }
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }
  };

  const setNotificationTiming = async (minutes: number) => {
    setNotificationTimingState(minutes);
    await AsyncStorage.setItem("notificationTiming", minutes.toString());
  };

  const schedulePrayerNotifications = async (prayers: PrayerTime[]) => {
    if (!notificationsEnabled) return;

    try {
      // Cancel existing to avoid duplicates
      await Notifications.cancelAllScheduledNotificationsAsync();

      for (const prayer of prayers) {
        if (prayer.name === "Sunrise") continue;

        const now = new Date();
        const prayerTime = new Date(prayer.time); // Ensure it's a Date object

        // 1. Schedule "Time for Prayer" (Exact Time)
        if (prayerTime > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Time for ${prayer.name}`,
              body: `It is now time for the ${prayer.name} prayer.`,
              sound: true,
              data: { prayer: prayer.name, type: "actual" },
            },
            trigger: prayerTime as any,
          });
        }

        // 2. Schedule "Prepare for Prayer" (Before Time)
        const beforeTime = new Date(
          prayerTime.getTime() - notificationTiming * 60 * 1000
        );
        if (beforeTime > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prayer.name} is soon`,
              body: `${notificationTiming} minutes remaining until ${prayer.name}.`,
              sound: true,
              data: { prayer: prayer.name, type: "before" },
            },
            trigger: beforeTime as any,
          });
        }
      }

    } catch (error) {
      console.error("Error scheduling notifications:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        notificationTiming,
        toggleNotifications,
        setNotificationTiming,
        schedulePrayerNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
