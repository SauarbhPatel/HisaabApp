import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

export default function ProgressBar({ label, pct, color, labelRight, style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.pct, { color: color || COLORS.primary }]}>{labelRight || `${pct}%`}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color || COLORS.primary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm2, color: COLORS.text2 },
  pct: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2 },
  track: { height: 7, backgroundColor: '#F3F4F6', borderRadius: RADIUS.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: RADIUS.pill },
});
