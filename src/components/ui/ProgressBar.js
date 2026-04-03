import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function ProgressBar({ progress = 0, color = colors.primary, height = 7, style }) {
  const clamped = Math.min(Math.max(progress, 0), 100);
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
});
