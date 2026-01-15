import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useAppUpdates = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      if (__DEV__) {
        Alert.alert('Development Mode', 'Cannot check for updates in development mode.');
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new version of the app is available. Would you like to download and install it now?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Download',
              onPress: downloadUpdate,
            },
          ]
        );
      } else {
        Alert.alert('No Updates', 'You are using the latest version of the app.');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      Alert.alert('Error', 'Failed to check for updates. Please try again later.');
    } finally {
      setIsChecking(false);
    }
  };

  const downloadUpdate = async () => {
    try {
      setIsDownloading(true);
      await Updates.fetchUpdateAsync();
      
      Alert.alert(
        'Update Ready',
        'The update has been downloaded. The app will now reload to apply the changes.',
        [
          {
            text: 'OK',
            onPress: async () => {
              await Updates.reloadAsync();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error downloading update:', error);
      Alert.alert('Error', 'Failed to download the update.');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    checkForUpdates,
    isChecking,
    isDownloading,
    currentVersion: Updates.runtimeVersion ?? '1.0.0', // Fallback or use app.json version
    channel: Updates.channel,
  };
};
