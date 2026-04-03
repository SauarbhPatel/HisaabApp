import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '../../components/ui';
import { BalanceBadge } from '../../components/common';
import { colors, radius, shadows } from '../../theme';

export default function GroupCard({ group, onPress }) {
  const balLabel =
    group.balanceType === 'owe'     ? `You owe ₹${Math.abs(group.balance)}` :
    group.balanceType === 'lent'    ? `Owed ₹${group.balance}` :
    'All Settled ✅';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.top}>
        <View style={[styles.icon, { backgroundColor: group.iconBg }]}>
          <AppText style={{ fontSize: 20 }}>{group.icon}</AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="h4" color={colors.text}>{group.name}</AppText>
          <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
            {group.members} members · {group.expenses} expenses
          </AppText>
        </View>
      </View>
      <View style={styles.footer}>
        <AppText variant="caption" color={colors.textSecondary}>Last: {group.lastActivity}</AppText>
        <BalanceBadge type={group.balanceType} label={balLabel} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    ...shadows.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  top:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  icon:   { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
});
