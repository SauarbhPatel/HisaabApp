// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
// import TopBar from '../../components/shared/TopBar';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import { FONTS, SIZES, RADIUS } from '../../theme/typography';
// import { GROUPS } from '../../data/mockData';

// const BADGE_CONFIG = {
//   owe: { bg: '#FEE2E2', text: COLORS.danger },
//   lent: { bg: COLORS.primaryUltraLight, text: COLORS.primary },
//   settled: { bg: '#F3F4F6', text: COLORS.text2 },
// };

// export default function GroupsScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <TopBar navigation={navigation} />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.titleRow}>
//           <Text style={styles.title}>Your Groups</Text>
//           <TouchableOpacity
//             style={styles.newBtn}
//             onPress={() => navigation.navigate('AddGroup')}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.newBtnText}>+ New Group</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.body}>
//           {GROUPS.map((group) => {
//             const badge = BADGE_CONFIG[group.balanceType];
//             const badgeLabel = group.balanceType === 'owe'
//               ? `You owe ₹${Math.abs(group.balance)}`
//               : group.balanceType === 'lent'
//                 ? `Owed ₹${group.balance}`
//                 : 'All Settled ✅';
//             return (
//               <TouchableOpacity
//                 key={group.id}
//                 style={styles.groupCard}
//                 onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
//                 activeOpacity={0.85}
//               >
//                 <View style={styles.gcTop}>
//                   <View style={[styles.gcIcon, { backgroundColor: group.iconBg }]}>
//                     <Text style={{ fontSize: 20 }}>{group.icon}</Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.gcName}>{group.name}</Text>
//                     <Text style={styles.gcMembers}>
//                       {group.memberCount} members · {group.expenseCount} expenses this month
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.gcFooter}>
//                   <Text style={styles.gcLast}>Last: {group.lastExpense}</Text>
//                   <View style={[styles.balBadge, { backgroundColor: badge.bg }]}>
//                     <Text style={[styles.balBadgeText, { color: badge.text }]}>{badgeLabel}</Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}

//           <TouchableOpacity
//             style={styles.addDashed}
//             onPress={() => navigation.navigate('AddGroup')}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.addDashedText}>+ Create New Group</Text>
//           </TouchableOpacity>
//           <View style={{ height: 20 }} />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.bg },
//   titleRow: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     paddingHorizontal: 14, paddingTop: 16, paddingBottom: 8,
//   },
//   title: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: COLORS.text },
//   newBtn: {
//     backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
//   },
//   newBtnText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: '#fff' },
//   body: { paddingHorizontal: 14 },
//   groupCard: {
//     backgroundColor: COLORS.card, borderRadius: 16, padding: 14,
//     marginBottom: 10, ...SHADOWS.card,
//   },
//   gcTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
//   gcIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
//   gcName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
//   gcMembers: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
//   gcFooter: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border,
//   },
//   gcLast: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
//   balBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
//   balBadgeText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
//   addDashed: {
//     borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: 'dashed',
//     borderRadius: 14, padding: 13, alignItems: 'center',
//     backgroundColor: COLORS.primaryUltraLight,
//   },
//   addDashedText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.primary },
// });

import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import TopBar from "../../components/shared/TopBar";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchGroups,
    BADGE_CONFIG,
    getBadgeLabel,
    getMemberColor,
    getMemberInitials,
} from "../../api/groups";
import { useFocusEffect } from "@react-navigation/native";

