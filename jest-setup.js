jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
    scheduleNotificationAsync: jest.fn(),
    cancelAllScheduledNotificationsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
    cancelScheduledNotificationAsync: jest.fn(),
    AndroidImportance: {
        HIGH: 'high',
        DEFAULT: 'default',
    },
    AndroidNotificationPriority: {
        HIGH: 'high',
        DEFAULT: 'default',
    },
    SchedulableTriggerInputTypes: {
        DATE: 'date',
    },
    setNotificationChannelAsync: jest.fn(),
}));

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 0, longitude: 0 } })),
    reverseGeocodeAsync: jest.fn(() => Promise.resolve([])),
}));

jest.mock('expo-sensors', () => ({
    Magnetometer: {
        addListener: jest.fn(),
        removeAllListeners: jest.fn(),
        setUpdateInterval: jest.fn(),
    },
    DeviceMotion: {
        addListener: jest.fn(),
        removeAllListeners: jest.fn(),
        setUpdateInterval: jest.fn(),
    },
}));

jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(() => Promise.resolve()),
    useFonts: () => [true],
}));

jest.mock('expo-linear-gradient', () => ({
    LinearGradient: 'LinearGradient',
}));

jest.mock('expo-blur', () => ({
    BlurView: 'BlurView',
}));
