import { withTiming } from 'react-native-reanimated';

// Time of day gradient colors
export const THEME_COLORS = {
  morning: ["#000000", "#020617"] as const,
  afternoon: ["#000000", "#0f172a"] as const,
  evening: ["#000000", "#020617"] as const,
  night: ["#000000", "#000000"] as const,
  text: {
    primary: "#f8fafc",
    secondary: "#94a3b8",
    accent: "#10b981", // emerald-500
    accentDark: "#059669", // emerald-600
    muted: "#64748b", // slate-500
  }
};

// Time of day types
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Morning" as TimeOfDay;
  }
  
  if (hour >= 12 && hour < 17) {
    return "Afternoon" as TimeOfDay;
  }
  
  if (hour >= 17 && hour < 20) {
    return "Evening" as TimeOfDay;
  }
  
  return "Night" as TimeOfDay;
};

export const getTimeOfDayColors = () => {
  const timeOfDay = getTimeOfDay();
  
  switch (timeOfDay) {
    case "Morning":
      return THEME_COLORS.morning;
    case "Afternoon":
      return THEME_COLORS.afternoon;
    case "Evening":
      return THEME_COLORS.evening;
    case "Night":
    default:
      return THEME_COLORS.night;
  }
};