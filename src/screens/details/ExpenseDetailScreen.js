import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { EXPENSE_CATEGORIES } from '../../data/mockData';

export default function ExpenseDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { categoryId } = route.params || {};
  const category = EXPENSE_CATEGORIES.find((c) => c.id === categoryId) || EXPENSE_CATEGORIES[0];

  const entriesByDate = {};
  (category.entries || []).forEach((entry) => {
    const date = entry.date || 'March 2026';
    if (!entriesByDate[date]) entriesByDate[date] = [];
    entriesByDate[date].push(entry);
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientDarkGreen}
        start={{ x: 0.13, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.catRow}>
          <View style={[styles.catIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={{ fontSize: 24 }}>{category.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.catName}>{category.name}</Text>
            <Text style={styles.catSub}>March 2026 · {category.count} entries</Text>
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLbl}>Total Spent</Text>
          <Text style={styles.totalAmt}>₹{category.total.toLocaleString('en-IN')}</Text>
          <Text style={styles.totalSub}>This month on {category.name}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {category.entries.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No entries recorded yet</Text>
            </View>
          )}

          {Object.entries(entriesByDate).map(([date, entries]) => (
            <View key={date}>
              <Text style={styles.dateHeader}>{date}</Text>
              {entries.map((entry, i) => (
                <View key={i} style={styles.entryCard}>
                  <View style={[styles.entryIcon, { backgroundColor: entry.iconBg }]}>
                    <Text style={{ fontSize: 18 }}>{entry.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryName}>{entry.name}</Text>
                    <Text style={styles.entryMethod}>
                      {entry.method === 'UPI' ? '📱 UPI' : entry.method === 'Cash' ? '💵 Cash' : entry.method}
                    </Text>
                  </View>
                  <Text style={styles.entryAmt}>₹{entry.amount.toLocaleString('en-IN')}</Text>
                </View>
              ))}
            </View>
          ))}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddExpense')}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>➕ Add Entry</Text>
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
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  catIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  catName: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  catSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  totalBox: {
    backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 14,
    padding: 14, marginTop: 14, alignItems: 'center',
  },
  totalLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  totalAmt: { fontFamily: FONTS.nunito.black, fontSize: 30, color: '#fff', letterSpacing: -1 },
  totalSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  scroll: { flex: 1 },
  body: { paddingHorizontal: 14, paddingTop: 14 },
  emptyCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 20, alignItems: 'center', ...SHADOWS.card },
  emptyText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  dateHeader: {
    fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2,
    color: COLORS.text3, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 8, marginTop: 4,
  },
  entryCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12,
    ...SHADOWS.card,
  },
  entryIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  entryName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
  entryMethod: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  entryAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2, color: COLORS.danger },
  stickyBottom: {
    backgroundColor: '#fff', borderTopWidth: 1.5, borderTopColor: COLORS.border, padding: 12,
  },
  addBtn: { padding: 13, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center' },
  addBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
});
