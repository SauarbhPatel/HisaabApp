// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Svg, { Circle, Text as SvgText } from 'react-native-svg';
// import TopBar from '../../components/shared/TopBar';
// import { FilterChipRow } from '../../components/shared/FilterChip';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import { FONTS, SIZES, RADIUS } from '../../theme/typography';
// import { useAppContext } from '../../context/AppContext';

// const PERIOD_FILTERS = ['This Month', 'Last 3 Months', 'This Year', 'Custom'];

// function DonutChart() {
//   const R = 38, cx = 50, cy = 50, strokeW = 16;
//   const circ = 2 * Math.PI * R;
//   const segments = [
//     { pct: 0.36, color: COLORS.primary, offset: 0 },
//     { pct: 0.27, color: COLORS.accent2, offset: 0.36 * circ },
//     { pct: 0.21, color: COLORS.accent, offset: (0.36 + 0.27) * circ },
//     { pct: 0.16, color: '#E5E7EB', offset: (0.36 + 0.27 + 0.21) * circ },
//   ];
//   return (
//     <Svg width={100} height={100} viewBox="0 0 100 100">
//       <Circle cx={cx} cy={cy} r={R} fill="none" stroke="#F3F4F6" strokeWidth={strokeW} />
//       {segments.map((s, i) => (
//         <Circle
//           key={i} cx={cx} cy={cy} r={R} fill="none"
//           stroke={s.color} strokeWidth={strokeW}
//           strokeDasharray={`${s.pct * circ} ${circ}`}
//           strokeDashoffset={-s.offset}
//           transform={`rotate(-90 ${cx} ${cy})`}
//         />
//       ))}
//       <SvgText x="50" y="46" textAnchor="middle" fontWeight="900" fontSize="12" fill={COLORS.text}>₹8.9k</SvgText>
//       <SvgText x="50" y="58" textAnchor="middle" fontSize="8" fill={COLORS.text2}>SPENT</SvgText>
//     </Svg>
//   );
// }

// function HBar({ label, val, pct, color }) {
//   return (
//     <View style={styles.hBar}>
//       <View style={styles.hBarHeader}>
//         <Text style={styles.hBarLabel}>{label}</Text>
//         <Text style={styles.hBarVal}>{val}</Text>
//       </View>
//       <View style={styles.hBarTrack}>
//         <View style={[styles.hBarFill, { width: `${pct}%`, backgroundColor: color }]} />
//       </View>
//     </View>
//   );
// }

// function SettleRow({ label, val, valColor }) {
//   return (
//     <View style={styles.settleRow}>
//       <Text style={styles.settleLabel}>{label}</Text>
//       <Text style={[styles.settleVal, { color: valColor || COLORS.text }]}>{val}</Text>
//     </View>
//   );
// }

// export default function ReportsScreen({ navigation }) {
//   const { useCase } = useAppContext();
//   const [period, setPeriod] = useState('This Month');

//   const renderSplit = () => (
//     <>
//       <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
//         <Text style={styles.heroTitle}>📊 My Reports</Text>
//         <View style={styles.heroStats}>
//           <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹8,940</Text><Text style={styles.heroStatLbl}>Total Spent</Text></View>
//           <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹5,440</Text><Text style={styles.heroStatLbl}>Owed to You</Text></View>
//         </View>
//       </LinearGradient>
//       <View style={styles.body}>
//         <FilterChipRow chips={['This Month', 'Last 3 Months', 'This Year']} activeChip={period} onSelect={setPeriod} style={{ marginHorizontal: -14, marginBottom: 8 }} />
//         <View style={styles.card}>
//           <Text style={styles.sectionHeader}>Spending Breakdown</Text>
//           <View style={styles.donutRow}>
//             <DonutChart />
//             <View style={styles.legend}>
//               {[{ color: COLORS.primary, label: 'Food & Drinks', val: '₹3,200' }, { color: COLORS.accent2, label: 'Bills', val: '₹2,400' }, { color: COLORS.accent, label: 'Travel', val: '₹1,850' }, { color: '#E5E7EB', label: 'Others', val: '₹1,490' }].map((l) => (
//                 <View key={l.label} style={styles.legendRow}>
//                   <View style={[styles.legendDot, { backgroundColor: l.color }]} />
//                   <Text style={styles.legendLabel}>{l.label}</Text>
//                   <Text style={styles.legendVal}>{l.val}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.sectionHeader}>👥 Friends Summary</Text>
//           <SettleRow label="Total friends owe you" val="₹5,440" valColor={COLORS.primary} />
//           <SettleRow label="You owe friends" val="₹3,200" valColor={COLORS.danger} />
//           <SettleRow label="Net balance" val="+₹2,240" valColor={COLORS.primary} />
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.sectionHeader}>Spending by Category</Text>
//           <HBar label="🍕 Food" val="₹3,200" pct={68} color={COLORS.primary} />
//           <HBar label="⚡ Bills" val="₹2,400" pct={51} color={COLORS.accent2} />
//           <HBar label="🚌 Travel" val="₹1,850" pct={39} color={COLORS.accent} />
//           <HBar label="🎬 Fun" val="₹900" pct={19} color={COLORS.danger} />
//         </View>
//       </View>
//     </>
//   );

