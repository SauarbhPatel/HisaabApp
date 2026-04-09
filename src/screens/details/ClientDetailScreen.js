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
import SinglePayPopup from "../../components/shared/popups/SinglePayPopup";
import { DeleteConfirmPopup } from "../../components/shared/popups/ConfirmPopups";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchClient,
    fetchClientPaymentHistory,
    deleteClient,
    PAY_STATUS_CONFIG,
} from "../../api/clients";

const METHOD_ICONS = {
    upi: "📱",
    cash: "💵",
    bank: "🏦",
    cheque: "🧾",
    other: "💰",
};

export default function ClientDetailScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { clientId } = route.params || {};

    const [client, setClient] = useState(null);
    const [projects, setProjects] = useState([]);
    const [history, setHistory] = useState([]);
    const [histStats, setHistStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [payPopup, setPayPopup] = useState(null);
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");

        const [clientRes, histRes] = await Promise.all([
            fetchClient(clientId),
            fetchClientPaymentHistory(clientId),
        ]);

        if (clientRes.ok) {
            setClient(clientRes.data.client);
            setProjects(clientRes.data.projects || []);
        } else {
            setError(clientRes.message);
        }

        if (histRes.ok) {
            setHistory(histRes.data.history || []);
            setHistStats(histRes.data.stats);
        }

        setLoading(false);
    }, [clientId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async () => {
        setDeleting(true);
        const res = await deleteClient(clientId);
        setDeleting(false);
        if (res.ok) {
            navigation.goBack();
        } else {
            setDeletePopup(false);
            Alert.alert("Cannot Remove", res.message);
        }
    };

    if (loading) {
        return (
            <View
                style={[
                    s.container,
                    { alignItems: "center", justifyContent: "center" },
                ]}
            >
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (error || !client) {
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
                <Text style={{ fontSize: 32 }}>⚠️</Text>
                <Text
                    style={{
                        fontFamily: FONTS.nunito.bold,
                        fontSize: SIZES.lg2,
                        color: COLORS.text,
                        marginTop: 8,
                    }}
                >
                    {error || "Client not found"}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        marginTop: 16,
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 24,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: FONTS.nunito.bold,
                            fontSize: SIZES.md,
                            color: "#fff",
                        }}
                    >
                        ← Go Back
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const totalBilled = client.totalBilled || 0;
    const totalReceived = client.totalReceived || 0;
    const totalPending =
        client.totalPending ?? Math.max(0, totalBilled - totalReceived);
    const payPct =
        totalBilled > 0 ? Math.round((totalReceived / totalBilled) * 100) : 0;

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
                <View style={s.headerContent}>
                    <View style={s.headerLeft}>
                        <View
                            style={[
                                s.clientIcon,
                                {
                                    backgroundColor:
                                        client.avatarColor || "#E5E7EB",
                                },
                            ]}
                        >
                            <Text style={{ fontSize: 26 }}>
                                {client.icon || "🏢"}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.clientName}>{client.name}</Text>
                            {client.contactPerson ? (
                                <Text style={s.clientContact}>
                                    Contact: {client.contactPerson}
                                    {client.phone ? ` · ${client.phone}` : ""}
                                </Text>
                            ) : null}
                            {client.industry ? (
                                <Text style={s.clientIndustry}>
                                    {client.industry}
                                </Text>
                            ) : null}
                        </View>
                    </View>

                    <View style={s.headerBtns}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("EditClient", {
                                    clientId: client._id,
                                    client,
                                })
                            }
                            style={s.hdrBtn}
                        >
                            <Text style={s.hdrBtnIcon}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("ClientStatus", {
                                    clientId: client._id,
                                    clientName: client.name,
                                    currentStatus: client.status,
                                    onChanged: () => loadData(),
                                })
                            }
                            style={s.hdrBtn}
                        >
                            <Text style={s.hdrBtnIcon}>🔄</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={loadData}
                        tintColor="#2563eb"
                    />
                }
            >
                <View style={s.body}>
                    {/* Payment Summary */}
                    <View style={s.card}>
                        <View style={s.cardTitleRow}>
                            <Text style={s.sectionHeader}>
                                💰 Payment Summary
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("AddClientPay", {
                                        clientId: client._id,
                                        clientName: client.name,
                                        totalBilled,
                                        totalReceived,
                                        totalPending,
                                    })
                                }
                                style={s.recordBtn}
                            >
                                <Text style={s.recordBtnText}>+ Record</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.statsRow}>
                            {[
                                {
                                    val: `₹${totalBilled.toLocaleString("en-IN")}`,
                                    lbl: "Total Billed",
                                    color: COLORS.text,
                                },
                                {
                                    val: `₹${totalReceived.toLocaleString("en-IN")}`,
                                    lbl: "Received",
                                    color: COLORS.primary,
                                },
                                {
                                    val: `₹${totalPending.toLocaleString("en-IN")}`,
                                    lbl: "Pending",
                                    color:
                                        totalPending > 0
                                            ? COLORS.danger
                                            : COLORS.text2,
                                },
                            ].map((st) => (
                                <View key={st.lbl} style={s.statBox}>
                                    <Text
                                        style={[s.statVal, { color: st.color }]}
                                    >
                                        {st.val}
                                    </Text>
                                    <Text style={s.statLbl}>{st.lbl}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={s.track}>
                            <View
                                style={[
                                    s.fill,
                                    {
                                        width: `${payPct}%`,
                                        backgroundColor: "#2563eb",
                                    },
                                ]}
                            />
                        </View>
                        <Text style={s.trackNote}>
                            ₹{totalReceived.toLocaleString("en-IN")} received of
                            ₹{totalBilled.toLocaleString("en-IN")} ({payPct}%)
                        </Text>
                    </View>

                    {/* Payment History */}
                    <View style={s.card}>
                        <View style={s.cardTitleRow}>
                            <Text style={s.sectionHeader}>
                                📥 Payment History
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("AddClientPay", {
                                        clientId: client._id,
                                    })
                                }
                                style={s.recordBtn}
                            >
                                <Text style={s.recordBtnText}>+ Record</Text>
                            </TouchableOpacity>
                        </View>

                        {history.length === 0 ? (
                            <Text style={s.emptyRow}>
                                No payments recorded yet.
                            </Text>
                        ) : (
                            history.slice(0, 5).map((p, i) => (
                                <TouchableOpacity
                                    key={p.paymentId || i}
                                    style={[
                                        s.histRow,
                                        i ===
                                            Math.min(history.length, 5) - 1 && {
                                            borderBottomWidth: 0,
                                        },
                                    ]}
                                    onPress={() =>
                                        setPayPopup({
                                            label: p.label,
                                            date: p.date
                                                ? new Date(
                                                      p.date,
                                                  ).toLocaleDateString("en-IN")
                                                : "—",
                                            method: `${METHOD_ICONS[p.method] || "💰"} ${p.method}`,
                                            amount: `₹${p.amount.toLocaleString("en-IN")}`,
                                            status: p.status,
                                            note: p.note || `For ${p.project}`,
                                        })
                                    }
                                    activeOpacity={0.8}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.histLabel}>
                                            {p.label}
                                        </Text>
                                        <Text style={s.histMeta}>
                                            {p.date
                                                ? new Date(
                                                      p.date,
                                                  ).toLocaleDateString("en-IN")
                                                : "—"}
                                            {` · ${METHOD_ICONS[p.method] || "💰"} ${p.method}`}
                                            {` · ${p.project}`}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            s.histAmt,
                                            {
                                                color:
                                                    p.status === "paid"
                                                        ? COLORS.primary
                                                        : COLORS.danger,
                                            },
                                        ]}
                                    >
                                        ₹{p.amount.toLocaleString("en-IN")}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}

                        {history.length > 5 && (
                            <TouchableOpacity
                                style={{ alignItems: "center", paddingTop: 10 }}
                            >
                                <Text
                                    style={[s.link, { fontSize: SIZES.base }]}
                                >
                                    View all {history.length} payments →
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Projects */}
                    {projects.length > 0 && (
                        <View style={s.card}>
                            <Text style={s.sectionHeader}>💼 Projects</Text>
                            {projects.map((p, i) => {
                                const cfg =
                                    PAY_STATUS_CONFIG[p.status] ||
                                    PAY_STATUS_CONFIG.inprogress;
                                const pend = p.pendingAmount || 0;
                                return (
                                    <TouchableOpacity
                                        key={p._id}
                                        style={[
                                            s.histRow,
                                            i === projects.length - 1 && {
                                                borderBottomWidth: 0,
                                            },
                                        ]}
                                        onPress={() =>
                                            navigation.navigate(
                                                "ProjectDetail",
                                                { projectId: p._id },
                                            )
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text style={s.histLabel}>
                                                {p.name}
                                            </Text>
                                            <Text style={s.histMeta}>
                                                {p.startDate
                                                    ? new Date(
                                                          p.startDate,
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                      )
                                                    : "—"}
                                                {` · ₹${(p.totalPrice || 0).toLocaleString("en-IN")}`}
                                                {pend > 0
                                                    ? ` · ₹${pend.toLocaleString("en-IN")} due`
                                                    : ""}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <View
                                                style={[
                                                    s.projBadge,
                                                    { backgroundColor: cfg.bg },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        s.projBadgeText,
                                                        { color: cfg.text },
                                                    ]}
                                                >
                                                    {cfg.label}
                                                </Text>
                                            </View>
                                            <Text style={s.arrow}>›</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {/* Actions */}
                    <View style={s.actionsGrid}>
                        {[
                            {
                                label: "📥 Record Payment",
                                bg: COLORS.primary,
                                text: "#fff",
                                onPress: () =>
                                    navigation.navigate("AddClientPay", {
                                        clientId: client._id,
                                    }),
                            },
                            {
                                label: "💬 WhatsApp",
                                bg: "#D1FAE5",
                                text: "#065F46",
                                onPress: () =>
                                    client.phone &&
                                    Linking.openURL(
                                        `whatsapp://send?phone=${client.phone.replace(/\D/g, "")}`,
                                    ),
                            },
                            {
                                label: "📞 Call",
                                bg: COLORS.primaryUltraLight,
                                text: COLORS.primary,
                                onPress: () =>
                                    client.phone &&
                                    Linking.openURL(`tel:${client.phone}`),
                            },
                            {
                                label: "🗑 Remove",
                                bg: "#FEE2E2",
                                text: COLORS.danger,
                                onPress: () => setDeletePopup(true),
                            },
                        ].map((a) => (
                            <TouchableOpacity
                                key={a.label}
                                style={[s.actionBtn, { backgroundColor: a.bg }]}
                                onPress={a.onPress}
                                activeOpacity={0.8}
                            >
                                <Text style={[s.actionText, { color: a.text }]}>
                                    {a.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>

            <SinglePayPopup
                visible={!!payPopup}
                data={payPopup}
                onClose={() => setPayPopup(null)}
            />
            <DeleteConfirmPopup
                visible={deletePopup}
                onClose={() => setDeletePopup(false)}
                onConfirm={handleDelete}
                loading={deleting}
                type="client"
                name={client.name}
            />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 20 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 6,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        flex: 1,
    },
    clientIcon: {
        width: 54,
        height: 54,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    clientName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    clientContact: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.85)",
        marginTop: 2,
    },
    clientIndustry: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.7)",
        marginTop: 1,
    },
    headerBtns: { flexDirection: "row", gap: 6 },
    hdrBtn: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        marginBottom: 14,
        ...SHADOWS.card,
    },
    cardTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionHeader: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    link: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: "#2563eb",
    },
    recordBtn: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    recordBtnText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm,
        color: "#fff",
    },
    statsRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
    statBox: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg },
    statLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text2,
        marginTop: 2,
    },
    track: {
        height: 6,
        backgroundColor: "#F3F4F6",
        borderRadius: 99,
        overflow: "hidden",
    },
    fill: { height: "100%", borderRadius: 99 },
    trackNote: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 4,
    },
    histRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    histLabel: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    histMeta: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 2,
    },
    histAmt: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
    emptyRow: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text3,
        paddingVertical: 8,
    },
    projBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    projBadgeText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
    arrow: { fontSize: SIZES.md2, color: COLORS.text3 },
    actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    actionBtn: {
        flex: 1,
        minWidth: "45%",
        padding: 11,
        borderRadius: 12,
        alignItems: "center",
    },
    actionText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base },
});
