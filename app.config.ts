import { ExpoConfig, ConfigContext } from 'expo/config';
import packageJson from './package.json';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Mihrab Marine",
    slug: "mihrab-marine",
    version: packageJson.version,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mihrabmarine",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    updates: {
        fallbackToCacheTimeout: 0
    },
    splash: {
        image: "./assets/images/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#000000"
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.mihrab.marine",
        buildNumber: "4",
        infoPlist: {
            UIBackgroundModes: ["remote-notification"],
            NSUserNotificationsUsageDescription: "We need notification permission to remind you of prayer times throughout the day."
        }
    },
    android: {
        versionCode: 4,
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            monochromeImage: "./assets/images/adaptive-icon-monochrome.png",
            backgroundColor: "#000000"
        },
        package: "com.mihrab.marine",
        permissions: [
            "ACCESS_FINE_LOCATION",
            "ACCESS_COARSE_LOCATION",
            "POST_NOTIFICATIONS",
            "USE_EXACT_ALARM",
            "SCHEDULE_EXACT_ALARM"
        ],
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false
    },
    web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png"
    },
    plugins: [
        "expo-router",
        "./plugins/withAndroidSplits",
        [
            "expo-notifications",
            {
                icon: "./assets/images/notification-icon.png",
                color: "#10B981",
                mode: "production"
            }
        ]
    ],
    experiments: {
        typedRoutes: true
    }
});
