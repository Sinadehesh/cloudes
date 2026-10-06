import { StyleSheet, Text, View } from 'react-native';

import type { Weather } from '../core/types';
import { WEATHER_EMOJI, WEATHER_LABEL, weatherColor, useColors } from '../theme';

/** The weather a cloud tends to bring, as a coloured pill. Never shown while a question is open. */
export function WeatherBadge({ weather }: { weather: Weather }) {
  const c = useColors();
  const color = weatherColor(weather, c);
  return (
    <View style={[styles.badge, { borderColor: color }]} accessibilityLabel={`Weather: ${WEATHER_LABEL[weather]}`}>
      <Text style={[styles.label, { color }]}>
        {WEATHER_EMOJI[weather]} {WEATHER_LABEL[weather]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
});
