import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "../../components/shared/TopBar";
import { FilterChipRow } from "../../components/shared/FilterChip";
import SearchBar from "../../components/shared/SearchBar";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchFriends,
    getFriendColor,
    getFriendInitials,
    getBalanceConfig,
} from "../../api/friends";

const FILTERS = ["All", "Owed to You", "You Owe", "Settled"];
const FILTER_MAP = {
    "Owed to You": "owed",
    "You Owe": "owe",
    Settled: "settled",
};

// ─── Friend Card ──────────────────────────────────────────────────────────────
function FriendCard({ friend, navigation }) {
    const name = friend.friendName || "";
    const balance = friend.balance || 0;
    const initials = friend.initials || getFriendInitials(name);
    const color = friend.avatarColor || getFriendColor(name);
    const cfg = getBalanceConfig(balance);

    const statusText =
        balance > 0
            ? `Owes you · ${friend.transactionCount || 0} transactions`
            : balance < 0
              ? `You owe · ${friend.transactionCount || 0} transactions`
              : `All settled · ${friend.transactionCount || 0} transactions`;

    return (
        <TouchableOpacity
            style={st.card}
            onPress={() =>
                navigation.navigate("FriendDetail", { friendId: friend._id })
            }
            activeOpacity={0.85}
        >
            <View style={st.cardTop}>
                <View style={[st.avatar, { backgroundColor: color }]}>
                    <Text style={st.avatarTxt}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={st.name}>{name}</Text>
                    <Text style={st.status}>{statusText}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={[st.amount, { color: cfg.color }]}>
                        {balance !== 0 ? cfg.prefix : ""}₹
                        {Math.abs(balance).toLocaleString("en-IN")}
                    </Text>
                    {balance === 0 && (
                        <Text
                            style={[
                                st.amount,
                                { color: cfg.color, fontSize: SIZES.sm2 },
                            ]}
                        >
                            Settled ✅
                        </Text>
                    )}
                </View>
            </View>

            {/* Action buttons */}
            <View style={st.actions}>
                {balance < 0 ? (
                    <TouchableOpacity
                        style={[
                            st.actBtn,
                            { backgroundColor: COLORS.primaryUltraLight },
                        ]}
                        onPress={() =>
                            navigation.navigate("SettleFriend", {
                                friendId: friend._id,
                                friend,
                            })
                        }
                    >
                        <Text style={[st.actTxt, { color: COLORS.primary }]}>
                            Settle Up
                        </Text>
                    </TouchableOpacity>
                ) : balance > 0 ? (
                    <TouchableOpacity
                        style={[
                            st.actBtn,
                            { backgroundColor: COLORS.primaryUltraLight },
                        ]}
                        onPress={() =>
                            navigation.navigate("FriendDetail", {
                                friendId: friend._id,
                            })
                        }
                    >
                        <Text style={[st.actTxt, { color: COLORS.primary }]}>
                            Remind
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[st.actBtn, { backgroundColor: "#F3F4F6" }]}
                        onPress={() =>
                            navigation.navigate("FriendDetail", {
                                friendId: friend._id,
                            })
                        }
                    >
                        <Text style={[st.actTxt, { color: COLORS.text2 }]}>
                            View History
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[st.actBtn, { backgroundColor: "#D1FAE5" }]}
                    onPress={() =>
                        friend.phone &&
                        Linking.openURL(
                            `whatsapp://send?phone=${friend.phone.replace(/\D/g, "")}`,
                        )
                    }
                >
                    <Text style={[st.actTxt, { color: "#065F46" }]}>
                        💬 WhatsApp
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[st.actBtn, { backgroundColor: "#FEF3C7" }]}
                    onPress={() =>
                        friend.phone && Linking.openURL(`tel:${friend.phone}`)
                    }
                >
                    <Text style={[st.actTxt, { color: "#92400E" }]}>
                        📞 Call
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FriendsScreen({ navigation }) {
    const [friends, setFriends] = useState([]);
    const [stats, setStats] = useState({
        totalOwedToYou: 0,
        totalYouOwe: 0,
        friendCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const load = useCallback(
        async (isRefresh = false) => {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");
            const res = await fetchFriends({
                filter: FILTER_MAP[filter] || "all",
                search,
            });

            console.log(JSON.stringify(res));
            if (res.ok) {
                setFriends(res.data.friends || []);
                setStats(
                    res.data.stats || {
                        totalOwedToYou: 0,
                        totalYouOwe: 0,
                        friendCount: 0,
                    },
                );
            } else {
                setError(res.message);
            }
            setLoading(false);
            setRefreshing(false);
        },
        [filter, search],
    );

    useEffect(() => {
        load();
    }, [filter]);

    return (
        <View style={st.container}>
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
                {/* Hero */}
                <LinearGradient
                    colors={COLORS.gradientGreen}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={st.hero}
                >
                    <Text style={st.heroTitle}>Friends & Balances</Text>
                    <View style={st.heroStats}>
                        {[
                            {
                                val: `₹${(stats.totalOwedToYou || 0).toLocaleString("en-IN")}`,
                                lbl: "Owed to You",
                                col: "#A7F3D0",
                            },
                            {
                                val: `₹${(stats.totalYouOwe || 0).toLocaleString("en-IN")}`,
                                lbl: "You Owe",
                                col: "#FCA5A5",
                            },
                            {
                                val: String(
                                    stats.friendCount || friends.length,
                                ),
                                lbl: "Friends",
                                col: "#fff",
                            },
                        ].map((s) => (
                            <View key={s.lbl} style={st.heroStat}>
                                <Text
                                    style={[st.heroStatVal, { color: s.col }]}
                                >
                                    {s.val}
                                </Text>
                                <Text style={st.heroStatLbl}>{s.lbl}</Text>
                            </View>
                        ))}
                    </View>
                </LinearGradient>

                {/* Search + Add */}
                <View style={st.searchRow}>
                    <View style={{ flex: 1 }}>
                        <SearchBar
                            placeholder="Search friends..."
                            value={search}
                            onChangeText={setSearch}
                            onSubmitEditing={() => load()}
                            style={{ marginHorizontal: 0, marginBottom: 0 }}
                        />
                    </View>
                    <TouchableOpacity
                        style={st.addBtn}
                        onPress={() =>
                            navigation.navigate("AddFriend", { onAdded: load })
                        }
                        activeOpacity={0.85}
                    >
                        <Text style={st.addBtnTxt}>+</Text>
                    </TouchableOpacity>
                </View>

                <FilterChipRow
                    chips={FILTERS}
                    activeChip={filter}
                    onSelect={setFilter}
                    style={{ marginTop: 4 }}
                />

                <View style={st.body}>
                    {/* Loading */}
                    {loading && (
                        <View style={st.center}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                            />
                            <Text style={st.loadingTxt}>
                                Loading friends...
                            </Text>
                        </View>
                    )}

                    {/* Error */}
                    {!loading && !!error && (
                        <View style={st.stateCard}>
                            <Text style={{ fontSize: 32 }}>⚠️</Text>
                            <Text style={st.stateTitle}>
                                Couldn't load friends
                            </Text>
                            <Text style={st.stateMsg}>{error}</Text>
                            <TouchableOpacity
                                style={st.retryBtn}
                                onPress={() => load()}
                            >
                                <Text style={st.retryTxt}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Empty */}
                    {!loading && !error && friends.length === 0 && (
                        <View style={st.stateCard}>
                            <Text style={{ fontSize: 40 }}>🤝</Text>
                            <Text style={st.stateTitle}>
                                {filter !== "All"
                                    ? `No "${filter}" friends`
                                    : "No friends yet"}
                            </Text>
                            <Text style={st.stateMsg}>
                                {filter !== "All"
                                    ? "Try a different filter."
                                    : "Add a friend to start splitting expenses together."}
                            </Text>
                            {filter === "All" && (
                                <TouchableOpacity
                                    style={[st.retryBtn, { marginTop: 10 }]}
                                    onPress={() =>
                                        navigation.navigate("AddFriend", {
                                            onAdded: load,
                                        })
                                    }
                                >
                                    <Text style={st.retryTxt}>
                                        + Add Friend
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* List */}
                    {!loading && !error && friends.length > 0 && (
                        <>
                            <Text style={st.sectionHdr}>Balances</Text>
                            {friends.map((friend) => (
                                <FriendCard
                                    key={friend._id}
                                    friend={friend}
                                    navigation={navigation}
                                />
                            ))}
                        </>
                    )}

                    {/* Add friend dashed button */}
                    {!loading && !error && (
                        <TouchableOpacity
                            style={st.addDashed}
                            onPress={() =>
                                navigation.navigate("AddFriend", {
                                    onAdded: load,
                                })
                            }
                            activeOpacity={0.8}
                        >
                            <Text style={{ fontSize: 18 }}>🤝</Text>
                            <Text style={st.addDashedTxt}> Add a Friend</Text>
                        </TouchableOpacity>
                    )}

                    <View style={{ height: 24 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const st = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    hero: { padding: 18, paddingBottom: 20 },
    heroTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
        marginBottom: 12,
    },
    heroStats: { flexDirection: "row", gap: 8 },
    heroStat: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 10,
        alignItems: "center",
    },
    heroStatVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
    heroStatLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: "rgba(255,255,255,0.75)",
        marginTop: 2,
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingTop: 12,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    addBtnTxt: {
        fontSize: 24,
        color: "#fff",
        lineHeight: 28,
        fontFamily: FONTS.nunito.black,
    },
    body: { paddingHorizontal: 14 },
    sectionHdr: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    center: { alignItems: "center", paddingVertical: 40, gap: 10 },
    loadingTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    stateCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 28,
        alignItems: "center",
        gap: 8,
        ...SHADOWS.card,
    },
    stateTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
    },
    stateMsg: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        textAlign: "center",
        lineHeight: 20,
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
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        ...SHADOWS.card,
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: "#fff",
    },
    name: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    status: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 1,
    },
    amount: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
    actions: { flexDirection: "row", gap: 8 },
    actBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: "center" },
    actTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
    addDashed: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderStyle: "dashed",
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primaryUltraLight,
        marginTop: 4,
    },
    addDashedTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.primary,
    },
});
