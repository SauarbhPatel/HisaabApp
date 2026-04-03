import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, ProgressBar } from '../../components/ui';
import { colors } from '../../theme';

export default function CategoryBar({ label, value, percent, color }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <AppText variant="label"    color={colors.text}>{label}</AppText>
        <AppText variant="label"    color={colors.text}>₹{value.toLocaleString()}</AppText>
      </View>
      <ProgressBar progress={percent} color={color} height={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  row:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
});
