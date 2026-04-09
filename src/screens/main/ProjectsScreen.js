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
import TopBar from "../../components/shared/TopBar";
import { FilterChipRow } from "../../components/shared/FilterChip";
import SearchBar from "../../components/shared/SearchBar";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchProjects,
    fetchProjectSummary,
    STATUS_CONFIG,
    progressColor,
    isoToShort,
} from "../../api/projects";
import { getDevInitials, getDevColor } from "../../api/developers";

const FILTERS = ["All", "inprogress", "completed", "onstay", "inactive"];
const FILTER_LABELS = {
    All: "All",
    inprogress: "Active",
    completed: "Completed",
    onstay: "On Stay",
    inactive: "Inactive",
};

// ─── Dev pill on project card ─────────────────────────────────────────────────
function DevPill({ slot, onPress }) {
    const dev = slot.developer || {};
    const name = dev.name || "Dev";
    const paid = slot.paidAmount || 0;
    const agreed = slot.agreedAmount || 0;
    const pct = agreed > 0 ? Math.round((paid / agreed) * 100) : 0;

    let bg = "#FEE2E2",
        textColor = "#991B1B"; // unpaid
    if (pct >= 100) {
        bg = "#D1FAE5";
        textColor = "#065F46";
    } else if (pct > 0) {
        bg = "#FEF3C7";
        textColor = "#92400E";
    }
    if (slot.status === "paused") {
        bg = "#F3F4F6";
        textColor = "#6B7280";
    }

    const label =
        pct >= 100
            ? `${name} · Paid ✅`
            : `${name} · ₹${paid.toLocaleString("en-IN")}/₹${agreed.toLocaleString("en-IN")}`;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[s.devPill, { backgroundColor: bg }]}
            activeOpacity={0.8}
        >
            <View style={[s.devAv, { backgroundColor: getDevColor(name) }]}>
                <Text style={s.devAvTxt}>{getDevInitials(name)}</Text>
            </View>
            <Text style={[s.devPillTxt, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
    );
}

