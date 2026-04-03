import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '../../theme';

export default function Card({ children, style, padding = 14 }) {
  return (
    <View style={[styles.card, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: 12,
    ...shadows.sm,
  },
});
