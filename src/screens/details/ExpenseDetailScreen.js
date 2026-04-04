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
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchExpensesByCategory,
    deleteExpense,
    CATEGORY_META,
    METHOD_META,
    monthKeyToLabel,
    toMonthKey,
} from "../../api/expenses";

// ─── Group entries by date string ─────────────────────────────────────────────
function groupByDate(expenses) {
    const groups = {};
    expenses.forEach((exp) => {
        const d = new Date(exp.date);
        const label = `${d.getDate()} ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()]} ${d.getFullYear()}`;
        if (!groups[label]) groups[label] = [];
        groups[label].push(exp);
    });
    return groups;
}

export default function ExpenseDetailScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { categoryId, monthKey: passedMonthKey } = route.params || {};

    const monthKey = passedMonthKey || toMonthKey();
    const meta = CATEGORY_META[categoryId] || CATEGORY_META.other;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // ─── Load entries ──────────────────────────────────────────────────────────
    const loadData = useCallback(
        async (isRefresh = false) => {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const result = await fetchExpensesByCategory({
                category: categoryId,
                month: monthKey,
            });

            if (result.ok) setData(result.data);
            else setError(result.message);

            setLoading(false);
            setRefreshing(false);
        },
        [categoryId, monthKey],
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ─── Delete expense ────────────────────────────────────────────────────────
    const handleDelete = (expense) => {
        Alert.alert(
            "Delete Expense",
            `Delete "${expense.description || meta.label}" of ₹${expense.amount.toLocaleString("en-IN")}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setDeletingId(expense._id);
                        const res = await deleteExpense(expense._id);
                        setDeletingId(null);
                        if (res.ok) {
                            // Remove from local state
                            setData((prev) => ({
                                ...prev,
                                expenses: prev.expenses.filter(
                                    (e) => e._id !== expense._id,
                                ),
                                total: prev.total - expense.amount,
                                count: prev.count - 1,
                            }));
                        } else {
                            Alert.alert("Error", res.message);
                        }
                    },
                },
            ],
        );
    };

    const grouped = data ? groupByDate(data.expenses || []) : {};

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={COLORS.gradientDarkGreen}
                start={{ x: 0.13, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.header, { paddingTop: insets.top + 6 }]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.catRow}>
                    <View style={styles.catIconWrap}>
                        <Text style={{ fontSize: 24 }}>{meta.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.catName}>
                            {data?.label || meta.label}
                        </Text>
                        <Text style={styles.catSub}>
                            {monthKeyToLabel(monthKey)} · {data?.count || 0}{" "}
                            {(data?.count || 0) === 1 ? "entry" : "entries"}
                        </Text>
                    </View>
                </View>

                <View style={styles.totalBox}>
                    <Text style={styles.totalLbl}>Total Spent</Text>
                    <Text style={styles.totalAmt}>
                        {loading
                            ? "..."
                            : `₹${(data?.total || 0).toLocaleString("en-IN")}`}
                    </Text>
                    <Text style={styles.totalSub}>
                        This month on {data?.label || meta.label}
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadData(true)}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={styles.body}>
                    {/* Loading */}
                    {loading && (
                        <View style={styles.center}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                            />
                        </View>
                    )}

                    {/* Error */}
                    {!loading && error ? (
                        <View style={styles.errorCard}>
                            <Text style={styles.errorEmoji}>⚠️</Text>
                            <Text style={styles.errorMsg}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryBtn}
                                onPress={() => loadData()}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.retryBtnText}>
                                    Try Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {/* Empty */}
                    {!loading &&
                        !error &&
                        (!data?.expenses || data.expenses.length === 0) && (
                            <View style={styles.emptyCard}>
                                <Text style={{ fontSize: 32 }}>
                                    {meta.icon}
                                </Text>
                                <Text style={styles.emptyTitle}>
                                    No entries yet
                                </Text>
                                <Text style={styles.emptyMsg}>
                                    Add an expense in this category to see it
                                    here.
                                </Text>
                            </View>
                        )}

                    {/* Entries grouped by date */}
                    {!loading &&
                        data?.expenses?.length > 0 &&
                        Object.entries(grouped).map(([dateLabel, entries]) => (
                            <View key={dateLabel}>
                                <Text style={styles.dateHeader}>
                                    {dateLabel}
                                </Text>
                                {entries.map((entry) => (
                                    <TouchableOpacity
                                        key={entry._id}
                                        style={styles.entryCard}
                                        onLongPress={() => handleDelete(entry)}
                                        activeOpacity={0.8}
                                    >
                                        <View
                                            style={[
                                                styles.entryIcon,
                                                {
                                                    backgroundColor:
                                                        meta.iconBg,
                                                },
                                            ]}
                                        >
                                            {deletingId === entry._id ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color={COLORS.danger}
                                                />
                                            ) : (
                                                <Text style={{ fontSize: 18 }}>
                                                    {meta.icon}
                                                </Text>
                                            )}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.entryName}>
                                                {entry.description ||
                                                    meta.label}
                                            </Text>
                                            <Text style={styles.entryMeta}>
                                                {METHOD_META[entry.paidVia]
                                                    ?.icon || "💰"}{" "}
                                                {METHOD_META[entry.paidVia]
                                                    ?.label || entry.paidVia}
                                                {entry.note
                                                    ? ` · ${entry.note}`
                                                    : ""}
                                            </Text>
                                        </View>
                                        <Text style={styles.entryAmt}>
                                            ₹
                                            {entry.amount.toLocaleString(
                                                "en-IN",
                                            )}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}

                    {!loading && data?.expenses?.length > 0 && (
                        <Text style={styles.hint}>
                            Long-press an entry to delete
                        </Text>
                    )}

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Sticky bottom */}
            <View
                style={[
                    styles.stickyBottom,
                    { paddingBottom: insets.bottom + 12 },
                ]}
            >
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() =>
                        navigation.navigate("AddExpense", {
                            prefillCategory: categoryId,
                            onAdded: () => loadData(),
                        })
                    }
                    activeOpacity={0.85}
                >
                    <Text style={styles.addBtnText}>➕ Add Entry</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 20 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    catRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 6,
    },
    catIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    catName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    catSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.7)",
        marginTop: 2,
    },
    totalBox: {
        backgroundColor: "rgba(0,0,0,0.15)",
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
        alignItems: "center",
    },
    totalLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.7)",
        marginBottom: 4,
    },
    totalAmt: {
        fontFamily: FONTS.nunito.black,
        fontSize: 30,
        color: "#fff",
        letterSpacing: -1,
    },
    totalSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.6)",
        marginTop: 4,
    },
    scroll: { flex: 1 },
    body: { paddingHorizontal: 14, paddingTop: 14 },
    center: { paddingVertical: 40, alignItems: "center" },
    errorCard: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
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
    retryBtnText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
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
    dateHeader: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 4,
    },
    entryCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        ...SHADOWS.card,
    },
    entryIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },
    entryName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    entryMeta: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 2,
    },
    entryAmt: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.lg2,
        color: COLORS.danger,
    },
    hint: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textAlign: "center",
        paddingVertical: 8,
    },
    stickyBottom: {
        backgroundColor: "#fff",
        borderTopWidth: 1.5,
        borderTopColor: COLORS.border,
        padding: 12,
    },
    addBtn: {
        padding: 13,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: "center",
    },
    addBtnText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
});
