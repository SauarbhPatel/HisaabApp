import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import TopBar from '../../components/shared/TopBar';
import { FilterChipRow } from '../../components/shared/FilterChip';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { useAppContext } from '../../context/AppContext';

const PERIOD_FILTERS = ['This Month', 'Last 3 Months', 'This Year', 'Custom'];

function DonutChart() {
  const R = 38, cx = 50, cy = 50, strokeW = 16;
  const circ = 2 * Math.PI * R;
  const segments = [
    { pct: 0.36, color: COLORS.primary, offset: 0 },
    { pct: 0.27, color: COLORS.accent2, offset: 0.36 * circ },
    { pct: 0.21, color: COLORS.accent, offset: (0.36 + 0.27) * circ },
    { pct: 0.16, color: '#E5E7EB', offset: (0.36 + 0.27 + 0.21) * circ },
  ];
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <Circle cx={cx} cy={cy} r={R} fill="none" stroke="#F3F4F6" strokeWidth={strokeW} />
      {segments.map((s, i) => (
        <Circle
          key={i} cx={cx} cy={cy} r={R} fill="none"
          stroke={s.color} strokeWidth={strokeW}
          strokeDasharray={`${s.pct * circ} ${circ}`}
          strokeDashoffset={-s.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}
      <SvgText x="50" y="46" textAnchor="middle" fontWeight="900" fontSize="12" fill={COLORS.text}>₹8.9k</SvgText>
      <SvgText x="50" y="58" textAnchor="middle" fontSize="8" fill={COLORS.text2}>SPENT</SvgText>
    </Svg>
  );
}

function HBar({ label, val, pct, color }) {
  return (
    <View style={styles.hBar}>
      <View style={styles.hBarHeader}>
        <Text style={styles.hBarLabel}>{label}</Text>
        <Text style={styles.hBarVal}>{val}</Text>
      </View>
      <View style={styles.hBarTrack}>
        <View style={[styles.hBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function SettleRow({ label, val, valColor }) {
  return (
    <View style={styles.settleRow}>
      <Text style={styles.settleLabel}>{label}</Text>
      <Text style={[styles.settleVal, { color: valColor || COLORS.text }]}>{val}</Text>
    </View>
  );
}

export default function ReportsScreen({ navigation }) {
  const { useCase } = useAppContext();
  const [period, setPeriod] = useState('This Month');

  const renderSplit = () => (
    <>
      <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Text style={styles.heroTitle}>📊 My Reports</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹8,940</Text><Text style={styles.heroStatLbl}>Total Spent</Text></View>
          <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹5,440</Text><Text style={styles.heroStatLbl}>Owed to You</Text></View>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <FilterChipRow chips={['This Month', 'Last 3 Months', 'This Year']} activeChip={period} onSelect={setPeriod} style={{ marginHorizontal: -14, marginBottom: 8 }} />
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Spending Breakdown</Text>
          <View style={styles.donutRow}>
            <DonutChart />
            <View style={styles.legend}>
              {[{ color: COLORS.primary, label: 'Food & Drinks', val: '₹3,200' }, { color: COLORS.accent2, label: 'Bills', val: '₹2,400' }, { color: COLORS.accent, label: 'Travel', val: '₹1,850' }, { color: '#E5E7EB', label: 'Others', val: '₹1,490' }].map((l) => (
                <View key={l.label} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                  <Text style={styles.legendLabel}>{l.label}</Text>
                  <Text style={styles.legendVal}>{l.val}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>👥 Friends Summary</Text>
          <SettleRow label="Total friends owe you" val="₹5,440" valColor={COLORS.primary} />
          <SettleRow label="You owe friends" val="₹3,200" valColor={COLORS.danger} />
          <SettleRow label="Net balance" val="+₹2,240" valColor={COLORS.primary} />
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Spending by Category</Text>
          <HBar label="🍕 Food" val="₹3,200" pct={68} color={COLORS.primary} />
          <HBar label="⚡ Bills" val="₹2,400" pct={51} color={COLORS.accent2} />
          <HBar label="🚌 Travel" val="₹1,850" pct={39} color={COLORS.accent} />
          <HBar label="🎬 Fun" val="₹900" pct={19} color={COLORS.danger} />
        </View>
      </View>
    </>
  );

  const renderFreelance = () => (
    <>
      <LinearGradient colors={COLORS.gradientBlue} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Text style={styles.heroTitle}>📊 Project Reports</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹34,000</Text><Text style={styles.heroStatLbl}>Income</Text></View>
          <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹8,500</Text><Text style={styles.heroStatLbl}>Dev Paid</Text></View>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <FilterChipRow chips={['This Month', 'Last 3 Months', 'This Year']} activeChip={period} onSelect={setPeriod} style={{ marginHorizontal: -14, marginBottom: 8 }} />
        <LinearGradient colors={COLORS.gradientBlue} style={[styles.card, { padding: 14 }]}>
          <Text style={[styles.sectionHeader, { color: 'rgba(255,255,255,0.7)' }]}>Project Income — March</Text>
          {[['School ERP (March)', '₹10,000'], ['Flatshare Karo (Dev)', '₹7,000'], ['QR Park Update', '₹500']].map(([l, v]) => (
            <View key={l} style={styles.incomeRow}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md }}>{l}</Text>
              <Text style={{ color: '#fff', fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md }}>{v}</Text>
            </View>
          ))}
          <View style={[styles.incomeRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 8 }]}>
            <Text style={{ color: '#fff', fontFamily: FONTS.nunito.bold, fontSize: SIZES.md }}>Total</Text>
            <Text style={{ color: '#fff', fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 }}>₹34,000</Text>
          </View>
        </LinearGradient>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Income by Client</Text>
          <HBar label="🟢 School ERP" val="₹12,500" pct={70} color="#2563eb" />
          <HBar label="🟡 Flatshare" val="₹11,000" pct={55} color={COLORS.accent2} />
          <HBar label="🟣 Maksoft" val="₹5,500" pct={27} color="#ba7517" />
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>💸 Profit Analysis</Text>
          <SettleRow label="Total Income" val="₹34,000" valColor={COLORS.primary} />
          <SettleRow label="Developer Payments" val="−₹8,500" valColor={COLORS.danger} />
          <SettleRow label="Net Profit" val="₹25,500" valColor={COLORS.primary} />
        </View>
      </View>
    </>
  );

  const renderBoth = () => (
    <>
      <LinearGradient colors={['#1e3a5f', '#1a7a5e']} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Text style={styles.heroTitle}>📊 Reports</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹8,940</Text><Text style={styles.heroStatLbl}>Total Spent · March</Text></View>
          <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹34,000</Text><Text style={styles.heroStatLbl}>Project Income</Text></View>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <FilterChipRow chips={PERIOD_FILTERS} activeChip={period} onSelect={setPeriod} style={{ marginHorizontal: -14, marginBottom: 8 }} />
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Spending Breakdown</Text>
          <View style={styles.donutRow}><DonutChart /><View style={styles.legend}>
            {[{ color: COLORS.primary, label: 'Food & Drinks', val: '₹3,200' }, { color: COLORS.accent2, label: 'Bills', val: '₹2,400' }, { color: COLORS.accent, label: 'Travel', val: '₹1,850' }, { color: '#E5E7EB', label: 'Others', val: '₹1,490' }].map((l) => (
              <View key={l.label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <Text style={styles.legendLabel}>{l.label}</Text>
                <Text style={styles.legendVal}>{l.val}</Text>
              </View>
            ))}
          </View></View>
        </View>
        <LinearGradient colors={COLORS.gradientBlue} style={[styles.card, { padding: 14 }]}>
          <Text style={[styles.sectionHeader, { color: 'rgba(255,255,255,0.7)' }]}>Project Income — March</Text>
          {[['School ERP (March)', '₹10,000'], ['Flatshare Karo (Dev)', '₹7,000']].map(([l, v]) => (
            <View key={l} style={styles.incomeRow}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md }}>{l}</Text>
              <Text style={{ color: '#fff', fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md }}>{v}</Text>
            </View>
          ))}
          <View style={[styles.incomeRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 8 }]}>
            <Text style={{ color: '#fff', fontFamily: FONTS.nunito.bold, fontSize: SIZES.md }}>Total Received</Text>
            <Text style={{ color: '#fff', fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 }}>₹34,000</Text>
          </View>
        </LinearGradient>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Spending by Category</Text>
          <HBar label="🍕 Food" val="₹3,200" pct={68} color={COLORS.primary} />
          <HBar label="⚡ Bills" val="₹2,400" pct={51} color={COLORS.accent2} />
          <HBar label="🚌 Travel" val="₹1,850" pct={39} color={COLORS.accent} />
          <HBar label="🎬 Entertainment" val="₹900" pct={19} color={COLORS.danger} />
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {useCase === 'split' && renderSplit()}
        {useCase === 'freelance' && renderFreelance()}
        {useCase === 'both' && renderBoth()}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { padding: 18, paddingBottom: 20 },
  heroTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
  heroStats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  heroStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10 },
  heroStatVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  heroStatLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  body: { padding: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 12, ...SHADOWS.card },
  sectionHeader: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  donutRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  legend: { flex: 1 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2, flex: 1 },
  legendVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  hBar: { marginBottom: 12 },
  hBarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  hBarLabel: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.base, color: COLORS.text },
  hBarVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base, color: COLORS.text },
  hBarTrack: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
  hBarFill: { height: '100%', borderRadius: 99 },
  settleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settleLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  settleVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
  incomeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
