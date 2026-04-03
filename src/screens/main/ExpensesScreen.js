import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TopBar from '../../components/shared/TopBar';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { EXPENSE_CATEGORIES, EXPENSE_PILLS } from '../../data/mockData';

const MONTH_FILTERS = ['Mar 2026', 'Feb 2026', 'Jan 2026', 'Dec 2025'];

export default function ExpensesScreen({ navigation }) {
  const [activeMonth, setActiveMonth] = useState('Mar 2026');

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={COLORS.gradientDarkGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.heroLbl}>My Spending — March 2026</Text>
          <Text style={styles.heroTotal}>₹8,940</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
            {EXPENSE_PILLS.map((p) => (
              <View key={p.label} style={styles.pill}>
                <Text style={styles.pillVal}>{p.value}</Text>
                <Text style={styles.pillLbl}>{p.label}</Text>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* Month filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthRow} contentContainerStyle={styles.monthRowContent}>
          {MONTH_FILTERS.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setActiveMonth(m)}
              style={[styles.monthChip, activeMonth === m && styles.monthChipActive]}
            >
              <Text style={[styles.monthChipText, activeMonth === m && styles.monthChipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category list */}
        <View style={styles.body}>
          <View style={styles.listCard}>
            {EXPENSE_CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catRow, i === EXPENSE_CATEGORIES.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => navigation.navigate('ExpenseDetail', { categoryId: cat.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.catIcon, { backgroundColor: cat.iconBg }]}>
                  <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.catName}>{cat.name}</Text>
                  <Text style={styles.catCount}>{cat.count} entries</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.catAmt}>₹{cat.total.toLocaleString('en-IN')}</Text>
                  <Text style={styles.catArrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { padding: 18, paddingBottom: 20 },
  heroLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  heroTotal: { fontFamily: FONTS.nunito.black, fontSize: 36, color: '#fff', letterSpacing: -1 },
  pillsScroll: { marginTop: 12 },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10, padding: 8, marginRight: 8, alignItems: 'center',
  },
  pillVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
  pillLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  monthRow: { flexGrow: 0 },
  monthRowContent: { paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  monthChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff',
  },
  monthChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  monthChipText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.text2 },
  monthChipTextActive: { color: '#fff' },
  body: { paddingHorizontal: 14 },
  listCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.card,
    padding: 14, ...SHADOWS.card,
  },
  catRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  catIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  catName: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: COLORS.text },
  catCount: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  catAmt: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.danger },
  catArrow: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text3, marginTop: 2 },
  fab: {
    position: 'absolute', bottom: 72, right: 16,
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 20, elevation: 10,
  },
  fabText: { fontSize: 28, color: '#fff', lineHeight: 32, fontWeight: '300' },
});
