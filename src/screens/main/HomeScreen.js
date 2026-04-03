import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../context/AppContext';
import TopBar from '../../components/shared/TopBar';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import {
  HOME_ACTIVITY_SPLIT, HOME_ACTIVITY_FREELANCE, HOME_ACTIVITY_BOTH,
} from '../../data/mockData';

function StatCard({ val, lbl, sub, light }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statVal}>{val}</Text>
      <Text style={styles.statLbl}>{lbl}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function UrgentBanner({ text }) {
  return (
    <View style={styles.urgentBanner}>
      <Text style={{ fontSize: 16 }}>⚠️</Text>
      <Text style={styles.urgentText}>{text}</Text>
    </View>
  );
}

function MiniChart({ val, color, label, bars }) {
  return (
    <View style={styles.miniChart}>
      <View style={styles.miniChartBars}>
        {bars.map((h, i) => (
          <View
            key={i}
            style={[styles.miniBar, { height: h, backgroundColor: i === 4 ? COLORS.primary : COLORS.primaryUltraLight }]}
          />
        ))}
      </View>
      <Text style={[styles.miniVal, { color }]}>{val}</Text>
      <Text style={styles.miniLbl}>{label}</Text>
    </View>
  );
}

function QuickAction({ icon, title, sub, onPress }) {
  return (
    <TouchableOpacity style={styles.qaBtn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.qaIcon}>{icon}</Text>
      <View>
        <Text style={styles.qaTitle}>{title}</Text>
        <Text style={styles.qaSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

function TxItem({ item, navigation }) {
  return (
    <TouchableOpacity
      style={styles.txItem}
      onPress={() => item.navigate && navigation.navigate(item.navigate)}
      activeOpacity={0.85}
    >
      <View style={[styles.txIcon, { backgroundColor: item.iconBg }]}>
        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txName}>{item.name}</Text>
        <Text style={styles.txMeta}>{item.meta}</Text>
      </View>
      <Text style={[styles.txAmt, { color: item.amount >= 0 ? COLORS.primary : COLORS.danger }]}>
        {item.amount >= 0 ? '+' : ''}₹{Math.abs(item.amount).toLocaleString('en-IN')}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { useCase } = useAppContext();

  const renderSplitHero = () => (
    <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <Text style={styles.heroGreet}>Good morning, Rahul 👋</Text>
      <Text style={styles.heroTitle}>March Overview</Text>
      <View style={styles.statsGrid}>
        <StatCard val="₹8,940" lbl="Personal Spent" sub="↑ 12% vs Feb" />
        <StatCard val="₹5,650" lbl="Friends Owe You" sub="3 pending" />
        <StatCard val="−₹3,200" lbl="You Owe Friends" sub="2 people" />
        <StatCard val="4" lbl="Active Groups" sub="18 expenses" />
      </View>
      <UrgentBanner text="Sneha's ₹2,990 is pending for 8 days — Remind?" />
    </LinearGradient>
  );

  const renderFreelanceHero = () => (
    <LinearGradient colors={COLORS.gradientBlue} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <Text style={styles.heroGreet}>Good morning, Rahul 👋</Text>
      <Text style={styles.heroTitle}>Project Dashboard</Text>
      <View style={styles.statsGrid}>
        <StatCard val="₹34,000" lbl="Project Income" sub="3 active" />
        <StatCard val="₹10,000" lbl="Client Pending" sub="School ERP" />
        <StatCard val="₹9,000" lbl="Dev Pay Due" sub="2 developers" />
        <StatCard val="3" lbl="Clients" sub="Active" />
      </View>
      <UrgentBanner text="School ERP payment ₹10,000 pending from client" />
    </LinearGradient>
  );

  const renderBothHero = () => (
    <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <Text style={styles.heroGreet}>Good morning, Rahul 👋</Text>
      <Text style={styles.heroTitle}>March Overview</Text>
      <View style={styles.statsGrid}>
        <StatCard val="₹8,940" lbl="Personal Spent" sub="↑ 12% vs Feb" />
        <StatCard val="₹34,000" lbl="Project Income" sub="3 active projects" />
        <StatCard val="₹5,650" lbl="Friends Owe You" sub="3 pending" />
        <StatCard val="₹9,000" lbl="Dev Payments Due" sub="2 developers" />
      </View>
      <UrgentBanner text="School ERP payment ₹10,000 pending from client" />
    </LinearGradient>
  );

  const activity = useCase === 'split'
    ? HOME_ACTIVITY_SPLIT
    : useCase === 'freelance'
      ? HOME_ACTIVITY_FREELANCE
      : HOME_ACTIVITY_BOTH;

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {useCase === 'split' && renderSplitHero()}
        {useCase === 'freelance' && renderFreelanceHero()}
        {useCase === 'both' && renderBothHero()}

        <View style={styles.body}>
          {/* Mini charts — only for both */}
          {useCase === 'both' && (
            <View style={styles.miniChartsRow}>
              <MiniChart val="₹8.9k" color={COLORS.danger} label="SPENT"
                bars={[28, 38, 50, 32, 65, 44, 55]} />
              <MiniChart val="₹34k" color={COLORS.blue} label="INCOME"
                bars={[35, 50, 58, 46, 28, 39, 50]} />
              <MiniChart val="3" color={COLORS.accent2} label="PROJECTS"
                bars={[44, 28, 40, 58, 36, 46, 32]} />
            </View>
          )}

          <Text style={styles.sectionHeader}>Quick Actions</Text>
          <View style={styles.qaGrid}>
            {useCase === 'split' && <>
              <QuickAction icon="➕" title="Add Expense" sub="Track spending" onPress={() => navigation.navigate('AddExpense')} />
              <QuickAction icon="👥" title="Split with Group" sub="Divide bills" onPress={() => navigation.navigate('Groups')} />
              <QuickAction icon="💸" title="Settle Up" sub="₹5,650 pending" onPress={() => navigation.navigate('Friends')} />
              <QuickAction icon="🤝" title="New Group" sub="Plan a trip/flat" onPress={() => navigation.navigate('AddGroup')} />
            </>}
            {useCase === 'freelance' && <>
              <QuickAction icon="💼" title="My Projects" sub="3 active" onPress={() => navigation.navigate('Projects')} />
              <QuickAction icon="➕" title="New Project" sub="Add a project" onPress={() => navigation.navigate('AddProject')} />
              <QuickAction icon="💸" title="Pay Developer" sub="₹9k due" onPress={() => navigation.navigate('DevPay')} />
              <QuickAction icon="🏢" title="My Clients" sub="3 clients" onPress={() => navigation.navigate('MyClients')} />
            </>}
            {useCase === 'both' && <>
              <QuickAction icon="➕" title="Add Expense" sub="Track spending" onPress={() => navigation.navigate('AddExpense')} />
              <QuickAction icon="💼" title="My Projects" sub="3 active" onPress={() => navigation.navigate('Projects')} />
              <QuickAction icon="🤝" title="Settle Up" sub="₹5,650 pending" onPress={() => navigation.navigate('Friends')} />
              <QuickAction icon="💸" title="Pay Developer" sub="₹9k due" onPress={() => navigation.navigate('DevPay')} />
            </>}
          </View>

          <View style={styles.activityHeader}>
            <Text style={styles.sectionHeader}>Recent Activity</Text>
            <Text style={styles.seeAll}>See All →</Text>
          </View>
          {activity.map((item, i) => (
            <TxItem key={i} item={item} navigation={navigation} />
          ))}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  hero: { padding: 18, paddingBottom: 22 },
  heroGreet: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  heroTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl4, color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  statCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14, padding: 12,
  },
  statVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  statLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statSub: { fontFamily: FONTS.nunito.semiBold, fontSize: SIZES.sm, color: '#A7F3D0', marginTop: 4 },
  urgentBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderRadius: 10, padding: 8, marginTop: 12,
  },
  urgentText: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.base, color: '#FEE2E2', flex: 1 },
  body: { padding: 14 },
  miniChartsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  miniChart: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 14,
    padding: 10, alignItems: 'center', ...SHADOWS.card,
  },
  miniChartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 24, marginBottom: 4 },
  miniBar: { width: 5, borderRadius: 3 },
  miniVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
  miniLbl: { fontFamily: FONTS.nunito.semiBold, fontSize: SIZES.xs, color: COLORS.text2 },
  sectionHeader: {
    fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2,
    color: COLORS.text2, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 10,
  },
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  qaBtn: {
    width: '47.5%', backgroundColor: COLORS.card,
    borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    ...SHADOWS.card,
  },
  qaIcon: { fontSize: 22 },
  qaTitle: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.text },
  qaSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text2 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seeAll: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: COLORS.primary },
  txItem: {
    backgroundColor: COLORS.card, borderRadius: 14,
    padding: 12, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    ...SHADOWS.card,
  },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  txMeta: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  txAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg },
});
