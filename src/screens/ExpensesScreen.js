import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText, Card, Button, ProgressBar } from '../components/ui';
import { SectionHeader } from '../components/common';
import ExpenseCategoryRow from '../features/expenses/ExpenseCategoryRow';
import { expenses } from '../data/mockData';
import { colors, radius } from '../theme';

const CATS = ['🍕 Food', '🚌 Travel', '🛒 Shop', '⚡ Bills', '🎬 Fun', '🏥 Health', '👗 Fashion', '⛽ Fuel', '🎁 Gifts', '➕ Other'];
const MONTHS = ['Mar 2026', 'Feb 2026', 'Jan 2026', 'Dec 2025'];

function AmountDisplay({ value = '0' }) {
  return (
    <View style={styles.amtBox}>
      <AppText variant="caption" color="rgba(255,255,255,0.55)" style={{ marginBottom: 6 }}>Enter Amount</AppText>
      <AppText style={styles.amtVal}>₹ {value}</AppText>
    </View>
  );
}

function SplitToggle({ value, onChange }) {
  return (
    <View style={styles.toggleRow}>
      {['Just Me', 'Friends', 'Group'].map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.toggleOpt, value === opt && styles.toggleOptActive]}
          onPress={() => onChange(opt)}
        >
          <AppText variant="labelSm" color={value === opt ? colors.primary : colors.textSecondary}>{opt}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ExpensesScreen() {
  const [activeMonth, setActiveMonth]   = useState('Mar 2026');
  const [activeCat,   setActiveCat]     = useState('🍕 Food');
  const [splitMode,   setSplitMode]     = useState('Just Me');
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const budget = 12000;
  const budgetPct = (totalSpent / budget) * 100;

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{ marginBottom: 4 }}>My Spending</AppText>
        <AppText style={styles.heroAmount}>₹{totalSpent.toLocaleString()}</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <View style={styles.pillsRow}>
            {expenses.slice(0, 4).map(e => (
              <View key={e.id} style={styles.pill}>
                <AppText variant="label" color="#fff">₹{e.amount.toLocaleString()}</AppText>
                <AppText variant="caption" color="rgba(255,255,255,0.75)">{e.icon} {e.category.split(' ')[0]}</AppText>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Month Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthTabs} contentContainerStyle={{ gap: 8, paddingHorizontal: 14 }}>
        {MONTHS.map(m => (
          <TouchableOpacity
            key={m}
            style={[styles.monthChip, activeMonth === m && styles.monthChipActive]}
            onPress={() => setActiveMonth(m)}
          >
            <AppText variant="labelSm" color={activeMonth === m ? '#fff' : colors.textSecondary}>{m}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.body}>
        {/* Budget card */}
        <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.budgetCard}>
          <View style={styles.budgetRow}>
            <View>
              <AppText variant="caption" color="rgba(255,255,255,0.8)">Total Spent</AppText>
              <AppText variant="amount"  color="#fff">₹{totalSpent.toLocaleString()}</AppText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText variant="caption" color="rgba(255,255,255,0.8)">Budget</AppText>
              <AppText variant="amount"  color="#fff">₹{budget.toLocaleString()}</AppText>
            </View>
          </View>
          <ProgressBar progress={budgetPct} color="rgba(255,255,255,0.85)" style={{ marginTop: 10 }} />
          <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{ marginTop: 4 }}>
            {budgetPct.toFixed(0)}% of monthly budget used
          </AppText>
        </LinearGradient>

        {/* Add Expense */}
        <Card>
          <AppText variant="h4" color={colors.text} style={{ marginBottom: 12 }}>➕ Add New Expense</AppText>
          <AmountDisplay />

          <AppText variant="bodyMd" color={colors.textSecondary} style={styles.fieldLabel}>Category</AppText>
          <View style={styles.catGrid}>
            {CATS.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catOpt, activeCat === cat && styles.catOptActive]}
                onPress={() => setActiveCat(cat)}
              >
                <AppText style={styles.catIcon}>{cat.split(' ')[0]}</AppText>
                <AppText variant="caption" color={activeCat === cat ? colors.primary : colors.textSecondary} style={styles.catLbl}>
                  {cat.split(' ').slice(1).join(' ')}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.descInput}
            placeholder="Description (e.g. Domino's Pizza)"
            placeholderTextColor={colors.textTertiary}
          />

          <AppText variant="bodyMd" color={colors.textSecondary} style={styles.fieldLabel}>Split With</AppText>
          <SplitToggle value={splitMode} onChange={setSplitMode} />

          <TouchableOpacity style={styles.attachBox}>
            <AppText style={{ fontSize: 18 }}>📎</AppText>
            <AppText variant="bodyMd" color={colors.textSecondary}>Attach or Scan Receipt</AppText>
          </TouchableOpacity>

          <Button title="✅ Save Expense" size="lg" style={{ marginTop: 6 }} />
        </Card>

        {/* Expense list */}
        <SectionHeader title={`${activeMonth} — All Categories`} />
        <Card padding={0}>
          {expenses.map((exp, i) => (
            <View key={exp.id} style={{ paddingHorizontal: 14 }}>
              <ExpenseCategoryRow item={exp} borderBottom={i < expenses.length - 1} />
            </View>
          ))}
        </Card>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: colors.bg },
  hero:           { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 20 },
  heroAmount:     { fontFamily: 'Nunito_900Black', fontSize: 38, color: '#fff', letterSpacing: -1 },
  pillsRow:       { flexDirection: 'row', gap: 8 },
  pill:           { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 10, minWidth: 80, alignItems: 'center' },
  monthTabs:      { paddingVertical: 12 },
  monthChip:      { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  monthChipActive:{ backgroundColor: colors.primary, borderColor: colors.primary },
  body:           { paddingHorizontal: 14 },
  budgetCard:     { borderRadius: 16, padding: 14, marginBottom: 12 },
  budgetRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  fieldLabel:     { marginBottom: 6, marginTop: 10 },
  amtBox:         { backgroundColor: colors.text, borderRadius: 12, padding: 18, alignItems: 'center', marginBottom: 14 },
  amtVal:         { fontFamily: 'Nunito_900Black', fontSize: 38, color: '#fff', letterSpacing: -2 },
  catGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 2 },
  catOpt:         { width: '22%', aspectRatio: 1, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center', gap: 4 },
  catOptActive:   { backgroundColor: colors.primaryUltraLight, borderColor: colors.primary },
  catIcon:        { fontSize: 20, lineHeight: 24 },
  catLbl:         { fontSize: 9, textAlign: 'center' },
  descInput:      { backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontFamily: 'DMSans_400Regular', fontSize: 13, color: colors.text, marginTop: 12 },
  toggleRow:      { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 3, gap: 2, marginBottom: 12 },
  toggleOpt:      { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 8 },
  toggleOptActive:{ backgroundColor: colors.white },
  attachBox:      { borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 10, padding: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
});
