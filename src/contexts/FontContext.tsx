import React, { createContext, useContext, ReactNode } from 'react';
import { useFonts } from 'expo-font';
import {
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_700Bold,
} from '@expo-google-fonts/noto-naskh-arabic';
import { ActivityIndicator, View } from 'react-native';

interface FontContextType {
  fontsLoaded: boolean;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [fontsLoaded] = useFonts({
    'NotoNaskhArabic-Regular': NotoNaskhArabic_400Regular,
    'NotoNaskhArabic-Bold': NotoNaskhArabic_700Bold,
  });

  if (!fontsLoaded) {
    // Optional: You can replace this with null if you are handling the 
    // splash screen in the root layout (recommended for Expo Router)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontContext = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFontContext must be used within a FontProvider');
  }
  return context;
};