//   const renderFreelance = () => (
//     <>
//       <LinearGradient colors={COLORS.gradientBlue} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
//         <Text style={styles.heroTitle}>📊 Project Reports</Text>
//         <View style={styles.heroStats}>
//           <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹34,000</Text><Text style={styles.heroStatLbl}>Income</Text></View>
//           <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹8,500</Text><Text style={styles.heroStatLbl}>Dev Paid</Text></View>
//         </View>
//       </LinearGradient>
//       <View style={styles.body}>
//         <FilterChipRow chips={['This Month', 'Last 3 Months', 'This Year']} activeChip={period} onSelect={setPeriod} style={{ marginHorizontal: -14, marginBottom: 8 }} />
//         <LinearGradient colors={COLORS.gradientBlue} style={[styles.card, { padding: 14 }]}>
//           <Text style={[styles.sectionHeader, { color: 'rgba(255,255,255,0.7)' }]}>Project Income — March</Text>
//           {[['School ERP (March)', '₹10,000'], ['Flatshare Karo (Dev)', '₹7,000'], ['QR Park Update', '₹500']].map(([l, v]) => (
//             <View key={l} style={styles.incomeRow}>
//               <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md }}>{l}</Text>
//               <Text style={{ color: '#fff', fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md }}>{v}</Text>
//             </View>
//           ))}
//           <View style={[styles.incomeRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 8 }]}>
//             <Text style={{ color: '#fff', fontFamily: FONTS.nunito.bold, fontSize: SIZES.md }}>Total</Text>
//             <Text style={{ color: '#fff', fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 }}>₹34,000</Text>
//           </View>
//         </LinearGradient>
//         <View style={styles.card}>
//           <Text style={styles.sectionHeader}>Income by Client</Text>
//           <HBar label="🟢 School ERP" val="₹12,500" pct={70} color="#2563eb" />
//           <HBar label="🟡 Flatshare" val="₹11,000" pct={55} color={COLORS.accent2} />
//           <HBar label="🟣 Maksoft" val="₹5,500" pct={27} color="#ba7517" />
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.sectionHeader}>💸 Profit Analysis</Text>
//           <SettleRow label="Total Income" val="₹34,000" valColor={COLORS.primary} />
//           <SettleRow label="Developer Payments" val="−₹8,500" valColor={COLORS.danger} />
//           <SettleRow label="Net Profit" val="₹25,500" valColor={COLORS.primary} />
//         </View>
//       </View>
//     </>
//   );

