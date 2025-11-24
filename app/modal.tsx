import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-2xl font-bold text-white mb-8">Modal</Text>
      <View className="h-[1px] w-[80%] bg-white/10 mb-8" />
      
      <Text className="text-slate-400 text-center px-8 mb-8">
        This is a modal screen. You can put any content here.
      </Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
