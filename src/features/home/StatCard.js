import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../components/ui';

export default function StatCard({ value, label, sub, subColor = '#A7F3D0' }) {
  return (
    <View style={styles.card}>
      <AppText variant="amount" color="#fff" style={styles.value}>{value}</AppText>
      <AppText variant="bodySm" color="rgba(255,255,255,0.8)">{label}</AppText>
      {sub ? <AppText variant="caption" color={subColor} style={{ marginTop: 4 }}>{sub}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 12,
  },
  value: { fontSize: 20, marginBottom: 2 },
});
