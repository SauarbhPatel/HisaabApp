import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { AppText } from '../../components/ui';
import { colors, radius, shadows } from '../../theme';

export default function QuickActionButton({ icon, title, sub, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.85}>
      <AppText style={styles.icon}>{icon}</AppText>
      <View>
        <AppText variant="label" color={colors.text}>{title}</AppText>
        <AppText variant="caption" color={colors.textSecondary}>{sub}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadows.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  icon: { fontSize: 22 },
});
