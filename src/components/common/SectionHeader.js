import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../ui';
import { colors } from '../../theme';

export default function SectionHeader({ title, action, actionLabel, style }) {
  return (
    <View style={[styles.row, style]}>
      <AppText variant="sectionHeader" color={colors.textSecondary}>{title}</AppText>
      {action && actionLabel
        ? <AppText variant="labelSm" color={colors.primary} onPress={action}>{actionLabel}</AppText>
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
