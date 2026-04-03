import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import TopBar from '../../components/shared/TopBar';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { GROUPS } from '../../data/mockData';

const BADGE_CONFIG = {
  owe: { bg: '#FEE2E2', text: COLORS.danger },
  lent: { bg: COLORS.primaryUltraLight, text: COLORS.primary },
  settled: { bg: '#F3F4F6', text: COLORS.text2 },
};

export default function GroupsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Your Groups</Text>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => navigation.navigate('AddGroup')}
            activeOpacity={0.85}
          >
            <Text style={styles.newBtnText}>+ New Group</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {GROUPS.map((group) => {
            const badge = BADGE_CONFIG[group.balanceType];
            const badgeLabel = group.balanceType === 'owe'
              ? `You owe ₹${Math.abs(group.balance)}`
              : group.balanceType === 'lent'
                ? `Owed ₹${group.balance}`
                : 'All Settled ✅';
            return (
              <TouchableOpacity
                key={group.id}
                style={styles.groupCard}
                onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
                activeOpacity={0.85}
              >
                <View style={styles.gcTop}>
                  <View style={[styles.gcIcon, { backgroundColor: group.iconBg }]}>
                    <Text style={{ fontSize: 20 }}>{group.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.gcName}>{group.name}</Text>
                    <Text style={styles.gcMembers}>
                      {group.memberCount} members · {group.expenseCount} expenses this month
                    </Text>
                  </View>
                </View>
                <View style={styles.gcFooter}>
                  <Text style={styles.gcLast}>Last: {group.lastExpense}</Text>
                  <View style={[styles.balBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.balBadgeText, { color: badge.text }]}>{badgeLabel}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.addDashed}
            onPress={() => navigation.navigate('AddGroup')}
            activeOpacity={0.8}
          >
            <Text style={styles.addDashedText}>+ Create New Group</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingTop: 16, paddingBottom: 8,
  },
  title: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: COLORS.text },
  newBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
  },
  newBtnText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: '#fff' },
  body: { paddingHorizontal: 14 },
  groupCard: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 14,
    marginBottom: 10, ...SHADOWS.card,
  },
  gcTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  gcIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  gcName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
  gcMembers: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  gcFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  gcLast: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
  balBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  balBadgeText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
  addDashed: {
    borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: 'dashed',
    borderRadius: 14, padding: 13, alignItems: 'center',
    backgroundColor: COLORS.primaryUltraLight,
  },
  addDashedText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.primary },
});
