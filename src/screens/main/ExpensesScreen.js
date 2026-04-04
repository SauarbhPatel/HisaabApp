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
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchExpenses,
    CATEGORY_META,
    toMonthKey,
    monthKeyToLabel,
    getLastNMonthKeys,
} from "../../api/expenses";

// ─── Generate month filter list (current + 5 previous) ───────────────────────
const MONTH_KEYS = getLastNMonthKeys(6);

export default function ExpensesScreen({ navigation }) {
    const [monthKey, setMonthKey] = useState(MONTH_KEYS[0]);
    const [data, setData] = useState(null); // API response data
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // ─── Load expenses for selected month ─────────────────────────────────────
    const loadData = useCallback(async (key, isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError("");

        const result = await fetchExpenses({ month: key });

        if (result.ok) {
            setData(result.data);
        } else {
            setError(result.message);
        }

        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        loadData(monthKey);
    }, [monthKey]);

    // ─── Top 5 categories for pills (sorted by total, > 0) ───────────────────
    const topPills = data
        ? Object.entries(data.byCategory || {})
              .filter(([, v]) => v.total > 0)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 5)
              .map(([id, v]) => ({
                  label: `${v.icon} ${id.charAt(0).toUpperCase() + id.slice(1)}`,
                  value: `₹${v.total.toLocaleString("en-IN")}`,
              }))
        : [];

    // ─── Category rows (only categories with count > 0) ─────────────────────
    const categoryRows = data
        ? Object.entries(data.byCategory || {})
              .filter(([, v]) => v.count > 0)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([id, v]) => ({
                  id,
                  icon: v.icon,
                  iconBg: CATEGORY_META[id]?.iconBg || "#f3f4f6",
                  name: v.label,
                  count: v.count,
                  total: v.total,
              }))
        : [];

    return (
        <View style={styles.container}>
            <TopBar navigation={navigation} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadData(monthKey, true)}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Hero */}
                <LinearGradient
                    colors={COLORS.gradientDarkGreen}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hero}
                >
                    <Text style={styles.heroLbl}>
                        My Spending — {monthKeyToLabel(monthKey)}
                    </Text>
                    <Text style={styles.heroTotal}>
                        {loading
                            ? "..."
                            : `₹${(data?.totalAmount || 0).toLocaleString("en-IN")}`}
                    </Text>

                    {/* Top category pills */}
                    {topPills.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.pillsRow}
                        >
                            {topPills.map((p) => (
                                <View key={p.label} style={styles.pill}>
                                    <Text style={styles.pillVal}>
                                        {p.value}
                                    </Text>
                                    <Text style={styles.pillLbl}>
                                        {p.label}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </LinearGradient>

                {/* Month filter chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.monthRow}
                    contentContainerStyle={styles.monthRowContent}
                >
                    {MONTH_KEYS.map((mk) => (
                        <TouchableOpacity
                            key={mk}
                            onPress={() => setMonthKey(mk)}
                            style={[
                                styles.chip,
                                monthKey === mk && styles.chipActive,
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    monthKey === mk && styles.chipTextActive,
                                ]}
                            >
                                {monthKeyToLabel(mk)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.body}>
                    {/* Loading */}
                    {loading && (
                        <View style={styles.centerBox}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                            />
                            <Text style={styles.loadingText}>
                                Loading expenses...
                            </Text>
                        </View>
                    )}

                    {/* Error */}
                    {!loading && error ? (
                        <View style={styles.errorCard}>
                            <Text style={styles.errorEmoji}>⚠️</Text>
                            <Text style={styles.errorTitle}>
                                Couldn't load expenses
                            </Text>
                            <Text style={styles.errorMsg}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryBtn}
                                onPress={() => loadData(monthKey)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.retryBtnText}>
                                    Try Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {/* Empty state */}
                    {!loading && !error && categoryRows.length === 0 && (
                        <View style={styles.emptyCard}>
                            <Text style={{ fontSize: 40 }}>💸</Text>
                            <Text style={styles.emptyTitle}>
                                No expenses yet
                            </Text>
                            <Text style={styles.emptyMsg}>
                                Tap + to add your first expense for{" "}
                                {monthKeyToLabel(monthKey)}
                            </Text>
                        </View>
                    )}

                    {/* Category list */}
                    {!loading && categoryRows.length > 0 && (
                        <View style={styles.listCard}>
                            {categoryRows.map((cat, i) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.catRow,
                                        i === categoryRows.length - 1 && {
                                            borderBottomWidth: 0,
                                        },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate("ExpenseDetail", {
                                            categoryId: cat.id,
                                            monthKey,
                                        })
                                    }
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[
                                            styles.catIcon,
                                            { backgroundColor: cat.iconBg },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 18 }}>
                                            {cat.icon}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.catName}>
                                            {cat.name}
                                        </Text>
                                        <Text style={styles.catCount}>
                                            {cat.count}{" "}
                                            {cat.count === 1
                                                ? "entry"
                                                : "entries"}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: "flex-end" }}>
                                        <Text style={styles.catAmt}>
                                            ₹{cat.total.toLocaleString("en-IN")}
                                        </Text>
                                        <Text style={styles.catArrow}>›</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Summary footer */}
                    {!loading && data && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>
                                {data.count || 0} total{" "}
                                {(data.count || 0) === 1
                                    ? "expense"
                                    : "expenses"}{" "}
                                · {monthKeyToLabel(monthKey)}
                            </Text>
                        </View>
                    )}

                    <View style={{ height: 90 }} />
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() =>
                    navigation.navigate("AddExpense", {
                        onAdded: () => loadData(monthKey),
                    })
                }
                activeOpacity={0.85}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },

    // Hero
    hero: { padding: 18, paddingBottom: 20 },
    heroLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.7)",
        marginBottom: 4,
    },
    heroTotal: {
        fontFamily: FONTS.nunito.black,
        fontSize: 36,
        color: "#fff",
        letterSpacing: -1,
    },
    pillsRow: { marginTop: 12 },
    pill: {
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 10,
        padding: 8,
        marginRight: 8,
        alignItems: "center",
        minWidth: 70,
    },
    pillVal: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    pillLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: "rgba(255,255,255,0.75)",
        marginTop: 2,
    },

    // Month chips
    monthRow: { flexGrow: 0 },
    monthRowContent: { paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#fff",
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    chipTextActive: { color: "#fff" },

    // Body
    body: { paddingHorizontal: 14 },

    // Loading
    centerBox: { alignItems: "center", paddingVertical: 40, gap: 10 },
    loadingText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },

    // Error
    errorCard: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 24,
        alignItems: "center",
        gap: 8,
        ...SHADOWS.card,
    },
    errorEmoji: { fontSize: 32 },
    errorTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
    },
    errorMsg: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        textAlign: "center",
    },
    retryBtn: {
        marginTop: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    retryBtnText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },

    // Empty
    emptyCard: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
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

    // Category list
    listCard: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 14,
        ...SHADOWS.card,
    },
    catRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    catIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    catName: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    catCount: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 2,
    },
    catAmt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.danger,
    },
    catArrow: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text3,
        marginTop: 2,
    },

    // Summary
    summaryRow: { alignItems: "center", paddingVertical: 12 },
    summaryText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
    },

    // FAB
    fab: {
        position: "absolute",
        bottom: 72,
        right: 16,
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
        elevation: 10,
    },
    fabText: { fontSize: 28, color: "#fff", lineHeight: 32, fontWeight: "300" },
});