//   const renderBoth = () => (
//     <>
//       <LinearGradient colors={['#1e3a5f', '#1a7a5e']} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
//         <Text style={styles.heroTitle}>📊 Reports</Text>
//         <View style={styles.heroStats}>
//           <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹8,940</Text><Text style={styles.heroStatLbl}>Total Spent · March</Text></View>
//           <View style={styles.heroStat}><Text style={styles.heroStatVal}>₹34,000</Text><Text style={styles.heroStatLbl}>Project Income</Text></View>
//         </View>
//       </LinearGradient>
//       <View style={styles.body}>
//         <FilterChipRow chips={PERIOD_FILTERS} activeChip={period} onSelect={setPeriod} style={{ marginHorizontal: -14, marginBottom: 8 }} />
//         <View style={styles.card}>
//           <Text style={styles.sectionHeader}>Spending Breakdown</Text>
//           <View style={styles.donutRow}><DonutChart /><View style={styles.legend}>
//             {[{ color: COLORS.primary, label: 'Food & Drinks', val: '₹3,200' }, { color: COLORS.accent2, label: 'Bills', val: '₹2,400' }, { color: COLORS.accent, label: 'Travel', val: '₹1,850' }, { color: '#E5E7EB', label: 'Others', val: '₹1,490' }].map((l) => (
//               <View key={l.label} style={styles.legendRow}>
//                 <View style={[styles.legendDot, { backgroundColor: l.color }]} />
//                 <Text style={styles.legendLabel}>{l.label}</Text>
//                 <Text style={styles.legendVal}>{l.val}</Text>
//               </View>
//             ))}
//           </View></View>
//         </View>
//         <LinearGradient colors={COLORS.gradientBlue} style={[styles.card, { padding: 14 }]}>
//           <Text style={[styles.sectionHeader, { color: 'rgba(255,255,255,0.7)' }]}>Project Income — March</Text>
//           {[['School ERP (March)', '₹10,000'], ['Flatshare Karo (Dev)', '₹7,000']].map(([l, v]) => (
//             <View key={l} style={styles.incomeRow}>
//               <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md }}>{l}</Text>
//               <Text style={{ color: '#fff', fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md }}>{v}</Text>
//             </View>
//           ))}
//           <View style={[styles.incomeRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 8 }]}>
//             <Text style={{ color: '#fff', fontFamily: FONTS.nunito.bold, fontSize: SIZES.md }}>Total Received</Text>
//             <Text style={{ color: '#fff', fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 }}>₹34,000</Text>
//           </View>
//         </LinearGradient>
//         <View style={styles.card}>
//           <Text style={styles.sectionHeader}>Spending by Category</Text>
//           <HBar label="🍕 Food" val="₹3,200" pct={68} color={COLORS.primary} />
//           <HBar label="⚡ Bills" val="₹2,400" pct={51} color={COLORS.accent2} />
//           <HBar label="🚌 Travel" val="₹1,850" pct={39} color={COLORS.accent} />
//           <HBar label="🎬 Entertainment" val="₹900" pct={19} color={COLORS.danger} />
//         </View>
//       </View>
//     </>
//   );

//   return (
//     <View style={styles.container}>
//       <TopBar navigation={navigation} />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {useCase === 'split' && renderSplit()}
//         {useCase === 'freelance' && renderFreelance()}
//         {useCase === 'both' && renderBoth()}
//         <View style={{ height: 20 }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.bg },
//   hero: { padding: 18, paddingBottom: 20 },
//   heroTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
//   heroStats: { flexDirection: 'row', gap: 10, marginTop: 12 },
//   heroStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10 },
//   heroStatVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
//   heroStatLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
//   body: { padding: 14 },
//   card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 12, ...SHADOWS.card },
//   sectionHeader: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
//   donutRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
//   legend: { flex: 1 },
//   legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 },
//   legendDot: { width: 8, height: 8, borderRadius: 2 },
//   legendLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2, flex: 1 },
//   legendVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
//   hBar: { marginBottom: 12 },
//   hBarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
//   hBarLabel: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.base, color: COLORS.text },
//   hBarVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base, color: COLORS.text },
//   hBarTrack: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
//   hBarFill: { height: '100%', borderRadius: 99 },
//   settleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
//   settleLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
//   settleVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
//   incomeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
// });

import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import TopBar from "../../components/shared/TopBar";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import { useAppContext } from "../../context/AppContext";
import {
    fetchReportSummary,
    formatDateInput,
    displayToISO,
    isValidDate,
    isoToReadable,
    PERIOD_MAP,
    CATEGORY_META,
} from "../../api/reports";

// ─── Period chip labels ───────────────────────────────────────────────────────
const PERIODS = ["This Month", "Last 3 Months", "This Year", "Custom"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
    return `₹${(n || 0).toLocaleString("en-IN")}`;
}
function pct(part, total) {
    return total > 0 ? Math.round((part / total) * 100) : 0;
}

