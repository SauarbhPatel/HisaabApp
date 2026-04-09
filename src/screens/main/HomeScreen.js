// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAppContext } from '../../context/AppContext';
// import TopBar from '../../components/shared/TopBar';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import { FONTS, SIZES, RADIUS } from '../../theme/typography';
// import {
//   HOME_ACTIVITY_SPLIT, HOME_ACTIVITY_FREELANCE, HOME_ACTIVITY_BOTH,
// } from '../../data/mockData';

// function StatCard({ val, lbl, sub, light }) {
//   return (
//     <View style={styles.statCard}>
//       <Text style={styles.statVal}>{val}</Text>
//       <Text style={styles.statLbl}>{lbl}</Text>
//       {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
//     </View>
//   );
// }

// function UrgentBanner({ text }) {
//   return (
//     <View style={styles.urgentBanner}>
//       <Text style={{ fontSize: 16 }}>⚠️</Text>
//       <Text style={styles.urgentText}>{text}</Text>
//     </View>
//   );
// }

// function MiniChart({ val, color, label, bars }) {
//   return (
//     <View style={styles.miniChart}>
//       <View style={styles.miniChartBars}>
//         {bars.map((h, i) => (
//           <View
//             key={i}
//             style={[styles.miniBar, { height: h, backgroundColor: i === 4 ? COLORS.primary : COLORS.primaryUltraLight }]}
//           />
//         ))}
//       </View>
//       <Text style={[styles.miniVal, { color }]}>{val}</Text>
//       <Text style={styles.miniLbl}>{label}</Text>
//     </View>
//   );
// }

// function QuickAction({ icon, title, sub, onPress }) {
//   return (
//     <TouchableOpacity style={styles.qaBtn} onPress={onPress} activeOpacity={0.85}>
//       <Text style={styles.qaIcon}>{icon}</Text>
//       <View>
//         <Text style={styles.qaTitle}>{title}</Text>
//         <Text style={styles.qaSub}>{sub}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// function TxItem({ item, navigation }) {
//   return (
//     <TouchableOpacity
//       style={styles.txItem}
//       onPress={() => item.navigate && navigation.navigate(item.navigate)}
//       activeOpacity={0.85}
//     >
//       <View style={[styles.txIcon, { backgroundColor: item.iconBg }]}>
//         <Text style={{ fontSize: 18 }}>{item.icon}</Text>
//       </View>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.txName}>{item.name}</Text>
//         <Text style={styles.txMeta}>{item.meta}</Text>
//       </View>
//       <Text style={[styles.txAmt, { color: item.amount >= 0 ? COLORS.primary : COLORS.danger }]}>
//         {item.amount >= 0 ? '+' : ''}₹{Math.abs(item.amount).toLocaleString('en-IN')}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// export default function HomeScreen({ navigation }) {
//   const { useCase } = useAppContext();

//   const renderSplitHero = () => (
//     <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
//       <Text style={styles.heroGreet}>Good morning, Rahul 👋</Text>
//       <Text style={styles.heroTitle}>March Overview</Text>
//       <View style={styles.statsGrid}>
//         <StatCard val="₹8,940" lbl="Personal Spent" sub="↑ 12% vs Feb" />
//         <StatCard val="₹5,650" lbl="Friends Owe You" sub="3 pending" />
//         <StatCard val="−₹3,200" lbl="You Owe Friends" sub="2 people" />
//         <StatCard val="4" lbl="Active Groups" sub="18 expenses" />
//       </View>
//       <UrgentBanner text="Sneha's ₹2,990 is pending for 8 days — Remind?" />
//     </LinearGradient>
//   );

