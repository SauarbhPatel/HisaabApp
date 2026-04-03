import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CONFIG = {
  owe:     { bg: '#FEE2E2', color: '#EF4444' },
  lent:    { bg: '#e1f5ee', color: '#1a7a5e' },
  settled: { bg: '#F3F4F6', color: '#6B7280' },
};

export default function BalanceBadge({ type, label }) {
  const cfg = CONFIG[type] || CONFIG.settled;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.text, { color: cfg.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  text: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
});
