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
import SearchBar from "../../components/shared/SearchBar";
import { FilterChipRow } from "../../components/shared/FilterChip";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchClients,
    deleteClient,
    getClientStatusConfig,
} from "../../api/clients";

const INDUSTRY_FILTERS = [
    "All",
    "Technology",
    "Education",
    "Real Estate",
    "Retail",
    "Finance",
];

export default function MyClientsScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState({
        totalBilled: 0,
        totalReceived: 0,
        totalPending: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    // ─── Load clients ──────────────────────────────────────────────────────────
    const loadClients = useCallback(
        async (isRefresh = false) => {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const params = {};
            if (filter !== "All") params.industry = filter;
            if (search.trim()) params.search = search.trim();

            const res = await fetchClients(params);

            if (res.ok) {
                setClients(res.data.clients || []);
                setStats(
                    res.data.stats || {
                        totalBilled: 0,
                        totalReceived: 0,
                        totalPending: 0,
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
        loadClients();
    }, [filter]);

    const handleSearch = () => loadClients();

    // ─── Call / WhatsApp ───────────────────────────────────────────────────────
    const callClient = (phone) => {
        if (!phone)
            return Alert.alert("No phone", "No phone number for this client.");
        Linking.openURL(`tel:${phone}`);
    };
    const waClient = (phone) => {
        if (!phone)
            return Alert.alert("No phone", "No phone number for this client.");
        const num = phone.replace(/\D/g, "");
        Linking.openURL(`whatsapp://send?phone=${num}`);
    };

    return (
        <View style={s.container}>
            <LinearGradient
                colors={COLORS.gradientBlue}
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
                    <Text style={s.headerTitle}>🏢 My Clients</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("AddClientForm", {
                                onAdded: loadClients,
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
                                ₹{((stats.totalBilled || 0) / 1000).toFixed(0)}k
                            </Text>
                            <Text style={s.statLbl}>Billed</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={[s.statVal, { color: "#A7F3D0" }]}>
                                ₹
                                {((stats.totalReceived || 0) / 1000).toFixed(0)}
                                k
                            </Text>
                            <Text style={s.statLbl}>Received</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={[s.statVal, { color: "#FCA5A5" }]}>
                                ₹{((stats.totalPending || 0) / 1000).toFixed(0)}
                                k
                            </Text>
                            <Text style={s.statLbl}>Pending</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={s.statVal}>{clients.length}</Text>
                            <Text style={s.statLbl}>Clients</Text>
                        </View>
                    </View>
                )}
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadClients(true)}
                        tintColor="#2563eb"
                    />
                }
            >
                <SearchBar
                    placeholder="Search clients..."
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    style={{ marginTop: 12 }}
                />
                <FilterChipRow
                    chips={INDUSTRY_FILTERS}
                    activeChip={filter}
                    onSelect={setFilter}
                />

                <View style={s.body}>
                    {/* Loading */}
                    {loading && (
                        <View style={s.center}>
                            <ActivityIndicator size="large" color="#2563eb" />
                            <Text style={s.loadingText}>
                                Loading clients...
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
                                onPress={() => loadClients()}
                            >
                                <Text style={s.retryText}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {/* Empty */}
                    {!loading && !error && clients.length === 0 && (
                        <View style={s.emptyCard}>
                            <Text style={{ fontSize: 36 }}>🏢</Text>
                            <Text style={s.emptyTitle}>No clients yet</Text>
                            <Text style={s.emptyMsg}>
                                Tap "+ Add" to add your first client.
                            </Text>
                            <TouchableOpacity
                                style={[s.retryBtn, { marginTop: 8 }]}
                                onPress={() =>
                                    navigation.navigate("AddClientForm", {
                                        onAdded: loadClients,
                                    })
                                }
                            >
                                <Text style={s.retryText}>+ Add Client</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* List */}
                    {!loading && !error && clients.length > 0 && (
                        <>
                            <Text style={s.sectionHeader}>
                                Your Clients ({clients.length})
                            </Text>
                            {clients.map((client) => {
                                const pending =
                                    client.totalPending ??
                                    Math.max(
                                        0,
                                        (client.totalBilled || 0) -
                                            (client.totalReceived || 0),
                                    );
                                const statusCfg = getClientStatusConfig(client);

                                return (
                                    <View key={client._id} style={s.card}>
                                        <View style={s.clientTop}>
                                            <View
                                                style={[
                                                    s.clientIcon,
                                                    {
                                                        backgroundColor:
                                                            client.avatarColor ||
                                                            "#E5E7EB",
                                                    },
                                                ]}
                                            >
                                                <Text style={{ fontSize: 20 }}>
                                                    {client.icon || "🏢"}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={s.clientName}>
                                                    {client.name}
                                                </Text>
                                                <Text style={s.clientSub}>
                                                    {client.contactPerson
                                                        ? `${client.contactPerson}`
                                                        : ""}
                                                    {client.phone
                                                        ? ` · ${client.phone}`
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
                                                    lbl: "Total Billed",
                                                    val: `₹${(client.totalBilled || 0).toLocaleString("en-IN")}`,
                                                },
                                                {
                                                    lbl: "Received",
                                                    val: `₹${(client.totalReceived || 0).toLocaleString("en-IN")}`,
                                                    color: COLORS.primary,
                                                },
                                                {
                                                    lbl: "Projects",
                                                    val: String(
                                                        client.projectCount ||
                                                            0,
                                                    ),
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
                                                            st.color
                                                                ? {
                                                                      color: st.color,
                                                                  }
                                                                : {},
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
                                                            COLORS.primaryUltraLight,
                                                    },
                                                ]}
                                                onPress={() =>
                                                    callClient(client.phone)
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.actionText,
                                                        {
                                                            color: COLORS.primary,
                                                        },
                                                    ]}
                                                >
                                                    📞 Call
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
                                                onPress={() =>
                                                    waClient(client.phone)
                                                }
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
                                                            "#DBEAFE",
                                                    },
                                                ]}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "ClientDetail",
                                                        {
                                                            clientId:
                                                                client._id,
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
    clientTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    clientIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    clientName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    clientSub: {
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
        color: COLORS.text,
        marginTop: 2,
    },
    actions: { flexDirection: "row", gap: 6 },
    actionBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: "center" },
    actionText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
});