//   const renderFreelanceHero = () => (
//     <LinearGradient colors={COLORS.gradientBlue} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
//       <Text style={styles.heroGreet}>Good morning, Rahul 👋</Text>
//       <Text style={styles.heroTitle}>Project Dashboard</Text>
//       <View style={styles.statsGrid}>
//         <StatCard val="₹34,000" lbl="Project Income" sub="3 active" />
//         <StatCard val="₹10,000" lbl="Client Pending" sub="School ERP" />
//         <StatCard val="₹9,000" lbl="Dev Pay Due" sub="2 developers" />
//         <StatCard val="3" lbl="Clients" sub="Active" />
//       </View>
//       <UrgentBanner text="School ERP payment ₹10,000 pending from client" />
//     </LinearGradient>
//   );

//   const renderBothHero = () => (
//     <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
//       <Text style={styles.heroGreet}>Good morning, Rahul 👋</Text>
//       <Text style={styles.heroTitle}>March Overview</Text>
//       <View style={styles.statsGrid}>
//         <StatCard val="₹8,940" lbl="Personal Spent" sub="↑ 12% vs Feb" />
//         <StatCard val="₹34,000" lbl="Project Income" sub="3 active projects" />
//         <StatCard val="₹5,650" lbl="Friends Owe You" sub="3 pending" />
//         <StatCard val="₹9,000" lbl="Dev Payments Due" sub="2 developers" />
//       </View>
//       <UrgentBanner text="School ERP payment ₹10,000 pending from client" />
//     </LinearGradient>
//   );

//   const activity = useCase === 'split'
//     ? HOME_ACTIVITY_SPLIT
//     : useCase === 'freelance'
//       ? HOME_ACTIVITY_FREELANCE
//       : HOME_ACTIVITY_BOTH;

//   return (
//     <View style={styles.container}>
//       <TopBar navigation={navigation} />
//       <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
//         {useCase === 'split' && renderSplitHero()}
//         {useCase === 'freelance' && renderFreelanceHero()}
//         {useCase === 'both' && renderBothHero()}

//         <View style={styles.body}>
//           {/* Mini charts — only for both */}
//           {useCase === 'both' && (
//             <View style={styles.miniChartsRow}>
//               <MiniChart val="₹8.9k" color={COLORS.danger} label="SPENT"
//                 bars={[28, 38, 50, 32, 65, 44, 55]} />
//               <MiniChart val="₹34k" color={COLORS.blue} label="INCOME"
//                 bars={[35, 50, 58, 46, 28, 39, 50]} />
//               <MiniChart val="3" color={COLORS.accent2} label="PROJECTS"
//                 bars={[44, 28, 40, 58, 36, 46, 32]} />
//             </View>
//           )}

//           <Text style={styles.sectionHeader}>Quick Actions</Text>
//           <View style={styles.qaGrid}>
//             {useCase === 'split' && <>
//               <QuickAction icon="➕" title="Add Expense" sub="Track spending" onPress={() => navigation.navigate('AddExpense')} />
//               <QuickAction icon="👥" title="Split with Group" sub="Divide bills" onPress={() => navigation.navigate('Groups')} />
//               <QuickAction icon="💸" title="Settle Up" sub="₹5,650 pending" onPress={() => navigation.navigate('Friends')} />
//               <QuickAction icon="🤝" title="New Group" sub="Plan a trip/flat" onPress={() => navigation.navigate('AddGroup')} />
//             </>}
//             {useCase === 'freelance' && <>
//               <QuickAction icon="💼" title="My Projects" sub="3 active" onPress={() => navigation.navigate('Projects')} />
//               <QuickAction icon="➕" title="New Project" sub="Add a project" onPress={() => navigation.navigate('AddProject')} />
//               <QuickAction icon="💸" title="Pay Developer" sub="₹9k due" onPress={() => navigation.navigate('DevPay')} />
//               <QuickAction icon="🏢" title="My Clients" sub="3 clients" onPress={() => navigation.navigate('MyClients')} />
//             </>}
//             {useCase === 'both' && <>
//               <QuickAction icon="➕" title="Add Expense" sub="Track spending" onPress={() => navigation.navigate('AddExpense')} />
//               <QuickAction icon="💼" title="My Projects" sub="3 active" onPress={() => navigation.navigate('Projects')} />
//               <QuickAction icon="🤝" title="Settle Up" sub="₹5,650 pending" onPress={() => navigation.navigate('Friends')} />
//               <QuickAction icon="💸" title="Pay Developer" sub="₹9k due" onPress={() => navigation.navigate('DevPay')} />
//             </>}
//           </View>

