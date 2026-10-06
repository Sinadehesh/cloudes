import { Platform, useColorScheme } from 'react-native';

import type { Weather, CloudCategory } from './core/types';

const light = {
  background: '#EEF4FA',
  surface: '#FFFFFF',
  surfaceMuted: '#E1EAF3',
  text: '#17293D',
  textMuted: '#5B6B7D',
  border: '#D3DEEA',
  primary: '#2F6FA8',
  onPrimary: '#FFFFFF',
  accent: '#E8914A',
  success: '#2E7D5B',
  warning: '#B26B12',
  danger: '#B8403A',
  overlay: 'rgba(10, 20, 35, 0.72)',
};

const dark: typeof light = {
  background: '#0E1621',
  surface: '#16212F',
  surfaceMuted: '#1E2B3B',
  text: '#E6EEF7',
  textMuted: '#96A6B8',
  border: '#2A3949',
  primary: '#8EC1F0',
  onPrimary: '#0B1C2D',
  accent: '#F5B97A',
  success: '#7FD3A8',
  warning: '#F0B35C',
  danger: '#F08A80',
  overlay: 'rgba(0, 0, 0, 0.78)',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

export const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, "Times New Roman", serif',
});

export const CATEGORY_EMOJI: Record<CloudCategory, string> = { main: '☁️', species: '🌥️', special: '🌈' };
export const CATEGORY_LABEL: Record<CloudCategory, string> = {
  main: 'The 10 main types',
  species: 'Species & varieties',
  special: 'Special & rare',
};

export const WEATHER_EMOJI: Record<Weather, string> = {
  fair: '☀️',
  change: '🌤️',
  rain: '🌧️',
  storm: '⛈️',
  hazard: '⚠️',
};

export const WEATHER_LABEL: Record<Weather, string> = {
  fair: 'Fair weather',
  change: 'Weather may change',
  rain: 'Rain or snow',
  storm: 'Thunderstorms',
  hazard: 'Dangerous weather',
};

export function weatherColor(weather: Weather, c: Colors): string {
  switch (weather) {
    case 'fair':
      return c.success;
    case 'change':
      return c.textMuted;
    case 'rain':
      return c.primary;
    case 'storm':
      return c.warning;
    case 'hazard':
      return c.danger;
  }
}
