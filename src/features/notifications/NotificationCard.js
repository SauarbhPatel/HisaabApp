import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText, Button } from '../../components/ui';
import { colors, radius, shadows } from '../../theme';

export default function NotificationCard({ notif }) {
  return (
    <View style={[
      styles.card,
      notif.borderColor ? { borderLeftWidth: 4, borderLeftColor: notif.borderColor } : null,
      notif.read ? { opacity: 0.82 } : null,
    ]}>
      <View style={[styles.icon, { backgroundColor: notif.iconBg }]}>
        <AppText style={{ fontSize: 18 }}>{notif.icon}</AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="label"   color={colors.text}>{notif.title}</AppText>
        <AppText variant="bodySm"  color={colors.textSecondary} style={styles.body}>{notif.body}</AppText>
        {notif.actions?.length > 0 && (
          <View style={styles.actions}>
            {notif.actions.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.actionBtn, { backgroundColor: a.bg, flex: notif.actions.length === 1 ? undefined : 1 }]}
              >
                <AppText variant="labelSm" color={a.color}>{a.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <AppText variant="caption" color={colors.textTertiary} style={styles.time}>{notif.time}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  icon:      { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  body:      { marginTop: 3, lineHeight: 18 },
  actions:   { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, alignItems: 'center' },
  time:      { flexShrink: 0 },
});
