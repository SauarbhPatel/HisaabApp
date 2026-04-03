import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../components/ui';
import { colors, radius, shadows } from '../../theme';

function BarGroup({ heights, highlightIdx }) {
  return (
    <View style={styles.bars}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: h, backgroundColor: i === highlightIdx ? colors.primary : colors.primaryUltraLight },
          ]}
        />
      ))}
    </View>
  );
}

export default function MiniChart({ value, label, color, heights, highlightIdx }) {
  return (
    <View style={styles.card}>
      <BarGroup heights={heights} highlightIdx={highlightIdx} />
      <AppText variant="label" color={color} style={styles.value}>{value}</AppText>
      <AppText variant="caption" color={colors.textSecondary}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: 'center',
    ...shadows.sm,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 24,
    marginBottom: 4,
  },
  bar: { width: 5, borderRadius: 3 },
  value: { fontSize: 14, marginBottom: 1 },
});
