import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '../../components/ui';
import { colors, radius } from '../../theme';

export default function ExpenseCategoryRow({ item, onPress, borderBottom = true }) {
  return (
    <TouchableOpacity
      style={[styles.row, borderBottom && styles.bordered]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.icon, { backgroundColor: item.iconBg }]}>
        <AppText style={{ fontSize: 18 }}>{item.icon}</AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="label" color={colors.text}>{item.category}</AppText>
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
          {item.count} entries
        </AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText variant="h4" color={colors.danger}>₹{item.amount.toLocaleString()}</AppText>
        <AppText variant="caption" color={colors.textTertiary}>›</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    width: 40, height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
