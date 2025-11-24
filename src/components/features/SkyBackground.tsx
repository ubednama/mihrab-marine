import React from 'react';
import { View } from 'react-native';
import { Sun, Moon, CloudSun, CloudMoon } from 'lucide-react-native';
import { TimeOfDay } from '@/utils/timeUtils';

interface SkyBackgroundProps {
  timeOfDay: TimeOfDay;
  color?: string;
}

export const SkyBackground: React.FC<SkyBackgroundProps> = ({ timeOfDay, color }) => {
  return <View>{getTimeOfDayIcon(timeOfDay, 24, color)}</View>;
};

export const getTimeOfDayIcon = (timeOfDay: TimeOfDay, size = 24, color = 'black') => {
  switch (timeOfDay) {
    case 'Morning':
      return <CloudSun size={size} color={color} />;
    case 'Afternoon':
      return <Sun size={size} color={color} />;
    case 'Evening':
      return <CloudMoon size={size} color={color} />;
    case 'Night':
      return <Moon size={size} color={color} />;
    default:
      return <Sun size={size} color={color} />;
  }
};