//           <View style={styles.activityHeader}>
//             <Text style={styles.sectionHeader}>Recent Activity</Text>
//             <Text style={styles.seeAll}>See All →</Text>
//           </View>
//           {activity.map((item, i) => (
//             <TxItem key={i} item={item} navigation={navigation} />
//           ))}
//           <View style={{ height: 20 }} />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.bg },
//   scroll: { flex: 1 },
//   hero: { padding: 18, paddingBottom: 22 },
//   heroGreet: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
//   heroTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl4, color: '#fff' },
//   statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
//   statCard: {
//     flex: 1, minWidth: '45%',
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     borderRadius: 14, padding: 12,
//   },
//   statVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
//   statLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
//   statSub: { fontFamily: FONTS.nunito.semiBold, fontSize: SIZES.sm, color: '#A7F3D0', marginTop: 4 },
//   urgentBanner: {
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     backgroundColor: 'rgba(239,68,68,0.2)',
//     borderRadius: 10, padding: 8, marginTop: 12,
//   },
//   urgentText: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.base, color: '#FEE2E2', flex: 1 },
//   body: { padding: 14 },
//   miniChartsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
//   miniChart: {
//     flex: 1, backgroundColor: COLORS.card, borderRadius: 14,
//     padding: 10, alignItems: 'center', ...SHADOWS.card,
//   },
//   miniChartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 24, marginBottom: 4 },
//   miniBar: { width: 5, borderRadius: 3 },
//   miniVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
//   miniLbl: { fontFamily: FONTS.nunito.semiBold, fontSize: SIZES.xs, color: COLORS.text2 },
//   sectionHeader: {
//     fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2,
//     color: COLORS.text2, textTransform: 'uppercase',
//     letterSpacing: 0.5, marginBottom: 10,
//   },
//   qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
//   qaBtn: {
//     width: '47.5%', backgroundColor: COLORS.card,
//     borderRadius: 14, padding: 14,
//     flexDirection: 'row', alignItems: 'center', gap: 10,
//     ...SHADOWS.card,
//   },
//   qaIcon: { fontSize: 22 },
//   qaTitle: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.text },
//   qaSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text2 },
//   activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   seeAll: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: COLORS.primary },
//   txItem: {
//     backgroundColor: COLORS.card, borderRadius: 14,
//     padding: 12, marginBottom: 8,
//     flexDirection: 'row', alignItems: 'center', gap: 12,
//     ...SHADOWS.card,
//   },
//   txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   txName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
//   txMeta: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
//   txAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg },
// });
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "../../context/AppContext";
import TopBar from "../../components/shared/TopBar";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES } from "../../theme/typography";
import { fetchDashboard } from "../../api/dashboard";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ val, lbl, sub, subColor = "#A7F3D0" }) {
    return (
        <View style={s.statCard}>
            <Text style={s.statVal}>{val}</Text>
            <Text style={s.statLbl}>{lbl}</Text>
            {sub ? (
                <Text style={[s.statSub, { color: subColor }]}>{sub}</Text>
            ) : null}
        </View>
    );
}

