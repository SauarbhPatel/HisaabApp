import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { FRIENDS } from '../../data/mockData';

const DATE_GROUPS = ['March 2026', 'February 2026'];

export default function FriendDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { friendId } = route.params || {};
  const friend = FRIENDS.find((f) => f.id === friendId) || FRIENDS[0];

  const isOwed = friend.amount >= 0;
  const absAmt = Math.abs(friend.amount);

  const txByMonth = DATE_GROUPS.map((month) => ({
    month,
    txs: friend.transactions || [],
  })).filter((g) => g.txs.length > 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={COLORS.gradientGreen}
        start={{ x: 0.13, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={[styles.avatar, { backgroundColor: friend.color }]}>
            <Text style={styles.avatarText}>{friend.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <Text style={styles.friendPhone}>{friend.phone}</Text>
          </View>
          <View style={styles.contactBtns}>
            <TouchableOpacity style={styles.contactBtn}><Text>📞</Text></TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}><Text>💬</Text></TouchableOpacity>
          </View>
        </View>

        {/* Net balance box */}
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLbl}>
            {isOwed ? `${friend.name.split(' ')[0]} owes you` : 'You owe'}
          </Text>
          <Text style={styles.balanceAmt}>₹{absAmt.toLocaleString('en-IN')}</Text>
          <Text style={styles.balanceSub}>
            {isOwed ? `${friend.name.split(' ')[0]} owes you this amount` : `You owe this amount`}
          </Text>
        </View>
      </LinearGradient>

      {/* Transaction list */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {(friend.transactions || []).length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          )}

          {/* Show all transactions with month separators */}
          {(() => {
            const allTx = friend.transactions || [];
            let lastMonth = '';
            return allTx.map((tx, i) => {
              const month = tx.date?.split(' ')?.slice(1)?.join(' ') || 'March 2026';
              const showHeader = month !== lastMonth;
              lastMonth = month;
              return (
                <View key={tx.id || i}>
                  {showHeader && (
                    <Text style={styles.dateHeader}>{month}</Text>
                  )}
                  <View style={styles.txCard}>
                    <View style={[
                      styles.txDot,
                      { backgroundColor: tx.type === 'gave' ? '#FEE2E2' : '#D1FAE5' }
                    ]}>
                      <Text style={styles.txArrow}>{tx.type === 'gave' ? '↑' : '↓'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.txLabel}>
                        {tx.type === 'gave' ? 'You gave' : 'You received'}
                      </Text>
                      <Text style={styles.txMeta}>{tx.label} · {tx.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[
                        styles.txAmt,
                        { color: tx.type === 'gave' ? COLORS.danger : COLORS.primary }
                      ]}>
                        {tx.type === 'gave' ? '−' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.txMethod}>
                        {tx.method === 'UPI' ? '📱 UPI' : tx.method === 'Cash' ? '💵 Cash' : `🏦 ${tx.method}`}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            });
          })()}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.gaveBtn}
          onPress={() => navigation.navigate('GiveMoney', { friendId: friend.id })}
          activeOpacity={0.85}
        >
          <Text style={styles.gaveBtnText}>↑ You Gave</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.receivedBtn}
          onPress={() => navigation.navigate('GetMoney', { friendId: friend.id })}
          activeOpacity={0.85}
        >
          <Text style={styles.receivedBtnText}>↓ You Received</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 20 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: FONTS.nunito.black, fontSize: 22, color: '#fff' },
  friendName: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  friendPhone: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  contactBtns: { flexDirection: 'row', gap: 8 },
  contactBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  balanceBox: {
    backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 14,
    padding: 14, marginTop: 14, alignItems: 'center',
  },
  balanceLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  balanceAmt: { fontFamily: FONTS.nunito.black, fontSize: 30, color: '#fff', letterSpacing: -1 },
  balanceSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  scroll: { flex: 1 },
  body: { paddingHorizontal: 14, paddingTop: 14 },
  emptyCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 20, alignItems: 'center', ...SHADOWS.card },
  emptyText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  dateHeader: {
    fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2,
    color: COLORS.text3, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 8, marginTop: 4,
  },
  txCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    ...SHADOWS.card,
  },
  txDot: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  txArrow: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2, color: COLORS.text },
  txLabel: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
  txMeta: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2, marginTop: 2 },
  txAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
  txMethod: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text3, marginTop: 2 },
  stickyBottom: {
    backgroundColor: '#fff', borderTopWidth: 1.5, borderTopColor: COLORS.border,
    padding: 12, flexDirection: 'row', gap: 10,
  },
  gaveBtn: {
    flex: 1, padding: 13, borderRadius: 14,
    backgroundColor: '#FEE2E2', alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  gaveBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.danger },
  receivedBtn: {
    flex: 1, padding: 13, borderRadius: 14,
    backgroundColor: COLORS.primaryUltraLight, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  receivedBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.primary },
});