// ─── Donut chart (live data) ──────────────────────────────────────────────────
function DonutChart({ segments = [], centerVal = "", centerLbl = "SPENT" }) {
    const R = 38,
        cx = 50,
        cy = 50,
        sw = 16;
    const circ = 2 * Math.PI * R;
    let offset = 0;
    const segs = segments?.filter((s) => s?.pct > 0);
    if (!segs?.length) segs?.push({ pct: 1, color: "#F3F4F6" });
    return (
        <Svg width={100} height={100} viewBox="0 0 100 100">
            <Circle
                cx={cx}
                cy={cy}
                r={R}
                fill="none"
                stroke="#F3F4F6"
                strokeWidth={sw}
            />
            {segs.map((s, i) => {
                const dash = `${s.pct * circ} ${circ}`;
                const off = -offset;
                offset += s.pct * circ;
                return (
                    <Circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={R}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={sw}
                        strokeDasharray={dash}
                        strokeDashoffset={off}
                        transform={`rotate(-90 ${cx} ${cy})`}
                    />
                );
            })}
            <SvgText
                x="50"
                y="47"
                textAnchor="middle"
                fontWeight="900"
                fontSize="12"
                fill={COLORS.text}
            >
                {centerVal}
            </SvgText>
            <SvgText
                x="50"
                y="59"
                textAnchor="middle"
                fontSize="8"
                fill={COLORS.text2}
            >
                {centerLbl}
            </SvgText>
        </Svg>
    );
}

