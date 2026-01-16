# Mihrab Marine 🕋

**Mihrab Marine** is a premium, modern Islamic prayer companion app built with **React Native** and **Expo**. It features a stunning "Pitch Black" and "Glassmorphism" aesthetic, designed to provide accurate prayer times, Qibla direction, and essential Islamic utilities with a focus on user experience and visual elegance.

## ✨ Features

- **📍 Accurate Prayer Times**: Calculates prayer times based on your location and preferred calculation method (MWL, ISNA, Egypt, etc.).
- **🧭 Advanced Qibla Compass**:
  - Smooth, animated compass with haptic feedback.
  - **Tilt Detection**: Visual and haptic guidance to ensure your device is flat for maximum accuracy.
  - **True North Correction**: Automatically adjusts for magnetic declination.
- **🎨 Premium UI/UX**:
  - **Pitch Black Theme**: Optimized for OLED screens, saving battery and looking sleek.
  - **Glassmorphism**: Modern, frosted glass elements for a depth-rich interface.
  - **Dynamic Theming**: Full support for System, Dark, and Light modes.
- **🔔 Smart Notifications**: Customizable reminders for all 5 daily prayers.
- **🌍 Location Flexibility**: Automatic GPS detection or manual city/coordinate entry.
- **📅 Hijri Calendar**: Displays the current Hijri date alongside the Gregorian date.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 52)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **State Management**: React Context API
- **Sensors**: Expo Sensors (Magnetometer, DeviceMotion)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- iOS Simulator (Mac) or Android Emulator

> **Note**: This project is optimized for both Android and iOS (via Simulator). However, the automated build pipeline currently focuses on generating Android APKs. iOS builds can be run locally for development and testing.

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/ubednama/mihrab-marine.git
    cd mihrab-marine
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run the app**:
    ```bash
    npx expo start
    ```
    - Press `i` to open in iOS Simulator.
    - Press `a` to open in Android Emulator.

## 🧪 Testing

Run the test suite to verify core logic and utilities:

```bash
npm test
```

Run type checking:

```bash
npm run type-check
```

## 📱 Screenshots

|                                                                           Home Screen                                                                            |                                                                          Qibla Compass                                                                           |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img width="346" height="765" alt="Screenshot 2025-11-25 at 4 35 36 PM" src="https://github.com/user-attachments/assets/7bd3e2fe-b0f0-4168-ac03-b04f8b86a014" /> | <img width="411" height="840" alt="Screenshot 2025-11-25 at 4 35 09 PM" src="https://github.com/user-attachments/assets/97241081-ff02-405b-81bf-0baa5b02facf" /> |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by **ubednama**
