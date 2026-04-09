// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { COLORS, SHADOWS } from "../../theme/colors";
// import { FONTS, SIZES, RADIUS } from "../../theme/typography";
// import { FRIENDS } from "../../data/mockData";

// const DATE_GROUPS = ["March 2026", "February 2026"];

// export default function FriendDetailScreen({ navigation, route }) {
//     const insets = useSafeAreaInsets();
//     const { friendId } = route.params || {};
//     const friend = FRIENDS.find((f) => f.id === friendId) || FRIENDS[0];

//     const isOwed = friend.amount >= 0;
//     const absAmt = Math.abs(friend.amount);

//     const txByMonth = DATE_GROUPS.map((month) => ({
//         month,
//         txs: friend.transactions || [],
//     })).filter((g) => g.txs.length > 0);

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <LinearGradient
//                 colors={COLORS.gradientGreen}
//                 start={{ x: 0.13, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={[styles.header, { paddingTop: insets.top + 6 }]}
//             >
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={styles.backBtn}
//                 >
//                     <Text style={styles.backText}>← Back</Text>
//                 </TouchableOpacity>

//                 <View style={styles.headerContent}>
//                     <View
//                         style={[
//                             styles.avatar,
//                             { backgroundColor: friend.color },
//                         ]}
//                     >
//                         <Text style={styles.avatarText}>{friend.initials}</Text>
//                     </View>
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.friendName}>{friend.name}</Text>
//                         <Text style={styles.friendPhone}>{friend.phone}</Text>
//                     </View>
//                     <View style={styles.contactBtns}>
//                         <TouchableOpacity style={styles.contactBtn}>
//                             <Text>📞</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.contactBtn}>
//                             <Text>💬</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//                 {/* Net balance box */}
//                 <View style={styles.balanceBox}>
//                     <Text style={styles.balanceLbl}>
//                         {isOwed
//                             ? `${friend.name.split(" ")[0]} owes you`
//                             : "You owe"}
//                     </Text>
//                     <Text style={styles.balanceAmt}>
//                         ₹{absAmt.toLocaleString("en-IN")}
//                     </Text>
//                     <Text style={styles.balanceSub}>
//                         {isOwed
//                             ? `${friend.name.split(" ")[0]} owes you this amount`
//                             : `You owe this amount`}
//                     </Text>
//                 </View>
//             </LinearGradient>

//             {/* Transaction list */}
//             <ScrollView
//                 style={styles.scroll}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <View style={styles.body}>
//                     {(friend.transactions || []).length === 0 && (
//                         <View style={styles.emptyCard}>
//                             <Text style={styles.emptyText}>
//                                 No transactions yet
//                             </Text>
//                         </View>
//                     )}