// ─── Urgent Alert Banner ──────────────────────────────────────────────────────
function AlertBanner({ message, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={s.alertBanner}
        >
            <Text style={{ fontSize: 16 }}>⚠️</Text>
            <Text style={s.alertTxt} numberOfLines={1}>
                {message}
            </Text>
            <Text style={s.alertArrow}>›</Text>
        </TouchableOpacity>
    );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────
function QA({ icon, title, sub, onPress }) {
    return (
        <TouchableOpacity
            style={s.qaBtn}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Text style={s.qaIcon}>{icon}</Text>
            <View>
                <Text style={s.qaTitle}>{title}</Text>
                <Text style={s.qaSub}>{sub}</Text>
            </View>
        </TouchableOpacity>
    );
}

// ─── Mini chart bars (sparkline) ─────────────────────────────────────────────
function MiniChart({ val, lbl, color, bars = [] }) {
    const maxH = Math.max(...bars, 1);
    return (
        <View style={s.miniChart}>
            <View style={s.miniChartBars}>
                {bars.map((h, i) => (
                    <View
                        key={i}
                        style={[
                            s.miniBar,
                            {
                                height: Math.round((h / maxH) * 24),
                                backgroundColor:
                                    i === bars.length - 1
                                        ? COLORS.primary
                                        : COLORS.primaryUltraLight,
                            },
                        ]}
                    />
                ))}
            </View>
            <Text style={[s.miniVal, { color }]}>{val}</Text>
            <Text style={s.miniLbl}>{lbl}</Text>
        </View>
    );
}

// ─── Recent Activity Item ─────────────────────────────────────────────────────
function ActivityItem({ item, navigation }) {
    const isPositive = item.amount >= 0;
    return (
        <TouchableOpacity
            style={s.txItem}
            onPress={() =>
                item.navigate &&
                navigation.navigate(item.navigate, item.navigateParams)
            }
            activeOpacity={0.85}
        >
            <View
                style={[
                    s.txIcon,
                    { backgroundColor: item.iconBg || "#F3F4F6" },
                ]}
            >
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={s.txName} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={s.txMeta} numberOfLines={1}>
                    {item.subtitle}
                </Text>
            </View>
            <Text
                style={[
                    s.txAmt,
                    { color: isPositive ? COLORS.primary : COLORS.danger },
                ]}
            >
                {item.amount > 0 ? "+" : item.amount < 0 ? "" : ""}₹
                {Math.abs(item.amount).toLocaleString("en-IN")}
            </Text>
        </TouchableOpacity>
    );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ width, height, style }) {
    return (
        <View
            style={[
                {
                    width,
                    height,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 8,
                },
                style,
            ]}
        />
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
    const { useCase, user } = useAppContext();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError("");
        const res = await fetchDashboard();
        if (res.ok) setData(res.data);
        else setError(res.message);
        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        load();
    }, []);

    // ── Derived data (safe fallbacks) ─────────────────────────────────────────
    const personal = data?.personal || {};
    const friends = data?.friends || {};
    const groups = data?.groups || {};
    const projects = data?.projects || {};
    const activity = data?.recentActivity || [];
    const alerts = data?.urgentAlerts || [];

    const firstName = user?.name?.split(" ")[0] || "there";
    const monthLabel = personal.monthLabel || "This Month";

    // Quick actions per use-case
    const qaItems = {
        split: [
            {
                icon: "➕",
                title: "Add Expense",
                sub: "Track spending",
                onPress: () => navigation.navigate("AddExpense"),
            },
            {
                icon: "👥",
                title: "Split with Group",
                sub: "Divide bills",
                onPress: () => navigation.navigate("Groups"),
            },
            {
                icon: "💸",
                title: "Settle Up",
                sub:
                    friends.youOwe > 0
                        ? `₹${friends.youOwe?.toLocaleString("en-IN")} pending`
                        : "All settled",
                onPress: () => navigation.navigate("Friends"),
            },
            {
                icon: "🤝",
                title: "New Group",
                sub: "Plan a trip/flat",
                onPress: () => navigation.navigate("AddGroup"),
            },
        ],
        freelance: [
            {
                icon: "💼",
                title: "My Projects",
                sub: `${projects.activeCount || 0} active`,
                onPress: () => navigation.navigate("Projects"),
            },
            {
                icon: "➕",
                title: "New Project",
                sub: "Add a project",
                onPress: () => navigation.navigate("AddProject"),
            },
            {
                icon: "💸",
                title: "Pay Developer",
                sub:
                    projects.devPaymentsDue > 0
                        ? `₹${(projects.devPaymentsDue / 1000).toFixed(0)}k due`
                        : "All paid",
                onPress: () => navigation.navigate("DevPay"),
            },
            {
                icon: "🏢",
                title: "My Clients",
                sub: "Manage clients",
                onPress: () => navigation.navigate("MyClients"),
            },
        ],
        both: [
            {
                icon: "➕",
                title: "Add Expense",
                sub: "Track spending",
                onPress: () => navigation.navigate("AddExpense"),
            },
            {
                icon: "💼",
                title: "My Projects",
                sub: `${projects.activeCount || 0} active`,
                onPress: () => navigation.navigate("Projects"),
            },
            {
                icon: "🤝",
                title: "Settle Up",
                sub:
                    friends.owedToYou > 0
                        ? `₹${friends.owedToYou?.toLocaleString("en-IN")} owed`
                        : "Track balances",
                onPress: () => navigation.navigate("Friends"),
            },
            {
                icon: "💸",
                title: "Pay Developer",
                sub:
                    projects.devPaymentsDue > 0
                        ? `₹${(projects.devPaymentsDue / 1000).toFixed(0)}k due`
                        : "Manage devs",
                onPress: () => navigation.navigate("DevPay"),
            },
        ],
    };

    const currentQA = qaItems[useCase] || qaItems.both;

    // Hero gradient per use-case
    const heroColors =
        useCase === "freelance" ? COLORS.gradientBlue : COLORS.gradientGreen;

    // Hero stats per use-case
    const heroStats = {
        split: [
            {
                val: `₹${(personal.totalSpent || 0).toLocaleString("en-IN")}`,
                lbl: "Personal Spent",
                sub: personal.vsLastMonth
                    ? `${personal.vsLastMonth > 0 ? "↑" : "↓"} ${Math.abs(personal.vsLastMonth)}% vs last month`
                    : "",
            },
            {
                val: `₹${(friends.owedToYou || 0).toLocaleString("en-IN")}`,
                lbl: "Friends Owe You",
                sub: `${friends.pendingCount || 0} pending`,
            },
            {
                val: `₹${(friends.youOwe || 0).toLocaleString("en-IN")}`,
                lbl: "You Owe Friends",
                sub: "",
            },
            {
                val: String(groups.activeCount || 0),
                lbl: "Active Groups",
                sub: groups.totalExpenses
                    ? `${groups.totalExpenses} expenses`
                    : "",
            },
        ],
        freelance: [
            {
                val: `₹${(projects.totalReceived || 0).toLocaleString("en-IN")}`,
                lbl: "Project Income",
                sub: `${projects.activeCount || 0} active`,
            },
            {
                val: `₹${(projects.totalPending || 0).toLocaleString("en-IN")}`,
                lbl: "Client Pending",
                sub: "",
            },
            {
                val: `₹${(projects.devPaymentsDue || 0).toLocaleString("en-IN")}`,
                lbl: "Dev Pay Due",
                sub: "",
            },
            {
                val: String(projects.activeCount || 0),
                lbl: "Active Projects",
                sub: "",
            },
        ],
        both: [
            {
                val: `₹${(personal.totalSpent || 0).toLocaleString("en-IN")}`,
                lbl: "Personal Spent",
                sub: personal.vsLastMonth
                    ? `${personal.vsLastMonth > 0 ? "↑" : "↓"} ${Math.abs(personal.vsLastMonth)}% vs last`
                    : "",
            },
            {
                val: `₹${(projects.totalReceived || 0).toLocaleString("en-IN")}`,
                lbl: "Project Income",
                sub: `${projects.activeCount || 0} active`,
            },
            {
                val: `₹${(friends.owedToYou || 0).toLocaleString("en-IN")}`,
                lbl: "Friends Owe You",
                sub: `${friends.pendingCount || 0} pending`,
            },
            {
                val: `₹${(projects.devPaymentsDue || 0).toLocaleString("en-IN")}`,
                lbl: "Dev Payments Due",
                sub: "",
            },
        ],
    };

    const currentStats = heroStats[useCase] || heroStats.both;

    // Mini charts for "both" mode
    const miniCharts = [
        {
            val: `₹${((personal.totalSpent || 0) / 1000).toFixed(1)}k`,
            lbl: "SPENT",
            color: COLORS.danger,
            bars: personal.weeklyBars || [3, 4, 5, 3, 7, 4, 6],
        },
        {
            val: `₹${((projects.totalReceived || 0) / 1000).toFixed(1)}k`,
            lbl: "INCOME",
            color: "#2563eb",
            bars: projects.weeklyBars || [5, 7, 8, 6, 4, 5, 7],
        },
        {
            val: String(projects.activeCount || 0),
            lbl: "PROJECTS",
            color: COLORS.accent2,
            bars: [2, 3, 2, 4, 3, 3, 3],
        },
    ];

    return (
        <View style={s.container}>
            <TopBar navigation={navigation} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => load(true)}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* ── Hero ─────────────────────────────────────────────────── */}
                <LinearGradient
                    colors={heroColors}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.hero}
                >
                    <Text style={s.heroGreet}>
                        Good morning, {firstName} 👋
                    </Text>
                    <Text style={s.heroTitle}>{monthLabel} Overview</Text>

                    {/* Skeleton or stats */}
                    {loading ? (
                        <View style={s.statsGrid}>
                            {[0, 1, 2, 3].map((i) => (
                                <View
                                    key={i}
                                    style={[
                                        s.statCard,
                                        { justifyContent: "center", gap: 6 },
                                    ]}
                                >
                                    <Skeleton width={70} height={20} />
                                    <Skeleton width={50} height={10} />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={s.statsGrid}>
                            {currentStats.map((st) => (
                                <StatCard
                                    key={st.lbl}
                                    val={st.val}
                                    lbl={st.lbl}
                                    sub={st.sub}
                                />
                            ))}
                        </View>
                    )}

                    {/* Urgent alerts */}
                    {!loading && alerts.length > 0 && (
                        <AlertBanner
                            message={alerts[0].message}
                            onPress={() =>
                                alerts[0].navigate &&
                                navigation.navigate(
                                    alerts[0].navigate,
                                    alerts[0].navigateParams,
                                )
                            }
                        />
                    )}
                    {!loading && !error && alerts.length === 0 && data && (
                        <View
                            style={[
                                s.alertBanner,
                                { backgroundColor: "rgba(16,185,129,0.2)" },
                            ]}
                        >
                            <Text style={{ fontSize: 14 }}>✅</Text>
                            <Text style={[s.alertTxt, { color: "#A7F3D0" }]}>
                                All caught up! No pending actions.
                            </Text>
                        </View>
                    )}
                </LinearGradient>

                <View style={s.body}>
                    {/* ── Error state ───────────────────────────────────────── */}
                    {!loading && !!error && (
                        <View style={s.errorCard}>
                            <Text style={{ fontSize: 28 }}>⚠️</Text>
                            <Text style={s.errorTitle}>
                                Couldn't load dashboard
                            </Text>
                            <Text style={s.errorMsg}>{error}</Text>
                            <TouchableOpacity
                                style={s.retryBtn}
                                onPress={() => load()}
                            >
                                <Text style={s.retryTxt}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ── Mini charts (both mode only) ──────────────────────── */}
                    {useCase === "both" && !loading && (
                        <View style={s.miniChartsRow}>
                            {miniCharts.map((c) => (
                                <MiniChart
                                    key={c.lbl}
                                    val={c.val}
                                    lbl={c.lbl}
                                    color={c.color}
                                    bars={c.bars}
                                />
                            ))}
                        </View>
                    )}

                    {/* ── Quick Actions ─────────────────────────────────────── */}
                    <Text style={s.sectionHdr}>Quick Actions</Text>
                    <View style={s.qaGrid}>
                        {currentQA.map((q) => (
                            <QA
                                key={q.title}
                                icon={q.icon}
                                title={q.title}
                                sub={q.sub}
                                onPress={q.onPress}
                            />
                        ))}
                    </View>

                    {/* ── Recent Activity ───────────────────────────────────── */}
                    <View style={s.activityHeader}>
                        <Text style={s.sectionHdr}>Recent Activity</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Expenses")}
                        >
                            <Text style={s.seeAll}>See All →</Text>
                        </TouchableOpacity>
                    </View>

                    {loading && (
                        <View style={{ gap: 8 }}>
                            {[0, 1, 2, 3].map((i) => (
                                <View
                                    key={i}
                                    style={[
                                        s.txItem,
                                        { justifyContent: "space-between" },
                                    ]}
                                >
                                    <View
                                        style={[
                                            s.txIcon,
                                            { backgroundColor: "#F3F4F6" },
                                        ]}
                                    />
                                    <View
                                        style={{
                                            flex: 1,
                                            gap: 6,
                                            marginLeft: 12,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 140,
                                                height: 12,
                                                backgroundColor: "#F3F4F6",
                                                borderRadius: 6,
                                            }}
                                        />
                                        <View
                                            style={{
                                                width: 100,
                                                height: 10,
                                                backgroundColor: "#F3F4F6",
                                                borderRadius: 6,
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            width: 60,
                                            height: 14,
                                            backgroundColor: "#F3F4F6",
                                            borderRadius: 6,
                                        }}
                                    />
                                </View>
                            ))}
                        </View>
                    )}

                    {!loading && activity.length === 0 && !error && (
                        <View style={s.emptyActivity}>
                            <Text style={{ fontSize: 32 }}>📋</Text>
                            <Text style={s.emptyTxt}>
                                No recent activity yet
                            </Text>
                            <Text style={s.emptySubTxt}>
                                Add an expense or project to get started
                            </Text>
                        </View>
                    )}

                    {!loading &&
                        activity.map((item, i) => (
                            <ActivityItem
                                key={item.id || i}
                                item={item}
                                navigation={navigation}
                            />
                        ))}

                    <View style={{ height: 20 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    hero: { padding: 18, paddingBottom: 22 },
    heroGreet: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 4,
    },
    heroTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl4,
        color: "#fff",
        marginBottom: 14,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        minWidth: "45%",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 14,
        padding: 12,
    },
    statVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    statLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    statSub: {
        fontFamily: FONTS.nunito.semiBold,
        fontSize: SIZES.sm,
        marginTop: 4,
    },
    alertBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(239,68,68,0.2)",
        borderRadius: 10,
        padding: 10,
        marginTop: 4,
    },
    alertTxt: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.base,
        color: "#FEE2E2",
        flex: 1,
    },
    alertArrow: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.lg,
        color: "#FEE2E2",
    },
    body: { padding: 14 },
    errorCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 24,
        alignItems: "center",
        gap: 8,
        ...SHADOWS.card,
        marginBottom: 12,
    },
    errorTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
    },
    errorMsg: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        textAlign: "center",
    },
    retryBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    retryTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    miniChartsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
    miniChart: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 10,
        alignItems: "center",
        ...SHADOWS.card,
    },
    miniChartBars: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 2,
        height: 24,
        marginBottom: 4,
    },
    miniBar: { width: 5, borderRadius: 3 },
    miniVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
    miniLbl: {
        fontFamily: FONTS.nunito.semiBold,
        fontSize: SIZES.xs,
        color: COLORS.text2,
        marginTop: 1,
    },
    sectionHdr: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    qaGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 14,
    },
    qaBtn: {
        width: "47.5%",
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        ...SHADOWS.card,
    },
    qaIcon: { fontSize: 22 },
    qaTitle: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text,
    },
    qaSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text2,
    },
    activityHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    seeAll: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.primary,
    },
    txItem: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 12,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        ...SHADOWS.card,
    },
    txIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    txName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    txMeta: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 2,
    },
    txAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg },
    emptyActivity: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 28,
        alignItems: "center",
        gap: 8,
        ...SHADOWS.card,
    },
    emptyTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
    },
    emptySubTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        textAlign: "center",
    },
});
