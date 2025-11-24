import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PrayerTime } from '@/types';

// Configure notification behavior
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (error) {
  console.warn('Notifications configuration failed:', error);
}

export interface NotificationSettings {
  enabled: boolean;
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  reminderMinutes: number;
  sound: boolean;
}

export const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  prayers: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  reminderMinutes: 10,
  sound: true,
};

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-notifications', {
        name: 'Prayer Times',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10B981',
        sound: 'default',
        description: 'Notifications for Islamic prayer times',
      });
      
      await Notifications.setNotificationChannelAsync('prayer-reminders', {
        name: 'Prayer Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10B981',
        sound: 'default',
        description: 'Reminder notifications for Islamic prayer times',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Cancel all scheduled prayer notifications
export const cancelAllPrayerNotifications = async (): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const prayerNotifications = scheduledNotifications.filter(
      notification => notification.identifier.startsWith('prayer-')
    );

    for (const notification of prayerNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  } catch (error) {
    console.error('Error canceling prayer notifications:', error);
  }
};

// Schedule prayer time notifications
export const schedulePrayerNotifications = async (
  prayers: PrayerTime[],
  settings: NotificationSettings
) => {
  try {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!settings.enabled) return;

    const now = new Date();
    const today = now.toDateString();

    for (const prayer of prayers) {
      const prayerKey = prayer.name.toLowerCase() as keyof typeof settings.prayers;
      if (!settings.prayers[prayerKey]) continue;

      const prayerTime = new Date(`${today} ${prayer.time}`);
      
      // Skip if prayer time has already passed today
      if (prayerTime <= now) continue;

      // Schedule main notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.name} Prayer Time`,
          body: `It's time for ${prayer.name} prayer (${prayer.time})`,
          sound: settings.sound ? 'default' : false,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: prayerTime,
          channelId: Platform.OS === 'android' ? 'prayer-notifications' : undefined,
        },
      });

      // Schedule reminder if enabled
      if (settings.reminderMinutes > 0) {
        const reminderTime = new Date(prayerTime.getTime() - settings.reminderMinutes * 60000);
        
        if (reminderTime > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prayer.name} Prayer Reminder`,
              body: `${prayer.name} prayer is in ${settings.reminderMinutes} minutes`,
              sound: settings.sound ? 'default' : false,
              priority: Notifications.AndroidNotificationPriority.DEFAULT,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: reminderTime,
              channelId: Platform.OS === 'android' ? 'prayer-reminders' : undefined,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error('Error scheduling prayer notifications:', error);
  }
};

// Get next prayer time for immediate notification display
export const getNextPrayer = (prayers: PrayerTime[]): PrayerTime | null => {
  const now = new Date();
  
  // Filter out sunrise and find next prayer
  const prayerTimes = prayers.filter(prayer => prayer.name !== 'Sunrise');
  
  for (const prayer of prayerTimes) {
    if (prayer.time > now) {
      return prayer;
    }
  }
  
  // If no prayer today, return first prayer of tomorrow (Fajr)
  return prayerTimes[0] || null;
};

// Calculate time remaining until next prayer
export const getTimeUntilNextPrayer = (nextPrayer: PrayerTime | null): string => {
  if (!nextPrayer) return '';
  
  const now = new Date();
  const timeDiff = nextPrayer.time.getTime() - now.getTime();
  
  if (timeDiff <= 0) return '';
  
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Format prayer time for display
export const formatPrayerTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};