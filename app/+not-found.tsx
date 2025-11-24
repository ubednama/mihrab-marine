import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-gray-900">
        <Text className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-blue-600 dark:text-blue-400">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}