export default function GroupsScreen({ navigation }) {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // Stats derived from groups
    const owingTotal = groups
        .filter((g) => g.myBalance < -0.005)
        .reduce((s, g) => s + Math.abs(g.myBalance), 0);
    const lentTotal = groups
        .filter((g) => g.myBalance > 0.005)
        .reduce((s, g) => s + g.myBalance, 0);

    const load = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);
        setError("");
        const res = await fetchGroups();
        console.log("Fetched groups:", res);
        if (res.ok) setGroups(res.data.groups || []);
        else setError(res.message);
        setLoading(false);
        setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    const onRefresh = () => load(true);

    return (
        <View style={s.container}>
            <TopBar navigation={navigation} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* ── Stats header ── */}
                <View style={s.statsHeader}>
                    <View style={s.statBox}>
                        <Text style={[s.statVal, { color: "#A7F3D0" }]}>
                            ₹{lentTotal.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.statLbl}>Owed to You</Text>
                    </View>
                    <View style={s.statBox}>
                        <Text style={[s.statVal, { color: "#FCA5A5" }]}>
                            ₹{owingTotal.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.statLbl}>You Owe</Text>
                    </View>
                    <View style={s.statBox}>
                        <Text style={s.statVal}>{groups.length}</Text>
                        <Text style={s.statLbl}>Groups</Text>
                    </View>
                </View>

                {/* ── Title row ── */}
                <View style={s.titleRow}>
                    <Text style={s.title}>Your Groups</Text>
                    <TouchableOpacity
                        style={s.newBtn}
                        onPress={() =>
                            navigation.navigate("AddGroup", {
                                onCreated: () => load(),
                            })
                        }
                        activeOpacity={0.85}
                    >
                        <Text style={s.newBtnText}>+ New Group</Text>
                    </TouchableOpacity>
                </View>

                <View style={s.body}>
                    {/* Loading */}
                    {loading && (
                        <View style={s.centred}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                            />
                            <Text style={s.loadingTxt}>Loading groups...</Text>
                        </View>
                    )}

                    {/* Error */}
                    {!loading && !!error && (
                        <View style={s.errorBox}>
                            <Text style={s.errorIcon}>⚠️</Text>
                            <Text style={s.errorTxt}>{error}</Text>
                            <TouchableOpacity
                                onPress={() => load()}
                                style={s.retryBtn}
                            >
                                <Text style={s.retryTxt}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Empty */}
                    {!loading && !error && groups.length === 0 && (
                        <View style={s.emptyBox}>
                            <Text style={{ fontSize: 40 }}>👥</Text>
                            <Text style={s.emptyTitle}>No groups yet</Text>
                            <Text style={s.emptySub}>
                                Create a group to start splitting expenses with
                                your flat, friends, or on trips.
                            </Text>
                        </View>
                    )}

                    {/* Group cards */}
                    {!loading &&
                        groups.map((group) => {
                            const balance = group.myBalance || 0;
                            const balType = group.balanceType || "settled";
                            const badge = BADGE_CONFIG[balType];
                            const badgeLbl = getBadgeLabel(balType, balance);
                            const lastDesc = group.lastExpenseDesc;
                            const monthCount = group.thisMonthCount || 0;
                            return (
                                <TouchableOpacity
                                    key={group._id}
                                    style={s.groupCard}
                                    onPress={() =>
                                        navigation.navigate("GroupDetail", {
                                            groupId: group._id,
                                            onRefresh: () => load(),
                                        })
                                    }
                                    activeOpacity={0.85}
                                >
                                    <View style={s.gcTop}>
                                        {/* Icon */}
                                        <View style={s.gcIconWrap}>
                                            <Text style={{ fontSize: 22 }}>
                                                {group.icon || "👥"}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={s.gcName}>
                                                {group.name}
                                            </Text>
                                            <Text style={s.gcMeta}>
                                                {group.memberCount ||
                                                    (group.members || [])
                                                        .length}{" "}
                                                members
                                                {monthCount > 0
                                                    ? ` · ${monthCount} expenses this month`
                                                    : ""}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Member avatar strip */}
                                    {(group.members || []).length > 0 && (
                                        <View style={s.avatarStrip}>
                                            {(group.members || [])
                                                .slice(0, 4)
                                                .map((m, i) => {
                                                    const nm =
                                                        m.user?.name ||
                                                        m.name ||
                                                        "?";
                                                    return (
                                                        <View
                                                            key={m._id || i}
                                                            style={[
                                                                s.avChip,
                                                                {
                                                                    backgroundColor:
                                                                        getMemberColor(
                                                                            nm,
                                                                        ),
                                                                    marginLeft:
                                                                        i > 0
                                                                            ? -6
                                                                            : 0,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={
                                                                    s.avChipTxt
                                                                }
                                                            >
                                                                {getMemberInitials(
                                                                    nm,
                                                                )}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            {(group.members || []).length >
                                                4 && (
                                                <View
                                                    style={[
                                                        s.avChip,
                                                        {
                                                            backgroundColor:
                                                                "#9CA3AF",
                                                            marginLeft: -6,
                                                        },
                                                    ]}
                                                >
                                                    <Text style={s.avChipTxt}>
                                                        +
                                                        {(group.members || [])
                                                            .length - 4}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}

                                    <View style={s.gcFooter}>
                                        <Text
                                            style={s.gcLast}
                                            numberOfLines={1}
                                        >
                                            {lastDesc
                                                ? `Last: ${lastDesc}`
                                                : "No expenses yet"}
                                        </Text>
                                        <View
                                            style={[
                                                s.balBadge,
                                                { backgroundColor: badge.bg },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    s.balBadgeText,
                                                    { color: badge.text },
                                                ]}
                                            >
                                                {badgeLbl}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                    {/* Add new dashed */}
                    {!loading && (
                        <TouchableOpacity
                            style={s.addDashed}
                            onPress={() =>
                                navigation.navigate("AddGroup", {
                                    onCreated: () => load(),
                                })
                            }
                            activeOpacity={0.8}
                        >
                            <Text style={s.addDashedText}>
                                🤝 + Create New Group
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    statsHeader: {
        flexDirection: "row",
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 14,
        gap: 0,
    },
    statBox: { flex: 1, alignItems: "center" },
    statVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    statLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.7)",
        marginTop: 2,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: COLORS.text,
    },
    newBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 10,
    },
    newBtnText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    body: { paddingHorizontal: 14 },
    centred: { alignItems: "center", paddingTop: 40, gap: 10 },
    loadingTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    errorBox: { alignItems: "center", padding: 24, gap: 8 },
    errorIcon: { fontSize: 32 },
    errorTxt: {
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
        marginTop: 6,
    },
    retryTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "#fff",
    },
    emptyBox: {
        alignItems: "center",
        paddingTop: 40,
        paddingHorizontal: 24,
        gap: 8,
    },
    emptyTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: COLORS.text,
    },
    emptySub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        textAlign: "center",
        lineHeight: 20,
    },
    groupCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        ...SHADOWS.card,
    },
    gcTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
    },
    gcIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#EDE9FE",
        alignItems: "center",
        justifyContent: "center",
    },
    gcName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    gcMeta: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 2,
    },
    avatarStrip: { flexDirection: "row", marginBottom: 10 },
    avChip: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#fff",
    },
    avChipTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: 9,
        color: "#fff",
    },
    gcFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    gcLast: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        flex: 1,
        marginRight: 8,
    },
    balBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    balBadgeText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
    addDashed: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderStyle: "dashed",
        borderRadius: 14,
        padding: 14,
        alignItems: "center",
        backgroundColor: COLORS.primaryUltraLight,
        marginTop: 4,
    },
    addDashedText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.primary,
    },
});