// ─── Single project card ──────────────────────────────────────────────────────
function ProjectCard({ project, navigation, onRefresh }) {
    const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.inprogress;
    const received = project.receivedAmount || 0;
    const total = project.totalPrice || 0;
    const pending = project.pendingAmount ?? Math.max(0, total - received);
    const pct =
        project.paymentPercent ??
        (total > 0 ? Math.round((received / total) * 100) : 0);
    const pColor = progressColor(pct);

    return (
        <TouchableOpacity
            style={s.card}
            onPress={() =>
                navigation.navigate("ProjectDetail", {
                    projectId: project._id,
                    onRefresh,
                })
            }
            activeOpacity={0.85}
        >
            {/* Header row */}
            <View style={s.cardHeader}>
                <View style={[s.clientBadge, { backgroundColor: "#EDE9FE" }]}>
                    <Text style={[s.clientBadgeTxt, { color: "#6C3EF4" }]}>
                        {project.client}
                    </Text>
                </View>
                <View style={[s.statusPill, { backgroundColor: statusCfg.bg }]}>
                    <Text style={[s.statusPillTxt, { color: statusCfg.text }]}>
                        {statusCfg.label}
                    </Text>
                </View>
            </View>

            <Text style={s.projName}>{project.name}</Text>
            <Text style={s.projDate}>
                {isoToShort(project.startDate)}
                {project.endDate ? ` → ${isoToShort(project.endDate)}` : ""}
            </Text>

            {/* Progress */}
            <View style={s.progressWrap}>
                <View style={s.progressLblRow}>
                    <Text style={s.progressLbl}>Payment received</Text>
                    <Text style={[s.progressPct, { color: pColor }]}>
                        {pct}%
                    </Text>
                </View>
                <View style={s.progressTrack}>
                    <View
                        style={[
                            s.progressFill,
                            { width: `${pct}%`, backgroundColor: pColor },
                        ]}
                    />
                </View>
            </View>

            {/* Finance row */}
            <View style={s.finRow}>
                {[
                    {
                        lbl: "Project Price",
                        val: `₹${total.toLocaleString("en-IN")}`,
                        color: COLORS.text,
                    },
                    {
                        lbl: "Received",
                        val: `₹${received.toLocaleString("en-IN")}`,
                        color: COLORS.primary,
                    },
                    {
                        lbl: "Pending",
                        val: `₹${pending.toLocaleString("en-IN")}`,
                        color: pending > 0 ? COLORS.danger : COLORS.text2,
                    },
                ].map((f) => (
                    <View key={f.lbl} style={s.finItem}>
                        <Text style={s.finLbl}>{f.lbl}</Text>
                        <Text style={[s.finVal, { color: f.color }]}>
                            {f.val}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Client payment chips */}
            {(project.clientPayments || []).length > 0 && (
                <View style={s.chips}>
                    {project.clientPayments.slice(0, 2).map((p, i) => (
                        <View
                            key={i}
                            style={[
                                s.chip,
                                p.status === "pending" || p.status === "due"
                                    ? s.chipDue
                                    : s.chipPaid,
                            ]}
                        >
                            <Text
                                style={[
                                    s.chipTxt,
                                    p.status !== "paid"
                                        ? { color: "#92400E" }
                                        : { color: "#6C3EF4" },
                                ]}
                            >
                                {p.status === "paid"
                                    ? `📥 ${isoToShort(p.date)} · ₹${p.amount.toLocaleString("en-IN")}`
                                    : `⏰ ₹${p.amount.toLocaleString("en-IN")} due`}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Developers */}
            {(project.developers || []).filter((d) => d.status !== "removed")
                .length > 0 && (
                <>
                    <Text style={s.devsLbl}>Developers</Text>
                    <View style={s.devPills}>
                        {project.developers
                            .filter((d) => d.status !== "removed")
                            .map((slot) => (
                                <DevPill
                                    key={slot._id}
                                    slot={slot}
                                    onPress={() =>
                                        navigation.navigate("DevPay", {
                                            projectId: project._id,
                                            devSlotId: slot._id,
                                            devName: slot.developer?.name,
                                            agreedAmount: slot.agreedAmount,
                                            paidAmount: slot.paidAmount,
                                        })
                                    }
                                />
                            ))}
                    </View>
                </>
            )}

            {/* Actions */}
            <View style={s.cardActions}>
                <TouchableOpacity
                    style={[
                        s.actionBtn,
                        { backgroundColor: COLORS.primaryUltraLight },
                    ]}
                    onPress={() =>
                        navigation.navigate("ProjectDetail", {
                            projectId: project._id,
                            onRefresh,
                        })
                    }
                    activeOpacity={0.8}
                >
                    <Text style={[s.actionBtnTxt, { color: COLORS.primary }]}>
                        👁 Details
                    </Text>
                </TouchableOpacity>
                {/* {project.status !== "completed" &&
                    (project.developers || []).some(
                        (d) => d.status === "active",
                    ) && (
                        <TouchableOpacity
                            style={[
                                s.actionBtn,
                                { backgroundColor: "#DBEAFE" },
                            ]}
                            onPress={() =>
                                navigation.navigate("DevPay", {
                                    projectId: project._id,
                                })
                            }
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[s.actionBtnTxt, { color: "#1D4ED8" }]}
                            >
                                💸 Pay Dev
                            </Text>
                        </TouchableOpacity>
                    )} */}
                <TouchableOpacity
                    style={[s.actionBtn, { backgroundColor: "#FEF3C7" }]}
                    activeOpacity={0.8}
                >
                    <Text style={[s.actionBtnTxt, { color: "#92400E" }]}>
                        🧾 Invoice
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

// ─── Group projects by YYYY-MM of startDate ───────────────────────────────────
function groupByMonth(projects) {
    const groups = {};
    projects.forEach((p) => {
        const d = new Date(p.startDate);
        const label = `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()]} ${d.getFullYear()}`;
        if (!groups[label])
            groups[label] = { label, projects: [], totalReceived: 0 };
        groups[label].projects.push(p);
        groups[label].totalReceived += p.receivedAmount || 0;
    });
    return Object.values(groups);
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ProjectsScreen({ navigation }) {
    const [year, setYear] = useState(new Date().getFullYear());
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [projects, setProjects] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadData = useCallback(
        async (isRefresh = false) => {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const params = { year };
            if (filter !== "All") params.status = filter;
            if (search.trim()) params.search = search.trim();
            console.log(params);
            const [projRes, sumRes] = await Promise.all([
                fetchProjects(params),
                fetchProjectSummary(year),
            ]);

            if (projRes.ok) setProjects(projRes.data.projects || []);
            else setError(projRes.message);

            if (sumRes.ok) setSummary(sumRes.data.summary);

            setLoading(false);
            setRefreshing(false);
        },
        [year, filter, search],
    );

    useEffect(() => {
        loadData();
    }, [year, filter]);
    useEffect(() => {
        if ((search.trim() && search.trim().length >= 3) || search.length == 0)
            loadData();
    }, [search]);

    const grouped = groupByMonth(projects);
    const chips = FILTERS.map((f) => FILTER_LABELS[f] || f);
    const activeChip = FILTER_LABELS[filter] || filter;

    return (
        <View style={s.container}>
            <TopBar navigation={navigation} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadData(true)}
                        tintColor="#2563eb"
                    />
                }
            >
                {/* Hero */}
                <LinearGradient
                    colors={COLORS.gradientBlue}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.hero}
                >
                    <Text style={s.heroTitle}>💼 Freelance Projects</Text>
                    <Text style={s.heroSub}>
                        Track income, clients & developer payments
                    </Text>
                    <View style={s.heroStats}>
                        {[
                            {
                                val: summary
                                    ? `₹${((summary.totalReceived || 0) / 1000).toFixed(0)}k`
                                    : "...",
                                lbl: "Received",
                            },
                            {
                                val: summary
                                    ? `₹${((summary.totalPending || 0) / 1000).toFixed(0)}k`
                                    : "...",
                                lbl: "Pending",
                            },
                            {
                                val: summary
                                    ? String(summary.byStatus?.inprogress || 0)
                                    : "...",
                                lbl: "Active",
                            },
                        ].map((st) => (
                            <View key={st.lbl} style={s.heroStat}>
                                <Text style={s.heroStatVal}>{st.val}</Text>
                                <Text style={s.heroStatLbl}>{st.lbl}</Text>
                            </View>
                        ))}
                    </View>
                    {summary && summary.netProfit > 0 && (
                        <View style={s.incomeBanner}>
                            <Text>💰</Text>
                            <Text style={s.incomeBannerTxt}>
                                {year} Income: ₹
                                {(summary.totalReceived || 0).toLocaleString(
                                    "en-IN",
                                )}{" "}
                                · Net Profit: ₹
                                {(summary.netProfit || 0).toLocaleString(
                                    "en-IN",
                                )}
                            </Text>
                        </View>
                    )}
                </LinearGradient>

                <View style={s.body}>
                    {/* Year + New Project */}
                    <View style={s.topRow}>
                        <View style={s.yearRow}>
                            <Text style={s.yearLbl}>{year} Projects</Text>
                            <View style={s.yearPicker}>
                                <TouchableOpacity
                                    onPress={() => setYear((y) => y - 1)}
                                >
                                    <Text style={s.yearArrow}>‹</Text>
                                </TouchableOpacity>
                                <Text style={s.yearNum}>{year}</Text>
                                <TouchableOpacity
                                    onPress={() => setYear((y) => y + 1)}
                                >
                                    <Text style={s.yearArrow}>›</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={s.newBtn}
                            onPress={() =>
                                navigation.navigate("AddProject", {
                                    onAdded: () => loadData(),
                                })
                            }
                            activeOpacity={0.85}
                        >
                            <Text style={s.newBtnTxt}>+ New Project</Text>
                        </TouchableOpacity>
                    </View>

                    <SearchBar
                        placeholder="Search projects, clients..."
                        value={search}
                        onChangeText={setSearch}
                        onSubmitEditing={() => loadData()}
                        style={{ marginHorizontal: 0, marginBottom: 8 }}
                    />
                    <FilterChipRow
                        chips={chips}
                        activeChip={activeChip}
                        onSelect={(label) => {
                            const key =
                                Object.keys(FILTER_LABELS).find(
                                    (k) => FILTER_LABELS[k] === label,
                                ) || label;
                            setFilter(key);
                        }}
                        style={{
                            marginHorizontal: -14,
                            paddingHorizontal: 0,
                            marginBottom: 4,
                        }}
                    />

                    {/* Loading */}
                    {loading && (
                        <View style={s.center}>
                            <ActivityIndicator size="large" color="#2563eb" />
                            <Text style={s.loadingTxt}>
                                Loading projects...
                            </Text>
                        </View>
                    )}

                    {/* Error */}
                    {!loading && error ? (
                        <View style={s.errorCard}>
                            <Text style={{ fontSize: 28 }}>⚠️</Text>
                            <Text style={s.errorMsg}>{error}</Text>
                            <TouchableOpacity
                                style={s.retryBtn}
                                onPress={() => loadData()}
                            >
                                <Text style={s.retryTxt}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {/* Empty */}
                    {!loading && !error && projects.length === 0 && (
                        <View style={s.emptyCard}>
                            <Text style={{ fontSize: 36 }}>💼</Text>
                            <Text style={s.emptyTitle}>No projects yet</Text>
                            <Text style={s.emptyMsg}>
                                Tap "+ New Project" to add your first project.
                            </Text>
                            <TouchableOpacity
                                style={[s.retryBtn, { marginTop: 8 }]}
                                onPress={() =>
                                    navigation.navigate("AddProject", {
                                        onAdded: () => loadData(),
                                    })
                                }
                            >
                                <Text style={s.retryTxt}>+ New Project</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Month groups */}
                    {!loading &&
                        !error &&
                        grouped.map((group) => (
                            <View key={group.label}>
                                <View style={s.monthGroup}>
                                    <Text style={s.monthGroupLbl}>
                                        📅 {group.label}
                                    </Text>
                                    <Text style={s.monthGroupTotal}>
                                        ₹
                                        {group.totalReceived.toLocaleString(
                                            "en-IN",
                                        )}{" "}
                                        received
                                    </Text>
                                </View>
                                {group.projects.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                        navigation={navigation}
                                        onRefresh={() => loadData()}
                                    />
                                ))}
                            </View>
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
    heroTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    heroSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    heroStats: { flexDirection: "row", gap: 8, marginTop: 14 },
    heroStat: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 10,
        alignItems: "center",
    },
    heroStatVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    heroStatLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.xs,
        color: "rgba(255,255,255,0.85)",
        marginTop: 2,
    },
    incomeBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(16,185,129,0.2)",
        borderRadius: 10,
        padding: 8,
        marginTop: 12,
    },
    incomeBannerTxt: {
        fontFamily: FONTS.nunito.semiBold,
        fontSize: SIZES.base,
        color: "#A7F3D0",
        flex: 1,
    },
    body: { padding: 14 },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    yearRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    yearLbl: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    yearPicker: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    yearArrow: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.primary,
    },
    yearNum: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text,
        minWidth: 32,
        textAlign: "center",
    },
    newBtn: {
        backgroundColor: "#1e3a5f",
        borderRadius: RADIUS.lg,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    newBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    center: { alignItems: "center", paddingVertical: 40, gap: 10 },
    loadingTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    errorCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 24,
        alignItems: "center",
        gap: 8,
        ...SHADOWS.card,
    },
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
    retryTxt: {
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
    monthGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        marginBottom: 10,
    },
    monthGroupLbl: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    monthGroupTotal: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.primary,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        ...SHADOWS.card,
        borderWidth: 1.5,
        borderColor: "transparent",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    clientBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    clientBadgeTxt: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm },
    statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    statusPillTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
    projName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    projDate: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 2,
        marginBottom: 10,
    },
    progressWrap: { marginBottom: 10 },
    progressLblRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    progressLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    progressPct: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2 },
    progressTrack: {
        height: 7,
        backgroundColor: "#F3F4F6",
        borderRadius: 99,
        overflow: "hidden",
    },
    progressFill: { height: "100%", borderRadius: 99 },
    finRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
    finItem: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 10,
        padding: 8,
    },
    finLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm,
        color: COLORS.text2,
    },
    finVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        marginTop: 2,
    },
    chips: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 10 },
    chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    chipPaid: { backgroundColor: "#EDE9FE" },
    chipDue: { backgroundColor: "#FEF3C7" },
    chipTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
    devsLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginBottom: 6,
    },
    devPills: {
        flexDirection: "row",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 10,
    },
    devPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    devAv: {
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    devAvTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: 8,
        color: "#fff",
    },
    devPillTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
    cardActions: {
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    actionBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: "center" },
    actionBtnTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
});