//                     {/* Show all transactions with month separators */}
//                     {(() => {
//                         const allTx = friend.transactions || [];
//                         let lastMonth = "";
//                         return allTx.map((tx, i) => {
//                             const month =
//                                 tx.date?.split(" ")?.slice(1)?.join(" ") ||
//                                 "March 2026";
//                             const showHeader = month !== lastMonth;
//                             lastMonth = month;
//                             return (
//                                 <View key={tx.id || i}>
//                                     {showHeader && (
//                                         <Text style={styles.dateHeader}>
//                                             {month}
//                                         </Text>
//                                     )}
//                                     <View style={styles.txCard}>
//                                         <View
//                                             style={[
//                                                 styles.txDot,
//                                                 {
//                                                     backgroundColor:
//                                                         tx.direction === "gave"
//                                                             ? "#FEE2E2"
//                                                             : "#D1FAE5",
//                                                 },
//                                             ]}
//                                         >
//                                             <Text style={styles.txArrow}>
//                                                 {tx.direction === "gave" ? "↑" : "↓"}
//                                             </Text>
//                                         </View>
//                                         <View style={{ flex: 1 }}>
//                                             <Text style={styles.txLabel}>
//                                                 {tx.direction === "gave"
//                                                     ? "You gave"
//                                                     : "You received"}
//                                             </Text>
//                                             <Text style={styles.txMeta}>
//                                                 {tx.label} · {tx.date}
//                                             </Text>
//                                         </View>
//                                         <View
//                                             style={{ alignItems: "flex-end" }}
//                                         >
//                                             <Text
//                                                 style={[
//                                                     styles.txAmt,
//                                                     {
//                                                         color:
//                                                             tx.direction === "gave"
//                                                                 ? COLORS.danger
//                                                                 : COLORS.primary,
//                                                     },
//                                                 ]}
//                                             >
//                                                 {tx.direction === "gave" ? "−" : "+"}
//                                                 ₹
//                                                 {tx.amount.toLocaleString(
//                                                     "en-IN",
//                                                 )}
//                                             </Text>
//                                             <Text style={styles.txMethod}>
//                                                 {tx.method === "UPI"
//                                                     ? "📱 UPI"
//                                                     : tx.method === "Cash"
//                                                       ? "💵 Cash"
//                                                       : `🏦 ${tx.method}`}
//                                             </Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                             );
//                         });
//                     })()}
//                     <View style={{ height: 100 }} />
//                 </View>
//             </ScrollView>

//             {/* Sticky bottom */}
//             <View
//                 style={[
//                     styles.stickyBottom,
//                     { paddingBottom: insets.bottom + 12 },
//                 ]}
//             >
//                 <TouchableOpacity
//                     style={styles.gaveBtn}
//                     onPress={() =>
//                         navigation.navigate("GiveMoney", {
//                             friendId: friend.id,
//                         })
//                     }
//                     activeOpacity={0.85}
//                 >
//                     <Text style={styles.gaveBtnText}>↑ You Gave</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.receivedBtn}
//                     onPress={() =>
//                         navigation.navigate("GetMoney", { friendId: friend.id })
//                     }
//                     activeOpacity={0.85}
//                 >
//                     <Text style={styles.receivedBtnText}>↓ You Received</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },
//     header: { paddingHorizontal: 18, paddingBottom: 20 },
//     backBtn: { marginBottom: 10 },
//     backText: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.md,
//         color: "rgba(255,255,255,0.9)",
//     },
//     headerContent: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 12,
//         marginTop: 6,
//     },
//     avatar: {
//         width: 52,
//         height: 52,
//         borderRadius: 26,
//         backgroundColor: "rgba(255,255,255,0.25)",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     avatarText: { fontFamily: FONTS.nunito.black, fontSize: 22, color: "#fff" },
//     friendName: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.xl3,
//         color: "#fff",
//     },
//     friendPhone: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.base,
//         color: "rgba(255,255,255,0.75)",
//         marginTop: 2,
//     },
//     contactBtns: { flexDirection: "row", gap: 8 },
//     contactBtn: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         backgroundColor: "rgba(255,255,255,0.2)",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     balanceBox: {
//         backgroundColor: "rgba(0,0,0,0.15)",
//         borderRadius: 14,
//         padding: 14,
//         marginTop: 14,
//         alignItems: "center",
//     },
//     balanceLbl: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.base,
//         color: "rgba(255,255,255,0.7)",
//         marginBottom: 4,
//     },
//     balanceAmt: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: 30,
//         color: "#fff",
//         letterSpacing: -1,
//     },
//     balanceSub: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm2,
//         color: "rgba(255,255,255,0.65)",
//         marginTop: 4,
//     },
//     scroll: { flex: 1 },
//     body: { paddingHorizontal: 14, paddingTop: 14 },
//     emptyCard: {
//         backgroundColor: COLORS.card,
//         borderRadius: 14,
//         padding: 20,
//         alignItems: "center",
//         ...SHADOWS.card,
//     },
//     emptyText: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.md,
//         color: COLORS.text2,
//     },
//     dateHeader: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.sm2,
//         color: COLORS.text3,
//         textTransform: "uppercase",
//         letterSpacing: 0.5,
//         marginBottom: 8,
//         marginTop: 4,
//     },
//     txCard: {
//         backgroundColor: COLORS.card,
//         borderRadius: 14,
//         padding: 14,
//         marginBottom: 10,
//         flexDirection: "row",
//         alignItems: "flex-start",
//         gap: 12,
//         ...SHADOWS.card,
//     },
//     txDot: {
//         width: 38,
//         height: 38,
//         borderRadius: 19,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     txArrow: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.lg2,
//         color: COLORS.text,
//     },
//     txLabel: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md2,
//         color: COLORS.text,
//     },
//     txMeta: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.base,
//         color: COLORS.text2,
//         marginTop: 2,
//     },
//     txAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
//     txMethod: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm,
//         color: COLORS.text3,
//         marginTop: 2,
//     },
//     stickyBottom: {
//         backgroundColor: "#fff",
//         borderTopWidth: 1.5,
//         borderTopColor: COLORS.border,
//         padding: 12,
//         flexDirection: "row",
//         gap: 10,
//     },
//     gaveBtn: {
//         flex: 1,
//         padding: 13,
//         borderRadius: 14,
//         backgroundColor: "#FEE2E2",
//         alignItems: "center",
//         flexDirection: "row",
//         justifyContent: "center",
//         gap: 6,
//     },
//     gaveBtnText: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md2,
//         color: COLORS.danger,
//     },
//     receivedBtn: {
//         flex: 1,
//         padding: 13,
//         borderRadius: 14,
//         backgroundColor: COLORS.primaryUltraLight,
//         alignItems: "center",
//         flexDirection: "row",
//         justifyContent: "center",
//         gap: 6,
//     },
//     receivedBtnText: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md2,
//         color: COLORS.primary,
//     },
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
    Alert,
    Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchFriend,
    deleteTransaction,
    getFriendColor,
    getFriendInitials,
    getBalanceConfig,
} from "../../api/friends";

