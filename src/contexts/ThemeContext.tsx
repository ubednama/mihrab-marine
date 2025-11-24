import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, darkTheme, lightTheme } from '@/theme';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    activeTheme: typeof theme;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>('system');

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('themeMode');
            if (savedTheme) {
                setThemeMode(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error('Failed to load theme preference', error);
        }
    };

    const saveThemePreference = async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem('themeMode', mode);
            setThemeMode(mode);
        } catch (error) {
            console.error('Failed to save theme preference', error);
        }
    };

    const isDark =
        themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

    const activeTheme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider
            value={{
                themeMode,
                setThemeMode: saveThemePreference,
                activeTheme,
                isDark,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
