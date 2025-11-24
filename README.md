# Mihrab Marine

Mihrab Marine is a premium React Native application designed for maritime professionals and travelers, providing accurate prayer times, Qibla direction, and location-based services with a stunning glassmorphism UI.

## Features

-   **Glassmorphism Design**: A modern, sleek UI with blur effects and dynamic backgrounds.
-   **Accurate Prayer Times**: Calculates prayer times based on your location and preferred calculation method (Shafi'i/Hanafi).
-   **Qibla Compass**: Precise Qibla direction with a visual compass and tilt indicator.
-   **Location Services**: Automatically detects your location to provide relevant data.
-   **Notifications**: customizable prayer time reminders.
-   **Next Prayer Countdown**: Visual countdown to the next prayer.

## Tech Stack

-   **React Native**: Core framework.
-   **Expo**: Development platform (Expo Router, Expo Location, Expo Sensors, Expo Blur).
-   **NativeWind (Tailwind CSS)**: Styling.
-   **Reanimated**: Smooth animations.
-   **Lucide React Native**: Vector icons.
-   **Jest & React Native Testing Library**: Testing.

## Architecture

The project follows a feature-based architecture for scalability and maintainability:

```
src/
  components/
    common/       # Reusable UI components (GlassView, etc.)
    features/     # Feature-specific components (PrayerTimeCard, SkyBackground)
  constants/      # App constants
  contexts/       # React Contexts (Notification, PrayerSchool)
  hooks/          # Custom hooks
  services/       # API services
  theme/          # Design system tokens
  types/          # TypeScript definitions
  utils/          # Helper functions
app/              # Expo Router pages
```

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the App**:
    ```bash
    npm start
    ```

3.  **Run Tests**:
    ```bash
    npm test
    ```

## CI/CD

This project uses GitHub Actions for Continuous Integration. The workflow is defined in `.github/workflows/ci.yml` and runs tests on every push and pull request to the `main` branch.
