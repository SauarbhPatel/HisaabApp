import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { AppText } from '../../components/ui';
import { colors, radius, shadows } from '../../theme';

export default function ActivityItem({ icon, iconBg, name, meta, amount, positive, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <AppText style={{ fontSize: 18 }}>{icon}</AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="label" color={colors.text} numberOfLines={1}>{name}</AppText>
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>{meta}</AppText>
      </View>
      <AppText variant="h4" color={positive ? colors.primary : colors.danger}>{amount}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadows.sm,
  },
  iconWrap: {
    width: 40, height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
