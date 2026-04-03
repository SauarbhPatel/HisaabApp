import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText, Card } from '../components/ui';
import { FilterBar, SectionHeader } from '../components/common';
import CategoryBar from '../features/reports/CategoryBar';
import { colors }  from '../theme';

const FILTERS = ['This Month', 'Last 3 Months', 'This Year', 'Custom'];

const SPENDING = [
  { label: '🍕 Food & Drinks',   value: 3200, percent: 68, color: colors.primary },
  { label: '⚡ Bills',           value: 2400, percent: 51, color: colors.purple  },
  { label: '🚌 Travel',          value: 1850, percent: 39, color: colors.accent  },
  { label: '🎬 Entertainment',   value: 960,  percent: 20, color: colors.danger  },
];

const INCOME_ROWS = [
  { label: 'School ERP (March)',   amount: 10000 },
  { label: 'Flatshare Karo (Dev)', amount: 7000  },
  { label: 'School ERP (Feb)',     amount: 2500  },
  { label: 'QR Park Plus',         amount: 5000  },
  { label: 'QR Park Update',       amount: 500   },
];

const LEGEND = [
  { label: 'Food & Drinks', color: colors.primary },
  { label: 'Bills',         color: colors.purple  },
  { label: 'Travel',        color: colors.accent  },
  { label: 'Others',        color: '#D1D5DB'      },
];

const MONTHLY = [
  { month: 'Jan', spent: 7200,  income: 18000 },
  { month: 'Feb', spent: 7900,  income: 5000  },
  { month: 'Mar', spent: 8940,  income: 34000 },
];