const METHOD_ICON = {
    upi: "📱",
    cash: "💵",
    bank: "🏦",
    card: "💳",
    other: "💰",
};

// ─── Group transactions by month ──────────────────────────────────────────────
function groupByMonth(transactions) {
    const groups = {};
    (transactions || []).forEach((tx) => {
        const d = new Date(tx.date || tx.createdAt || Date.now());
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });
        if (!groups[key]) groups[key] = { key, label, txs: [] };
        groups[key].txs.push(tx);
    });
    return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
}

const fmtDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return `${dt.getDate()} ${dt.toLocaleString("default", { month: "short" })} ${dt.getFullYear()}`;
};

// ─── Transaction Row ──────────────────────────────────────────────────────────
function TxRow({ tx, friendId, onDeleted }) {
    const isGave = tx.direction === "gave";
    const handleLongPress = () => {
        Alert.alert(
            "Delete Transaction",
            `Delete "${tx.note}" of ₹${(tx.amount || 0).toLocaleString("en-IN")}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const res = await deleteTransaction(friendId, tx._id);
                        if (res.ok) onDeleted();
                        else Alert.alert("Error", res.message);
                    },
                },
            ],
        );
    };

    return (
        <TouchableOpacity
            onLongPress={handleLongPress}
            style={s.txRow}
            activeOpacity={0.8}
        >
            <View
                style={[
                    s.txDot,
                    { backgroundColor: isGave ? "#FEE2E2" : "#D1FAE5" },
                ]}
            >
                <Text style={s.txArrow}>{isGave ? "↑" : "↓"}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={s.txLabel}>
                    {tx.label || (isGave ? "You gave" : "You received")}
                </Text>
                <Text style={s.txMeta}>
                    {fmtDate(tx.date || tx.createdAt)}
                    {tx.method
                        ? ` · ${METHOD_ICON[tx.method] || "💰"} ${tx.method}`
                        : ""}
                </Text>
                {tx.note ? <Text style={s.txNote}>{tx.note}</Text> : null}
            </View>
            <View style={{ alignItems: "flex-end" }}>
                <Text
                    style={[
                        s.txAmt,
                        { color: isGave ? COLORS.danger : COLORS.primary },
                    ]}
                >
                    {isGave ? "−" : "+"}₹
                    {(tx.amount || 0).toLocaleString("en-IN")}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FriendDetailScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { friendId } = route.params || {};

    const [friend, setFriend] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(
        async (isRefresh = false) => {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");
            const res = await fetchFriend(friendId);
            console.log(
                "FriendDetailScreen fetchFriend res",
                JSON.stringify(res),
            );
            if (res.ok) {
                setFriend(res.data.friend);
                setTransactions(res.data?.friend?.transactions || []);
                setStats(res.data.stats || {});
            } else {
                setError(res.message);
            }
            setLoading(false);
            setRefreshing(false);
        },
        [friendId],
    );

    useEffect(() => {
        load();
    }, [load]);

    if (loading) {
        return (
            <View
                style={[
                    s.container,
                    { alignItems: "center", justifyContent: "center" },
                ]}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }
    if (error || !friend) {
        return (
            <View
                style={[
                    s.container,
                    {
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 24,
                    },
                ]}
            >
                <Text style={{ fontSize: 36 }}>⚠️</Text>
                <Text style={s.errTitle}>{error || "Friend not found"}</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={s.retryBtn}
                >
                    <Text style={s.retryTxt}>← Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const balance = friend.balance || 0;
    const cfg = getBalanceConfig(balance);
    const initials = friend.initials || getFriendInitials(friend.friendName);
    const color = friend.avatarColor || getFriendColor(friend.friendName);
    const groups = groupByMonth(transactions);

    return (
        <View style={s.container}>
            {/* Header */}
            <LinearGradient
                colors={COLORS.gradientGreen}
                start={{ x: 0.13, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[s.header, { paddingTop: insets.top + 6 }]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={s.backBtn}
                >
                    <Text style={s.backTxt}>← Back</Text>
                </TouchableOpacity>

                <View style={s.heroRow}>
                    <View style={[s.avatar, { backgroundColor: color }]}>
                        <Text style={s.avatarTxt}>{initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.heroName}>{friend.friendName}</Text>
                        {friend.friendPhone ? (
                            <Text style={s.heroPhone}>
                                {friend.friendPhone}
                            </Text>
                        ) : null}
                    </View>
                    <View style={s.heroBtns}>
                        <TouchableOpacity
                            style={s.heroIconBtn}
                            onPress={() =>
                                friend.friendPhone &&
                                Linking.openURL(`tel:${friend.friendPhone}`)
                            }
                        >
                            <Text>📞</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={s.heroIconBtn}
                            onPress={() =>
                                friend.friendPhone &&
                                Linking.openURL(
                                    `whatsapp://send?phone=${friend.friendPhone.replace(/\D/g, "")}`,
                                )
                            }
                        >
                            <Text>💬</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Balance box */}
                <View style={s.balanceBox}>
                    <Text style={s.balanceLbl}>
                        {balance > 0
                            ? `${friend?.friendName?.split(" ")[0]} owes you`
                            : balance < 0
                              ? "You owe"
                              : "All Settled"}
                    </Text>
                    <Text
                        style={[
                            s.balanceAmt,
                            { color: balance === 0 ? "#A7F3D0" : "#fff" },
                        ]}
                    >
                        {balance === 0
                            ? "✅ Settled"
                            : `₹${Math.abs(balance).toLocaleString("en-IN")}`}
                    </Text>
                    {balance !== 0 && (
                        <Text style={s.balanceSub}>
                            {transactions.length} transaction
                            {transactions.length !== 1 ? "s" : ""}
                        </Text>
                    )}
                </View>
            </LinearGradient>

            {/* Transaction list */}
            <ScrollView
                style={s.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => load(true)}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={s.body}>
                    {transactions.length === 0 && (
                        <View style={s.emptyCard}>
                            <Text style={{ fontSize: 32 }}>💸</Text>
                            <Text style={s.emptyTitle}>
                                No transactions yet
                            </Text>
                            <Text style={s.emptyMsg}>
                                Use the buttons below to record money given or
                                received.
                            </Text>
                        </View>
                    )}

                    {groups.map((group) => (
                        <View key={group.key}>
                            <Text style={s.monthHdr}>{group.label}</Text>
                            {group.txs.map((tx, i) => (
                                <TxRow
                                    key={tx._id || i}
                                    tx={tx}
                                    friendId={friendId}
                                    onDeleted={() => load()}
                                />
                            ))}
                        </View>
                    ))}

                    {transactions.length > 0 && (
                        <Text style={s.hint}>
                            Long-press a transaction to delete
                        </Text>
                    )}
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Sticky bottom */}
            <View
                style={[s.stickyBottom, { paddingBottom: insets.bottom + 12 }]}
            >
                <TouchableOpacity
                    style={s.gaveBtn}
                    onPress={() =>
                        navigation.navigate("AddTransaction", {
                            friendId,
                            friend,
                            direction: "gave",
                            onAdded: () => load(),
                        })
                    }
                    activeOpacity={0.85}
                >
                    <Text style={s.gaveBtnTxt}>↑ You Gave</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s.receivedBtn}
                    onPress={() =>
                        navigation.navigate("AddTransaction", {
                            friendId,
                            friend,
                            direction: "received",
                            onAdded: () => load(),
                        })
                    }
                    activeOpacity={0.85}
                >
                    <Text style={s.receivedBtnTxt}>↓ You Received</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 20 },
    backBtn: { marginBottom: 10 },
    backTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    heroRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 6,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarTxt: { fontFamily: FONTS.nunito.black, fontSize: 22, color: "#fff" },
    heroName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    heroPhone: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.75)",
        marginTop: 2,
    },
    heroBtns: { flexDirection: "row", gap: 8 },
    heroIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    balanceBox: {
        backgroundColor: "rgba(0,0,0,0.15)",
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
        alignItems: "center",
    },
    balanceLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.7)",
        marginBottom: 4,
    },
    balanceAmt: {
        fontFamily: FONTS.nunito.black,
        fontSize: 30,
        letterSpacing: -1,
    },
    balanceSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.6)",
        marginTop: 4,
    },
    scroll: { flex: 1 },
    body: { paddingHorizontal: 14, paddingTop: 14 },
    monthHdr: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 4,
    },
    txRow: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        ...SHADOWS.card,
    },
    txDot: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    txArrow: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.lg2,
        color: COLORS.text,
    },
    txLabel: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    txMeta: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        marginTop: 2,
    },
    txNote: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        marginTop: 2,
        fontStyle: "italic",
    },
    txAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
    emptyCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 32,
        alignItems: "center",
        gap: 8,
        ...SHADOWS.card,
    },
    emptyTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
    },
    emptyMsg: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        textAlign: "center",
        lineHeight: 20,
    },
    hint: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textAlign: "center",
        paddingVertical: 8,
    },
    errTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
        marginTop: 8,
    },
    retryBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginTop: 12,
    },
    retryTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    stickyBottom: {
        backgroundColor: "#fff",
        borderTopWidth: 1.5,
        borderTopColor: COLORS.border,
        padding: 12,
        flexDirection: "row",
        gap: 10,
    },
    gaveBtn: {
        flex: 1,
        padding: 13,
        borderRadius: 14,
        backgroundColor: "#FEE2E2",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    gaveBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.danger,
    },
    receivedBtn: {
        flex: 1,
        padding: 13,
        borderRadius: 14,
        backgroundColor: COLORS.primaryUltraLight,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    receivedBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.primary,
    },
});
