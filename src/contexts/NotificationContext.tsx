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
  setPrayerTimes: (prayers: PrayerTime[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [notificationTiming, setNotificationTimingState] = useState<number>(15);
  const [prayerTimes, setPrayerTimesState] = useState<PrayerTime[]>([]);

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

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('prayer-notifications', {
        name: 'Prayer Notifications',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      Notifications.setNotificationChannelAsync('prayer-reminders', {
        name: 'Prayer Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    loadSettings();
  }, []);

  // Auto-schedule when prayers change or notifications are enabled
  useEffect(() => {
    const autoSchedule = async () => {
      if (notificationsEnabled && prayerTimes.length > 0) {
        // Check if we need to reschedule (new day)
        const lastScheduledDate = await AsyncStorage.getItem('lastScheduledDate');
        const today = new Date().toDateString();

        if (lastScheduledDate !== today) {
          await schedulePrayerNotifications(prayerTimes);
          await AsyncStorage.setItem('lastScheduledDate', today);
        }
      }
    };

    autoSchedule();
  }, [notificationsEnabled, prayerTimes]);

  // Daily re-scheduling at midnight
  useEffect(() => {
    const scheduleNextDayRefresh = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 1, 0); // 1 second after midnight

      const timeUntilMidnight = tomorrow.getTime() - now.getTime();

      const timer = setTimeout(async () => {
        if (notificationsEnabled && prayerTimes.length > 0) {
          await schedulePrayerNotifications(prayerTimes);
          await AsyncStorage.setItem('lastScheduledDate', new Date().toDateString());
        }
        scheduleNextDayRefresh(); // Schedule for next day
      }, timeUntilMidnight);

      return timer;
    };

    const timer = scheduleNextDayRefresh();
    return () => clearTimeout(timer);
  }, [notificationsEnabled, prayerTimes]);

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
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: prayerTime,
              channelId: Platform.OS === 'android' ? 'prayer-notifications' : undefined,
            },
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
              priority: Notifications.AndroidNotificationPriority.DEFAULT,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: beforeTime,
              channelId: Platform.OS === 'android' ? 'prayer-reminders' : undefined,
            },
          });
        }
      }

    } catch (error) {
      console.error("Error scheduling notifications:", error);
    }
  };

  const setPrayerTimes = (prayers: PrayerTime[]) => {
    setPrayerTimesState(prayers);
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        notificationTiming,
        toggleNotifications,
        setNotificationTiming,
        schedulePrayerNotifications,
        setPrayerTimes,
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