function DonutLegend() {
  return (
    <View>
      {LEGEND.map(l => (
        <View key={l.label} style={styles.legRow}>
          <View style={[styles.legDot, { backgroundColor: l.color }]} />
          <AppText variant="bodySm" color={colors.textSecondary} style={{ flex: 1 }}>{l.label}</AppText>
          <AppText variant="label"  color={colors.text}>
            {l.label === 'Food & Drinks' ? '₹3,200' : l.label === 'Bills' ? '₹2,400' : l.label === 'Travel' ? '₹1,850' : '₹1,490'}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function DonutPlaceholder() {
  return (
    <View style={styles.donut}>
      <View style={styles.donutRing}>
        <AppText variant="label"   color={colors.text} style={{ textAlign: 'center' }}>₹8.9k</AppText>
        <AppText variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>SPENT</AppText>
      </View>
    </View>
  );
}

function MonthlyBars() {
  const maxVal = 34000;
  return (
    <View style={styles.monthlyWrap}>
      {MONTHLY.map(d => {
        const incomeH = Math.round((d.income / maxVal) * 80);
        const spentH  = Math.round((d.spent  / maxVal) * 80);
        return (
          <View key={d.month} style={styles.monthlyCol}>
            <View style={styles.monthlyBars}>
              <View style={[styles.mbar, { height: incomeH, backgroundColor: '#DBEAFE' }]} />
              <View style={[styles.mbar, { height: spentH,  backgroundColor: colors.danger + '55' }]} />
            </View>
            <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 6 }}>{d.month}</AppText>
          </View>
        );
      })}
    </View>
  );
}

export default function ReportsScreen() {
  const [filter, setFilter] = useState('This Month');
  const totalIncome = INCOME_ROWS.reduce((s, r) => s + r.amount, 0);

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={['#1e3a5f', colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <AppText variant="h2" color="#fff" style={{ marginBottom: 12 }}>📊 Reports</AppText>
        <View style={styles.statsRow}>
          <View style={styles.stat}><AppText variant="amount" color="#fff" style={{ fontSize: 20 }}>₹8,940</AppText><AppText variant="caption" color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>Total Spent · March</AppText></View>
          <View style={styles.stat}><AppText variant="amount" color="#fff" style={{ fontSize: 20 }}>₹34,000</AppText><AppText variant="caption" color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>Project Income</AppText></View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <FilterBar options={FILTERS} active={filter} onSelect={setFilter} style={{ marginBottom: 14 }} />

        {/* Spending Breakdown */}
        <Card>
          <SectionHeader title="Spending Breakdown" />
          <View style={styles.donutRow}>
            <DonutPlaceholder />
            <DonutLegend />
          </View>
        </Card>

        {/* Project Income */}
        <LinearGradient colors={['#1e3a5f', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.incomeCard}>
          <AppText variant="sectionHeader" color="rgba(255,255,255,0.7)" style={{ marginBottom: 10 }}>Project Income — March</AppText>
          {INCOME_ROWS.map((r, i) => (
            <View key={i} style={styles.incomeRow}>
              <AppText variant="bodySm" color="rgba(255,255,255,0.85)">{r.label}</AppText>
              <AppText variant="label"  color="#fff">₹{r.amount.toLocaleString()}</AppText>
            </View>
          ))}
          <View style={[styles.incomeRow, styles.incomeTotalRow]}>
            <AppText variant="label" color="#fff">Total Received</AppText>
            <AppText variant="h3"   color="#fff">₹{totalIncome.toLocaleString()}</AppText>
          </View>
        </LinearGradient>

        {/* Category Bars */}
        <Card>
          <SectionHeader title="Spending by Category" />
          {SPENDING.map(s => <CategoryBar key={s.label} {...s} />)}
        </Card>

        {/* Monthly chart */}
        <Card>
          <SectionHeader title="Monthly Overview" />
          <MonthlyBars />
          <View style={styles.chartLegend}>
            <View style={styles.chartLegItem}><View style={[styles.chartLegDot, { backgroundColor: '#DBEAFE' }]} /><AppText variant="caption" color={colors.textSecondary}>Income</AppText></View>
            <View style={styles.chartLegItem}><View style={[styles.chartLegDot, { backgroundColor: colors.danger + '55' }]} /><AppText variant="caption" color={colors.textSecondary}>Spent</AppText></View>
          </View>
        </Card>

        {/* Summary */}
        <Card>
          <SectionHeader title="💸 Profit Analysis" />
          {[
            { label: 'Total Income',          value: '₹34,000', color: colors.primary },
            { label: 'Developer Payments',    value: '−₹8,500', color: colors.danger  },
            { label: 'Net Profit',            value: '₹25,500', color: colors.primary, bold: true },
          ].map(r => (
            <View key={r.label} style={styles.summaryRow}>
              <AppText variant={r.bold ? 'label' : 'bodySm'} color={colors.text}>{r.label}</AppText>
              <AppText variant={r.bold ? 'h4' : 'label'}    color={r.color}>{r.value}</AppText>
            </View>
          ))}
        </Card>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: colors.bg },
  hero:         { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 20 },
  statsRow:     { flexDirection: 'row', gap: 10 },
  stat:         { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10 },
  body:         { padding: 14 },
  donutRow:     { flexDirection: 'row', alignItems: 'center', gap: 16 },
  donut:        { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  donutRing:    { width: 100, height: 100, borderRadius: 50, borderWidth: 16, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  legRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 },
  legDot:       { width: 8, height: 8, borderRadius: 2 },
  incomeCard:   { borderRadius: 16, padding: 14, marginBottom: 12 },
  incomeRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  incomeTotalRow:{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 8, marginBottom: 0 },
  monthlyWrap:  { flexDirection: 'row', alignItems: 'flex-end', gap: 20, height: 100, marginBottom: 10 },
  monthlyCol:   { flex: 1, alignItems: 'center' },
  monthlyBars:  { flexDirection: 'row', gap: 4, alignItems: 'flex-end', height: 88 },
  mbar:         { width: 16, borderRadius: 4 },
  chartLegend:  { flexDirection: 'row', gap: 16 },
  chartLegItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chartLegDot:  { width: 10, height: 10, borderRadius: 2 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
});
