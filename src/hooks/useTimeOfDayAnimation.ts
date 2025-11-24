import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export const useTimeOfDayAnimation = () => {
  const timeOfDayProgress = useSharedValue(0);

  useEffect(() => {
    const hour = new Date().getHours();
    let targetValue = 3; // Night default

    if (hour >= 5 && hour < 12) targetValue = 0; // Morning
    else if (hour >= 12 && hour < 17) targetValue = 1; // Afternoon
    else if (hour >= 17 && hour < 20) targetValue = 2; // Evening

    timeOfDayProgress.value = withTiming(targetValue, { duration: 1000 });
  }, []);

  return timeOfDayProgress;
};
