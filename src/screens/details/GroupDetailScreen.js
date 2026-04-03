import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { GROUPS } from '../../data/mockData';

export default function GroupDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { groupId } = route.params || {};
  const group = GROUPS.find((g) => g.id === groupId) || GROUPS[0];

  const expensesByMonth = {};
  (group.expenses || []).forEach((exp) => {
    const month = exp.month || 'March 2026';
    if (!expensesByMonth[month]) expensesByMonth[month] = [];
    expensesByMonth[month].push(exp);
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientPurple}
        start={{ x: 0.13, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.groupIcon, { backgroundColor: group.iconBg }]}>
            <Text style={{ fontSize: 26 }}>{group.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupSub}>{group.memberCount} members · {group.expenseCount} expenses this month</Text>
          </View>
        </View>

        {/* Balance box */}
        <View style={styles.balanceBox}>
          <View style={styles.balItem}>
            <Text style={[styles.balVal, { color: '#FCA5A5' }]}>
              ₹{Math.abs(group.balance).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.balLbl}>You Owe</Text>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.balItem}>
            <Text style={styles.balVal}>₹{group.totalExpenses.toLocaleString('en-IN')}</Text>
            <Text style={styles.balLbl}>Total Expenses</Text>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.balItem}>
            <Text style={styles.balVal}>{group.memberCount}</Text>
            <Text style={styles.balLbl}>Members</Text>
          </View>
        </View>

        {/* Member avatars */}
        <View style={styles.membersRow}>
          {(group.members || []).slice(0, 4).map((m) => (
            <View key={m.id} style={[styles.memberAv, { backgroundColor: m.color }]}>
              <Text style={styles.memberAvText}>{m.initials}</Text>
            </View>
          ))}
          {group.members.length > 0 && (
            <Text style={styles.memberNames}>
              {group.members.map((m) => m.name.split(' ')[0]).join(', ')}
            </Text>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {/* Who owes what */}
          {group.members.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Who owes what</Text>
              <View style={styles.card}>
                {group.members.map((m, i) => (
                  <View key={m.id} style={[styles.memberRow, i === group.members.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={[styles.memberAvSm, { backgroundColor: m.color }]}>
                      <Text style={styles.memberAvSmText}>{m.initials}</Text>
                    </View>
                    <Text style={styles.memberRowName}>{m.name}</Text>
                    {m.balanceType === 'settled' ? (
                      <View style={styles.settledBadge}><Text style={styles.settledText}>Settled ✅</Text></View>
                    ) : (
                      <Text style={[styles.memberRowBal, {
                        color: m.balanceType === 'owe' ? COLORS.danger : COLORS.primary
                      }]}>
                        {m.balanceType === 'owe' ? `Owes ₹${m.balance}` : `Gets ₹${m.balance}`}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Expenses by month */}
          {Object.entries(expensesByMonth).map(([month, exps]) => (
            <View key={month}>
              <Text style={styles.sectionLabel}>{month}</Text>
              {exps.map((exp, i) => (
                <View key={i} style={styles.expCard}>
                  <View style={[styles.expIcon, { backgroundColor: exp.iconBg }]}>
                    <Text style={{ fontSize: 18 }}>{exp.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <Text style={styles.expMeta}>{exp.meta}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    {exp.amount === 0 ? (
                      <Text style={[styles.expAmt, { color: COLORS.primary }]}>{exp.amountLabel}</Text>
                    ) : (
                      <>
                        <Text style={[styles.expAmt, { color: exp.amount > 0 ? COLORS.primary : COLORS.danger }]}>
                          {exp.amount > 0 ? '+' : ''}₹{Math.abs(exp.amount).toLocaleString('en-IN')}
                        </Text>
                        <Text style={styles.expAmtLbl}>{exp.amountLabel}</Text>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ))}

          {group.expenses.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No expenses recorded yet</Text>
            </View>
          )}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.addExpBtn}
          onPress={() => navigation.navigate('GroupAddExpense', { groupId: group.id })}
          activeOpacity={0.85}
        >
          <Text style={styles.addExpText}>➕ Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settleBtn}
          onPress={() => navigation.navigate('Settle', { groupId: group.id })}
          activeOpacity={0.85}
        >
          <Text style={styles.settleBtnText}>💸 Settle Up</Text>
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
  groupIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  groupName: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  groupSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  balanceBox: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, marginTop: 14,
  },
  balItem: { flex: 1, alignItems: 'center' },
  vDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  balVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
  balLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  membersRow: { flexDirection: 'row', gap: 6, marginTop: 12, alignItems: 'center' },
  memberAv: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  memberAvText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: '#fff' },
  memberNames: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.7)', marginLeft: 4 },
  scroll: { flex: 1 },
  body: { paddingHorizontal: 14, paddingTop: 14 },
  sectionLabel: {
    fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2,
    color: COLORS.text3, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 8, marginTop: 4,
  },
  card: { backgroundColor: COLORS.card, borderRadius: 14, padding: 12, marginBottom: 14, ...SHADOWS.card },
  memberRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  memberAvSm: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  memberAvSmText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base, color: '#fff' },
  memberRowName: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: COLORS.text, flex: 1 },
  memberRowBal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md },
  settledBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  settledText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: '#065F46' },
  expCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12,
    ...SHADOWS.card,
  },
  expIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  expTitle: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
  expMeta: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  expAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2 },
  expAmtLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text3, marginTop: 2 },
  emptyCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 20, alignItems: 'center', ...SHADOWS.card },
  emptyText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  stickyBottom: {
    backgroundColor: '#fff', borderTopWidth: 1.5, borderTopColor: COLORS.border,
    padding: 12, flexDirection: 'row', gap: 10,
  },
  addExpBtn: {
    flex: 1, padding: 13, borderRadius: 14,
    backgroundColor: COLORS.primary, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  addExpText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
  settleBtn: {
    flex: 1, padding: 13, borderRadius: 14,
    backgroundColor: '#EDE9FE', alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  settleBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.accent2 },
});
