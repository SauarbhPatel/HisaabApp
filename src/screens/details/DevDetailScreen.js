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
import SinglePayPopup from "../../components/shared/popups/SinglePayPopup";
import { DeleteConfirmPopup } from "../../components/shared/popups/ConfirmPopups";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchDeveloper,
    fetchDevPaymentHistory,
    deleteDeveloper,
    getDevInitials,
    getDevColor,
} from "../../api/developers";

const METHOD_ICONS = { upi: "📱", cash: "💵", bank: "🏦", other: "💰" };

const PROJECT_STATUS = {
    completed: { bg: "#D1FAE5", text: "#065F46", label: "Paid ✅" },
    inprogress: { bg: "#FEF3C7", text: "#92400E", label: "Partial" },
    onstay: { bg: "#FEE2E2", text: "#991B1B", label: "Pending" },
    inactive: { bg: "#F3F4F6", text: "#6B7280", label: "Inactive" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
};

export default function DevDetailScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { devId } = route.params || {};

    const [dev, setDev] = useState(null);
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

        const [devRes, histRes] = await Promise.all([
            fetchDeveloper(devId),
            fetchDevPaymentHistory(devId),
        ]);

        if (devRes.ok) {
            setDev(devRes.data.developer);
            setProjects(devRes.data.projects || []);
        } else {
            setError(devRes.message);
        }

        if (histRes.ok) {
            setHistory(histRes.data.history || []);
            setHistStats(histRes.data.stats);
        }

        setLoading(false);
    }, [devId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async () => {
        setDeleting(true);
        const res = await deleteDeveloper(devId);
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
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    if (error || !dev) {
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
                    {error || "Developer not found"}
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

    const initials = getDevInitials(dev.name);
    const color = getDevColor(dev.name);
    const totalAgreed = (dev.totalPaid || 0) + (dev.totalPending || 0);
    const payPct =
        totalAgreed > 0
            ? Math.round(((dev.totalPaid || 0) / totalAgreed) * 100)
            : 0;

    return (
        <View style={s.container}>
            <LinearGradient
                colors={COLORS.gradientAmber}
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
                        <View style={[s.av, { backgroundColor: color }]}>
                            <Text style={s.avText}>{initials}</Text>
                        </View>
                        <View>
                            <Text style={s.devName}>{dev.name}</Text>
                            <Text style={s.devRole}>
                                {dev.role || "Developer"} ·{" "}
                                {dev.status === "active"
                                    ? "● Active"
                                    : "⏸ Inactive"}
                            </Text>
                            {dev.phone ? (
                                <Text style={s.devPhone}>{dev.phone}</Text>
                            ) : null}
                        </View>
                    </View>
                    <View style={s.headerBtns}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("EditDev", {
                                    devId: dev._id,
                                    dev,
                                })
                            }
                            style={s.hdrBtn}
                        >
                            <Text>✏️</Text>
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
                        tintColor={COLORS.accent}
                    />
                }
            >
                <View style={s.body}>
                    {/* Payment Summary */}
                    <TouchableOpacity
                        style={s.card}
                        onPress={() =>
                            navigation.navigate("DevPaymentPage", {
                                devId: dev._id,
                            })
                        }
                        activeOpacity={0.85}
                    >
                        <View style={s.cardTitleRow}>
                            <Text style={s.sectionHeader}>
                                💰 Payment Summary
                            </Text>
                            <Text style={s.link}>Details 🔗</Text>
                        </View>
                        <View style={s.statsRow}>
                            {[
                                {
                                    val: `₹${(dev.totalPaid || 0).toLocaleString("en-IN")}`,
                                    lbl: "Total Paid",
                                    color: COLORS.primary,
                                },
                                {
                                    val: `₹${(dev.totalPending || 0).toLocaleString("en-IN")}`,
                                    lbl: "Pending",
                                    color:
                                        (dev.totalPending || 0) > 0
                                            ? COLORS.danger
                                            : COLORS.text2,
                                },
                                {
                                    val: String(dev.projectCount || 0),
                                    lbl: "Projects",
                                    color: COLORS.text,
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
                        <View style={s.progressLblRow}>
                            <Text style={s.progressLbl}>
                                ₹{(dev.totalPaid || 0).toLocaleString("en-IN")}{" "}
                                paid of ₹{totalAgreed.toLocaleString("en-IN")}
                            </Text>
                            <Text
                                style={[
                                    s.progressPct,
                                    { color: COLORS.primary },
                                ]}
                            >
                                {payPct}%
                            </Text>
                        </View>
                        <View style={s.track}>
                            <View
                                style={[
                                    s.fill,
                                    {
                                        width: `${payPct}%`,
                                        backgroundColor: COLORS.primary,
                                    },
                                ]}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Payment History */}
                    <View style={s.card}>
                        <View style={s.cardTitleRow}>
                            <Text style={s.sectionHeader}>
                                💸 Payment History
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("DevPay", {
                                        devId: dev._id,
                                        devName: dev.name,
                                    })
                                }
                                style={s.payNowBtn}
                            >
                                <Text style={s.payNowText}>+ Pay Now</Text>
                            </TouchableOpacity>
                        </View>

                        {history.length === 0 ? (
                            <Text style={s.emptyRow}>
                                No payments recorded yet.
                            </Text>
                        ) : (
                            history.slice(0, 5).map((p, i) => (
                                <TouchableOpacity
                                    key={`${p.projectId}-${i}`}
                                    style={[
                                        s.histRow,
                                        i ===
                                            Math.min(history.length, 5) - 1 && {
                                            borderBottomWidth: 0,
                                        },
                                    ]}
                                    onPress={() =>
                                        setPayPopup({
                                            label: `${p.project} — Payment`,
                                            date: p.date
                                                ? new Date(
                                                      p.date,
                                                  ).toLocaleDateString("en-IN")
                                                : "—",
                                            method: `${METHOD_ICONS[p.method] || "💰"} ${p.method}`,
                                            amount: `₹${p.amount.toLocaleString("en-IN")}`,
                                            status: "paid",
                                            note:
                                                p.note ||
                                                `For ${p.project} (${p.client})`,
                                        })
                                    }
                                    activeOpacity={0.8}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.histLabel}>
                                            {p.project}
                                        </Text>
                                        <Text style={s.histMeta}>
                                            {p.date
                                                ? new Date(
                                                      p.date,
                                                  ).toLocaleDateString("en-IN")
                                                : "—"}
                                            {` · ${METHOD_ICONS[p.method] || "💰"} ${p.method}`}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            s.histAmt,
                                            { color: COLORS.primary },
                                        ]}
                                    >
                                        ₹{p.amount.toLocaleString("en-IN")}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}

                        {history.length > 5 && (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("DevPaymentPage", {
                                        devId: dev._id,
                                    })
                                }
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
                                    PROJECT_STATUS[p.status] ||
                                    PROJECT_STATUS.inprogress;
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
                                                {p.client} · {p.status}
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

                    {/* Action buttons */}
                    <View style={s.actionsGrid}>
                        {[
                            {
                                label: "💸 Pay Now",
                                bg: COLORS.primary,
                                text: "#fff",
                                onPress: () =>
                                    navigation.navigate("DevPay", {
                                        devId: dev._id,
                                        devName: dev.name,
                                    }),
                            },
                            {
                                label: "💬 WhatsApp",
                                bg: "#D1FAE5",
                                text: "#065F46",
                            },
                            {
                                label: "📞 Call",
                                bg: COLORS.primaryUltraLight,
                                text: COLORS.primary,
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
                type="dev"
                name={dev.name}
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
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    av: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
    },
    avText: { fontFamily: FONTS.nunito.black, fontSize: 22, color: "#fff" },
    devName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    devRole: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.85)",
        marginTop: 2,
    },
    devPhone: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.75)",
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
        color: COLORS.primary,
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
    statVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
    statLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text2,
        marginTop: 2,
    },
    progressLblRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    progressLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    progressPct: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2 },
    track: {
        height: 6,
        backgroundColor: "#F3F4F6",
        borderRadius: 99,
        overflow: "hidden",
    },
    fill: { height: "100%", borderRadius: 99 },
    payNowBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    payNowText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm,
        color: "#fff",
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
