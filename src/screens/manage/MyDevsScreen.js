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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "../../components/shared/SearchBar";
import { FilterChipRow } from "../../components/shared/FilterChip";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchDevelopers,
    deleteDeveloper,
    getDevInitials,
    getDevColor,
    getDevStatusConfig,
} from "../../api/developers";

const ROLE_FILTERS = [
    "All",
    "Frontend",
    "Backend",
    "Full Stack",
    "UI/UX",
    "DevOps",
    "Mobile",
];

export default function MyDevsScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const [devs, setDevs] = useState([]);
    const [stats, setStats] = useState({ totalPaid: 0, totalPending: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    // ─── Load developers ───────────────────────────────────────────────────────
    const loadDevs = useCallback(
        async (isRefresh = false) => {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const params = {};
            if (filter !== "All") params.role = filter;
            if (search.trim()) params.search = search.trim();

            const res = await fetchDevelopers(params);

            if (res.ok) {
                setDevs(res.data.developers || []);
                setStats(res.data.stats || { totalPaid: 0, totalPending: 0 });
            } else {
                setError(res.message);
            }
            setLoading(false);
            setRefreshing(false);
        },
        [filter, search],
    );

    useEffect(() => {
        loadDevs();
    }, [filter]);

    // Search on submit
    const handleSearch = () => loadDevs();

    // ─── Delete dev ────────────────────────────────────────────────────────────
    const handleDelete = (dev) => {
        Alert.alert(
            "Remove Developer",
            `Remove ${dev.name} from your team? This is blocked if they are active on a project.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        const res = await deleteDeveloper(dev._id);
                        if (res.ok) loadDevs();
                        else Alert.alert("Cannot Remove", res.message);
                    },
                },
            ],
        );
    };

    return (
        <View style={s.container}>
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
                    <Text style={s.backText}>← Back</Text>
                </TouchableOpacity>
                <View style={s.headerTop}>
                    <Text style={s.headerTitle}>👨‍💻 My Developers</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("AddDevForm", {
                                onAdded: loadDevs,
                            })
                        }
                        style={s.addBtn}
                    >
                        <Text style={s.addBtnText}>+ Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats bar */}
                {!loading && (
                    <View style={s.statsRow}>
                        <View style={s.statBox}>
                            <Text style={s.statVal}>
                                ₹
                                {(stats.totalPaid || 0).toLocaleString("en-IN")}
                            </Text>
                            <Text style={s.statLbl}>Total Paid</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={[s.statVal, { color: "#FCA5A5" }]}>
                                ₹
                                {(stats.totalPending || 0).toLocaleString(
                                    "en-IN",
                                )}
                            </Text>
                            <Text style={s.statLbl}>Pending</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={s.statVal}>{devs.length}</Text>
                            <Text style={s.statLbl}>Developers</Text>
                        </View>
                    </View>
                )}
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadDevs(true)}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <SearchBar
                    placeholder="Search developers..."
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    style={{ marginTop: 12 }}
                />
                <FilterChipRow
                    chips={ROLE_FILTERS}
                    activeChip={filter}
                    onSelect={setFilter}
                />

                <View style={s.body}>
                    {/* Loading */}
                    {loading && (
                        <View style={s.center}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                            />
                            <Text style={s.loadingText}>
                                Loading developers...
                            </Text>
                        </View>
                    )}

                    {/* Error */}
                    {!loading && error ? (
                        <View style={s.errorCard}>
                            <Text style={s.errorEmoji}>⚠️</Text>
                            <Text style={s.errorMsg}>{error}</Text>
                            <TouchableOpacity
                                style={s.retryBtn}
                                onPress={() => loadDevs()}
                            >
                                <Text style={s.retryText}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {/* Empty */}
                    {!loading && !error && devs.length === 0 && (
                        <View style={s.emptyCard}>
                            <Text style={{ fontSize: 36 }}>👨‍💻</Text>
                            <Text style={s.emptyTitle}>No developers yet</Text>
                            <Text style={s.emptyMsg}>
                                Tap "+ Add" to add your first team member.
                            </Text>
                            <TouchableOpacity
                                style={[s.retryBtn, { marginTop: 8 }]}
                                onPress={() =>
                                    navigation.navigate("AddDevForm", {
                                        onAdded: loadDevs,
                                    })
                                }
                            >
                                <Text style={s.retryText}>+ Add Developer</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* List */}
                    {!loading && !error && devs.length > 0 && (
                        <>
                            <Text style={s.sectionHeader}>
                                Your Team ({devs.length})
                            </Text>
                            {devs.map((dev) => {
                                const isActive = dev.status === "active";
                                const statusCfg = getDevStatusConfig(dev);
                                const initials = getDevInitials(dev.name);
                                const color = getDevColor(dev.name);

                                return (
                                    <View
                                        key={dev._id}
                                        style={[
                                            s.card,
                                            !isActive && s.cardInactive,
                                        ]}
                                    >
                                        <View style={s.devTop}>
                                            <View
                                                style={[
                                                    s.av,
                                                    {
                                                        backgroundColor:
                                                            isActive
                                                                ? color
                                                                : "#9CA3AF",
                                                    },
                                                ]}
                                            >
                                                <Text style={s.avText}>
                                                    {initials}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={[
                                                        s.devName,
                                                        !isActive && {
                                                            color: COLORS.text2,
                                                        },
                                                    ]}
                                                >
                                                    {dev.name}
                                                </Text>
                                                <Text style={s.devRole}>
                                                    {dev.role || "Developer"}
                                                    {dev.phone
                                                        ? ` · ${dev.phone}`
                                                        : ""}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    s.badge,
                                                    {
                                                        backgroundColor:
                                                            statusCfg.bg,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        s.badgeText,
                                                        {
                                                            color: statusCfg.text,
                                                        },
                                                    ]}
                                                >
                                                    {statusCfg.label}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={s.statsGrid}>
                                            {[
                                                {
                                                    lbl: "Total Paid",
                                                    val: `₹${(dev.totalPaid || 0).toLocaleString("en-IN")}`,
                                                    color: COLORS.primary,
                                                },
                                                {
                                                    lbl: "Pending",
                                                    val: `₹${(dev.totalPending || 0).toLocaleString("en-IN")}`,
                                                    color:
                                                        (dev.totalPending ||
                                                            0) > 0
                                                            ? COLORS.danger
                                                            : COLORS.text2,
                                                },
                                                {
                                                    lbl: "Projects",
                                                    val: String(
                                                        dev.projectCount || 0,
                                                    ),
                                                    color: COLORS.text,
                                                },
                                            ].map((st) => (
                                                <View
                                                    key={st.lbl}
                                                    style={s.statItem}
                                                >
                                                    <Text style={s.statItemLbl}>
                                                        {st.lbl}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            s.statItemVal,
                                                            { color: st.color },
                                                        ]}
                                                    >
                                                        {st.val}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                        <View style={s.actions}>
                                            <TouchableOpacity
                                                style={[
                                                    s.actionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#DBEAFE",
                                                    },
                                                ]}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "DevPay",
                                                        {
                                                            devId: dev._id,
                                                            devName: dev.name,
                                                        },
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.actionText,
                                                        { color: "#1D4ED8" },
                                                    ]}
                                                >
                                                    💸 Pay Now
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    s.actionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#D1FAE5",
                                                    },
                                                ]}
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.actionText,
                                                        { color: "#065F46" },
                                                    ]}
                                                >
                                                    💬 WhatsApp
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    s.actionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#F3F4F6",
                                                    },
                                                ]}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "DevDetail",
                                                        { devId: dev._id },
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.actionText,
                                                        { color: COLORS.text2 },
                                                    ]}
                                                >
                                                    👁 View
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </>
                    )}

                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 18 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
        flex: 1,
    },
    addBtn: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    addBtnText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    statsRow: { flexDirection: "row", gap: 8, marginTop: 14 },
    statBox: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 10,
        padding: 8,
        alignItems: "center",
    },
    statVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.lg2,
        color: "#fff",
    },
    statLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: "rgba(255,255,255,0.75)",
        marginTop: 2,
    },
    body: { paddingHorizontal: 14 },
    center: { alignItems: "center", paddingVertical: 40, gap: 10 },
    loadingText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    sectionHeader: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    errorCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 24,
        alignItems: "center",
        gap: 8,
        ...SHADOWS.card,
    },
    errorEmoji: { fontSize: 28 },
    errorMsg: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.danger,
        textAlign: "center",
    },
    retryBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    retryText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    emptyCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 28,
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
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        ...SHADOWS.card,
    },
    cardInactive: {
        borderWidth: 1.5,
        borderColor: COLORS.border,
        opacity: 0.75,
    },
    devTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    av: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
    },
    avText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: "#fff",
    },
    devName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    devRole: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 1,
    },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    badgeText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
    statsGrid: { flexDirection: "row", gap: 8, marginBottom: 10 },
    statItem: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 9,
        padding: 7,
    },
    statItemLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm,
        color: COLORS.text2,
    },
    statItemVal: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        marginTop: 2,
    },
    actions: { flexDirection: "row", gap: 6 },
    actionBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: "center" },
    actionText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
});
