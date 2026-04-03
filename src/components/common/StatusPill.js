import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius } from '../../theme';

const STATUS_CONFIG = {
  active:     { bg: '#DBEAFE', color: '#1D4ED8', label: '🔵 Active' },
  completed:  { bg: '#D1FAE5', color: '#065F46', label: '✅ Completed' },
  pending:    { bg: '#FEF3C7', color: '#92400E', label: '⏳ In Progress' },
  partial:    { bg: '#FEE2E2', color: '#991B1B', label: '⚠️ Partial Pay' },
  cancelled:  { bg: '#F3F4F6', color: '#6B7280', label: '❌ Cancelled' },
};

export default function StatusPill({ status, style }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }, style]}>
      <Text style={[styles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: { fontFamily: 'Nunito_700Bold', fontSize: 10 },
});