// ─── Horizontal bar ───────────────────────────────────────────────────────────
function HBar({ icon, label, val, pctVal, color }) {
    return (
        <View style={s.hBar}>
            <View style={s.hBarHeader}>
                <Text style={s.hBarLabel}>
                    {icon} {label}
                </Text>
                <Text style={s.hBarVal}>{fmt(val)}</Text>
            </View>
            <View style={s.hBarTrack}>
                <View
                    style={[
                        s.hBarFill,
                        {
                            width: `${Math.min(100, pctVal)}%`,
                            backgroundColor: color,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

// ─── Settle row ───────────────────────────────────────────────────────────────
function SRow({ label, val, valColor, last }) {
    return (
        <View style={[s.settleRow, last && { borderBottomWidth: 0 }]}>
            <Text style={s.settleLabel}>{label}</Text>
            <Text style={[s.settleVal, { color: valColor || COLORS.text }]}>
                {val}
            </Text>
        </View>
    );
}

// ─── Custom date picker ───────────────────────────────────────────────────────
function CustomDatePicker({ from, to, onFromChange, onToChange, error }) {
    return (
        <View style={s.customDateBox}>
            <Text style={s.customDateTitle}>📅 Custom Date Range</Text>
            <View style={s.customDateRow}>
                <View style={{ flex: 1 }}>
                    <Text style={s.customDateLbl}>From</Text>
                    <View
                        style={[
                            s.customDateInput,
                            error && s.customDateInputErr,
                        ]}
                    >
                        <Text style={s.customDateIcon}>📅</Text>
                        <TextInput
                            style={s.customDateTxt}
                            value={from}
                            onChangeText={(v) =>
                                onFromChange(formatDateInput(v))
                            }
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor={COLORS.text3}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                    </View>
                </View>
                <Text style={s.customDateArrow}>→</Text>
                <View style={{ flex: 1 }}>
                    <Text style={s.customDateLbl}>To</Text>
                    <View
                        style={[
                            s.customDateInput,
                            error && s.customDateInputErr,
                        ]}
                    >
                        <Text style={s.customDateIcon}>🏁</Text>
                        <TextInput
                            style={s.customDateTxt}
                            value={to}
                            onChangeText={(v) => onToChange(formatDateInput(v))}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor={COLORS.text3}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                    </View>
                </View>
            </View>
            {error ? (
                <Text style={s.customDateError}>⚠️ {error}</Text>
            ) : from && to && isValidDate(from) && isValidDate(to) ? (
                <Text style={s.customDateValid}>
                    ✅ {isoToReadable(displayToISO(from))} →{" "}
                    {isoToReadable(displayToISO(to))}
                </Text>
            ) : null}
        </View>
    );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ h = 16, w = "100%", mb = 8, radius = 8 }) {
    return (
        <View
            style={{
                height: h,
                width: w,
                backgroundColor: "#E5E7EB",
                borderRadius: radius,
                marginBottom: mb,
            }}
        />
    );
}
function CardSkeleton() {
    return (
        <View style={[s.card, { gap: 10, padding: 16 }]}>
            <Skeleton h={14} w="50%" />
            <Skeleton h={60} />
            <Skeleton h={10} w="70%" />
            <Skeleton h={10} w="55%" />
        </View>
    );
}
const safeArray = (val) => (Array.isArray(val) ? val : []);
const safeObject = (val) => (val && typeof val === "object" ? val : {});

// ══════════════════════════════════════════════════════════════════════════════
export default function ReportsScreen({ navigation }) {
    const { useCase } = useAppContext();

    const [period, setPeriod] = useState("This Month");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [customErr, setCustomErr] = useState("");

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // ── Validate custom range and load ───────────────────────────────────────
    const load = useCallback(
        async (showRefresh = false) => {
            if (period === "Custom") {
                if (!customFrom || !customTo) return; // wait for both
                if (!isValidDate(customFrom)) {
                    setCustomErr('Invalid "From" date.');
                    return;
                }
                if (!isValidDate(customTo)) {
                    setCustomErr('Invalid "To" date.');
                    return;
                }
                const f = new Date(displayToISO(customFrom));
                const t = new Date(displayToISO(customTo));
                if (f > t) {
                    setCustomErr('"From" must be before "To".');
                    return;
                }
                setCustomErr("");
            }

            if (showRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            // Map period → API param (custom uses 'month' as fallback; backend will filter)
            const apiPeriod = PERIOD_MAP[period] || "month";
            const res = await fetchReportSummary(apiPeriod);

            console.log("Report response:", res);
            if (res.ok) setReport(res.data.report);
            else setError(res.message);

            setLoading(false);
            setRefreshing(false);
        },
        [period, customFrom, customTo],
    );

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    // Auto-reload when custom dates are fully valid
    useEffect(() => {
        if (
            period === "Custom" &&
            isValidDate(customFrom) &&
            isValidDate(customTo)
        ) {
            const f = new Date(displayToISO(customFrom));
            const t = new Date(displayToISO(customTo));
            if (f <= t) {
                setCustomErr("");
                load();
            }
        }
    }, [customFrom, customTo]);

    // ── Period chip selector ──────────────────────────────────────────────────
    const PeriodChips = () => (
        <View style={s.periodRow}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.periodChips}
            >
                {PERIODS.map((p) => (
                    <TouchableOpacity
                        key={p}
                        onPress={() => {
                            setPeriod(p);
                            setCustomErr("");
                        }}
                        style={[s.chip, period === p && s.chipActive]}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[s.chipTxt, period === p && s.chipTxtActive]}
                        >
                            {p}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    // ── Spend data from report ────────────────────────────────────────────────
    const splitData = report?.split;
    const freeData = report?.freelance;
    const totalSpent = splitData?.totalSpent || 0;
    const topCats = safeArray(splitData?.topCategories);
    const byCategory = safeObject(splitData?.byCategory);
    const friends = safeObject(splitData?.friends);
    const totalIncome = freeData?.totalIncome || 0;
    const totalDevPaid = freeData?.totalDevPaid || 0;
    const netProfit = freeData?.netProfit || 0;
    const incomeByClient = safeArray(freeData?.incomeByClient);
    const projectList = safeArray(freeData?.projectIncomeList);

    // Donut segments from topCats
    const donutSegs = topCats.map((cat) => ({
        pct: totalSpent > 0 ? cat.total / totalSpent : 0,
        color: CATEGORY_META[cat?.category]?.color || "#9CA3AF",
    }));

    // Income by client max for bar pct
    const maxClientIncome =
        incomeByClient.length > 0
            ? Math.max(...incomeByClient.map((c) => c.total))
            : 1;

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
                {/* ── Split Hero ── */}
                {useCase === "split" && (
                    <LinearGradient
                        colors={COLORS.gradientGreen}
                        start={{ x: 0.13, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.hero}
                    >
                        <Text style={s.heroTitle}>📊 My Reports</Text>
                        <View style={s.heroStats}>
                            <View style={s.heroStat}>
                                <Text style={s.heroStatVal}>
                                    {loading ? "..." : fmt(totalSpent)}
                                </Text>
                                <Text style={s.heroStatLbl}>Total Spent</Text>
                            </View>
                            <View style={s.heroStat}>
                                <Text style={s.heroStatVal}>
                                    {loading ? "..." : fmt(friends.owedToYou)}
                                </Text>
                                <Text style={s.heroStatLbl}>Owed to You</Text>
                            </View>
                        </View>
                    </LinearGradient>
                )}

                {/* ── Freelance Hero ── */}
                {useCase === "freelance" && (
                    <LinearGradient
                        colors={COLORS.gradientBlue}
                        start={{ x: 0.13, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.hero}
                    >
                        <Text style={s.heroTitle}>📊 Project Reports</Text>
                        <View style={s.heroStats}>
                            <View style={s.heroStat}>
                                <Text style={s.heroStatVal}>
                                    {loading ? "..." : fmt(totalIncome)}
                                </Text>
                                <Text style={s.heroStatLbl}>Income</Text>
                            </View>
                            <View style={s.heroStat}>
                                <Text style={s.heroStatVal}>
                                    {loading ? "..." : fmt(totalDevPaid)}
                                </Text>
                                <Text style={s.heroStatLbl}>Dev Paid</Text>
                            </View>
                        </View>
                    </LinearGradient>
                )}

                {/* ── Both Hero ── */}
                {useCase === "both" && (
                    <LinearGradient
                        colors={["#1e3a5f", COLORS.accent2]}
                        start={{ x: 0.13, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.hero}
                    >
                        <Text style={s.heroTitle}>📊 Reports</Text>
                        <View style={s.heroStats}>
                            <View style={s.heroStat}>
                                <Text style={s.heroStatVal}>
                                    {loading ? "..." : fmt(totalSpent)}
                                </Text>
                                <Text style={s.heroStatLbl}>Total Spent</Text>
                            </View>
                            <View style={s.heroStat}>
                                <Text style={s.heroStatVal}>
                                    {loading ? "..." : fmt(totalIncome)}
                                </Text>
                                <Text style={s.heroStatLbl}>
                                    Project Income
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                )}

                <View style={s.body}>
                    {/* Period filter chips */}
                    <PeriodChips />

                    {/* Custom date picker */}
                    {period === "Custom" && (
                        <CustomDatePicker
                            from={customFrom}
                            to={customTo}
                            onFromChange={setCustomFrom}
                            onToChange={setCustomTo}
                            error={customErr}
                        />
                    )}

                    {/* API error */}
                    {!!error && (
                        <View style={s.errBox}>
                            <Text style={s.errTxt}>⚠️ {error}</Text>
                            <TouchableOpacity
                                onPress={() => load()}
                                style={s.retryBtn}
                            >
                                <Text style={s.retryTxt}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ══ LOADING skeletons ══ */}
                    {loading && !error && (
                        <>
                            <CardSkeleton />
                            <CardSkeleton />
                        </>
                    )}

                    {/* ══ SPLIT / BOTH — Spending ══ */}
                    {!loading &&
                        !error &&
                        (useCase === "split" || useCase === "both") &&
                        !!splitData && (
                            <>
                                {/* Donut chart card */}
                                <View style={s.card}>
                                    <Text style={s.sectionHeader}>
                                        Spending Breakdown
                                    </Text>
                                    <View style={s.donutRow}>
                                        <DonutChart
                                            segments={donutSegs}
                                            centerVal={
                                                totalSpent >= 1000
                                                    ? `₹${(totalSpent / 1000).toFixed(0)}k`
                                                    : fmt(totalSpent)
                                            }
                                            centerLbl="SPENT"
                                        />
                                        <View style={s.legend}>
                                            {topCats?.map((cat, i) => (
                                                <View
                                                    key={cat.category}
                                                    style={s.legendRow}
                                                >
                                                    <View
                                                        style={[
                                                            s.legendDot,
                                                            {
                                                                backgroundColor:
                                                                    CATEGORY_META[
                                                                        cat
                                                                            ?.category
                                                                    ]?.color ||
                                                                    "#9CA3AF",
                                                            },
                                                        ]}
                                                    />
                                                    <Text style={s.legendLabel}>
                                                        {cat.label}
                                                    </Text>
                                                    <Text style={s.legendVal}>
                                                        {fmt(cat.total)}
                                                    </Text>
                                                </View>
                                            ))}
                                            {topCats.length === 0 && (
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            FONTS.dmSans
                                                                .regular,
                                                        fontSize: SIZES.base,
                                                        color: COLORS.text3,
                                                    }}
                                                >
                                                    No expenses this period.
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                {/* Friends summary */}
                                <View style={s.card}>
                                    <Text style={s.sectionHeader}>
                                        👥 Friends Summary
                                    </Text>
                                    <SRow
                                        label="Friends owe you"
                                        val={fmt(friends.owedToYou)}
                                        valColor={COLORS.primary}
                                    />
                                    <SRow
                                        label="You owe friends"
                                        val={fmt(friends.youOwe)}
                                        valColor={COLORS.danger}
                                    />
                                    <SRow
                                        label="Net balance"
                                        val={fmt(friends.netBalance)}
                                        valColor={
                                            friends.netBalance >= 0
                                                ? COLORS.primary
                                                : COLORS.danger
                                        }
                                        last
                                    />
                                </View>

                                {/* Spending bar chart */}
                                {topCats.length > 0 && (
                                    <View style={s.card}>
                                        <Text style={s.sectionHeader}>
                                            Spending by Category
                                        </Text>
                                        {topCats.map((cat, i) => (
                                            <HBar
                                                key={cat.category}
                                                icon={
                                                    CATEGORY_META[cat.category]
                                                        ?.icon || "➕"
                                                }
                                                label={cat.label}
                                                val={cat.total}
                                                pctVal={pct(
                                                    cat.total,
                                                    totalSpent,
                                                )}
                                                color={
                                                    CATEGORY_META[cat.category]
                                                        ?.color || "#9CA3AF"
                                                }
                                            />
                                        ))}
                                    </View>
                                )}
                            </>
                        )}

                    {/* ══ FREELANCE / BOTH — Income ══ */}
                    {!loading &&
                        !error &&
                        (useCase === "freelance" || useCase === "both") &&
                        !!freeData && (
                            <>
                                {/* Project income list */}
                                {projectList.length > 0 && (
                                    <LinearGradient
                                        colors={COLORS.gradientBlue}
                                        start={{ x: 0.13, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={[s.card, { padding: 14 }]}
                                    >
                                        <Text
                                            style={[
                                                s.sectionHeader,
                                                {
                                                    color: "rgba(255,255,255,0.7)",
                                                },
                                            ]}
                                        >
                                            Project Income — {period}
                                        </Text>
                                        {projectList.slice(0, 6).map((p, i) => (
                                            <View key={i} style={s.incomeRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={{
                                                            color: "rgba(255,255,255,0.9)",
                                                            fontFamily:
                                                                FONTS.nunito
                                                                    .bold,
                                                            fontSize: SIZES.md,
                                                        }}
                                                        numberOfLines={1}
                                                    >
                                                        {p.project}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "rgba(255,255,255,0.6)",
                                                            fontFamily:
                                                                FONTS.dmSans
                                                                    .regular,
                                                            fontSize: SIZES.sm2,
                                                        }}
                                                    >
                                                        {p.client}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        color: "#A7F3D0",
                                                        fontFamily:
                                                            FONTS.nunito
                                                                .extraBold,
                                                        fontSize: SIZES.md,
                                                    }}
                                                >
                                                    {fmt(p.amount)}
                                                </Text>
                                            </View>
                                        ))}
                                        <View
                                            style={[
                                                s.incomeRow,
                                                {
                                                    borderTopWidth: 1,
                                                    borderTopColor:
                                                        "rgba(255,255,255,0.2)",
                                                    marginTop: 4,
                                                    paddingTop: 8,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    color: "#fff",
                                                    fontFamily:
                                                        FONTS.nunito.bold,
                                                    fontSize: SIZES.md,
                                                }}
                                            >
                                                Total Received
                                            </Text>
                                            <Text
                                                style={{
                                                    color: "#fff",
                                                    fontFamily:
                                                        FONTS.nunito.black,
                                                    fontSize: SIZES.lg2,
                                                }}
                                            >
                                                {fmt(totalIncome)}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                )}

                                {/* Income by client bars */}
                                {incomeByClient.length > 0 && (
                                    <View style={s.card}>
                                        <Text style={s.sectionHeader}>
                                            Income by Client
                                        </Text>
                                        {incomeByClient.map((c, i) => (
                                            <HBar
                                                key={c.client}
                                                icon="🏢"
                                                label={c.client}
                                                val={c.total}
                                                pctVal={pct(
                                                    c.total,
                                                    maxClientIncome,
                                                )}
                                                color={
                                                    [
                                                        "#2563eb",
                                                        "#6C3EF4",
                                                        "#F59E0B",
                                                        "#10B981",
                                                    ][i % 4]
                                                }
                                            />
                                        ))}
                                    </View>
                                )}

                                {/* Profit analysis */}
                                <View style={s.card}>
                                    <Text style={s.sectionHeader}>
                                        💸 Profit Analysis
                                    </Text>
                                    <SRow
                                        label="Total Income"
                                        val={fmt(totalIncome)}
                                        valColor={COLORS.primary}
                                    />
                                    <SRow
                                        label="Developer Payments"
                                        val={`−${fmt(totalDevPaid)}`}
                                        valColor={COLORS.danger}
                                    />
                                    <View
                                        style={[
                                            s.settleRow,
                                            { borderBottomWidth: 0 },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                s.settleLabel,
                                                {
                                                    fontFamily:
                                                        FONTS.nunito.bold,
                                                    color: COLORS.text,
                                                },
                                            ]}
                                        >
                                            Net Profit
                                        </Text>
                                        <Text
                                            style={[
                                                s.settleVal,
                                                {
                                                    fontSize: SIZES.lg,
                                                    color:
                                                        netProfit >= 0
                                                            ? COLORS.primary
                                                            : COLORS.danger,
                                                },
                                            ]}
                                        >
                                            {fmt(netProfit)}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}

                    {/* Empty state */}
                    {!loading && !error && !report && (
                        <View
                            style={[
                                s.card,
                                { alignItems: "center", padding: 32, gap: 8 },
                            ]}
                        >
                            <Text style={{ fontSize: 36 }}>📊</Text>
                            <Text
                                style={{
                                    fontFamily: FONTS.nunito.bold,
                                    fontSize: SIZES.lg2,
                                    color: COLORS.text,
                                }}
                            >
                                No data yet
                            </Text>
                            <Text
                                style={{
                                    fontFamily: FONTS.dmSans.regular,
                                    fontSize: SIZES.md,
                                    color: COLORS.text2,
                                    textAlign: "center",
                                }}
                            >
                                Add expenses and projects to see your report
                                here.
                            </Text>
                        </View>
                    )}

                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    hero: { padding: 18, paddingBottom: 22 },
    heroTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    heroStats: { flexDirection: "row", gap: 10, marginTop: 12 },
    heroStat: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 12,
    },
    heroStatVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    heroStatLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    body: { padding: 14 },

    // Period chips
    periodRow: { marginBottom: 12, marginHorizontal: -14 },
    periodChips: { paddingHorizontal: 14, gap: 8 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: COLORS.border,
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    chipTxtActive: { color: "#fff" },

    // Custom date picker
    customDateBox: {
        backgroundColor: "#EFF6FF",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: "#BFDBFE",
    },
    customDateTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: "#1D4ED8",
        marginBottom: 12,
    },
    customDateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    customDateLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginBottom: 6,
    },
    customDateInput: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: "#BFDBFE",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 9,
        gap: 6,
    },
    customDateInputErr: { borderColor: COLORS.danger },
    customDateIcon: { fontSize: 14 },
    customDateTxt: {
        flex: 1,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    customDateArrow: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.lg2,
        color: COLORS.text3,
        marginTop: 20,
    },
    customDateError: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
        marginTop: 8,
    },
    customDateValid: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.primary,
        marginTop: 8,
    },

    // Card + sections
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        ...SHADOWS.card,
    },
    sectionHeader: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    donutRow: { flexDirection: "row", gap: 16, alignItems: "center" },
    legend: { flex: 1, gap: 0 },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
    },
    legendDot: { width: 8, height: 8, borderRadius: 2 },
    legendLabel: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        flex: 1,
    },
    legendVal: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    hBar: { marginBottom: 12 },
    hBarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    hBarLabel: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.base,
        color: COLORS.text,
    },
    hBarVal: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.base,
        color: COLORS.text,
    },
    hBarTrack: {
        height: 8,
        backgroundColor: "#F3F4F6",
        borderRadius: 99,
        overflow: "hidden",
    },
    hBarFill: { height: "100%", borderRadius: 99 },
    settleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settleLabel: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    settleVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
    incomeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
    },
    errBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        alignItems: "center",
        gap: 8,
    },
    errTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.danger,
        textAlign: "center",
    },
    retryBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 7,
    },
    retryTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
});
