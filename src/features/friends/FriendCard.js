import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText, Avatar, Button } from '../../components/ui';
import { colors, radius, shadows } from '../../theme';

export default function FriendCard({ friend, onPress, onSettle }) {
  const isPositive = friend.balance > 0;
  const amtColor   = isPositive ? colors.primary : colors.danger;
  const statusText = friend.owes ? `Owes you · ${friend.count} expenses` : `You owe · ${friend.count} expenses`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.top}>
        <Avatar initials={friend.initials} color={friend.color} size={44} />
        <View style={{ flex: 1 }}>
          <AppText variant="h4" color={colors.text}>{friend.name}</AppText>
          <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>{statusText}</AppText>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <AppText variant="h3" color={amtColor}>
            {isPositive ? '+' : '−'}₹{Math.abs(friend.balance).toLocaleString()}
          </AppText>
          <AppText variant="caption" color={colors.textTertiary}>{friend.count} items</AppText>
        </View>
      </View>

      <View style={styles.actions}>
        {!friend.owes
          ? <Button title="Settle Up"   variant="secondary" size="sm" style={{ flex: 1 }} onPress={() => onSettle(friend)} />
          : <Button title="Remind"      variant="secondary" size="sm" style={{ flex: 1 }} />}
        <Button title="💬 WhatsApp" variant="success"   size="sm" style={{ flex: 1 }} />
        <Button title="📞 Call"     variant="accent"    size="sm" style={{ flex: 1 }} />
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
  top:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 8 },
});
