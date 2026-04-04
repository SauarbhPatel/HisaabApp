import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import { createExpense, CATEGORIES, toMonthKey } from "../../api/expenses";

// ─── Payment methods (matching backend enum) ──────────────────────────────────
const PAY_METHODS = [
    { id: "upi", icon: "📱", label: "UPI" },
    { id: "cash", icon: "💵", label: "Cash" },
    { id: "card", icon: "💳", label: "Card" },
    { id: "bank", icon: "🏦", label: "Bank" },
];

// ─── Format today as DD/MM/YYYY ───────────────────────────────────────────────
function todayDisplay() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// ─── Parse DD/MM/YYYY → ISO date string ──────────────────────────────────────
function parseDisplayDate(str) {
    const [dd, mm, yyyy] = str.split("/");
    if (!dd || !mm || !yyyy) return new Date().toISOString();
    return new Date(`${yyyy}-${mm}-${dd}`).toISOString();
}

export default function AddExpenseScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();

    // Pre-fill category if coming from ExpenseDetail
    const prefillCategory = route?.params?.prefillCategory || "food";
    const onAdded = route?.params?.onAdded; // callback to refresh parent

    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(prefillCategory);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(todayDisplay());
    const [paidVia, setPaidVia] = useState("upi");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const selectedCat = CATEGORIES.find((c) => c.id === category);

    // ─── Submit ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        setError("");

        const num = parseFloat(amount);
        if (!amount || isNaN(num) || num <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        if (description.trim().length > 200) {
            setError("Description too long (max 200 characters).");
            return;
        }

        setLoading(true);
        const result = await createExpense({
            amount: num,
            category,
            description: description.trim() || undefined,
            date: parseDisplayDate(date),
            paidVia,
            splitType: "solo",
        });
        setLoading(false);

        if (result.ok) {
            if (onAdded) onAdded(); // refresh parent screen
            navigation.goBack();
        } else {
            setError(result.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
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
                    <Text style={styles.headerTitle}>➕ Add Expense</Text>
                </LinearGradient>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.body}>
                        {/* Amount Block */}
                        <View style={styles.amtBlock}>
                            <Text style={styles.amtLbl}>Enter Amount</Text>
                            <View style={styles.amtRow}>
                                <Text style={styles.amtRs}>₹</Text>
                                <TextInput
                                    style={styles.amtInput}
                                    value={amount}
                                    onChangeText={(v) =>
                                        setAmount(v.replace(/[^0-9.]/g, ""))
                                    }
                                    keyboardType="decimal-pad"
                                    placeholder="0"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    autoFocus
                                />
                            </View>
                            {selectedCat && (
                                <View style={styles.selectedCatBadge}>
                                    <Text style={styles.selectedCatText}>
                                        {selectedCat.icon} {selectedCat.label}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Category Grid */}
                        <View style={styles.card}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.catGrid}>
                                {CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.catOpt,
                                            category === cat.id &&
                                                styles.catOptActive,
                                        ]}
                                        onPress={() => setCategory(cat.id)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.catIcon}>
                                            {cat.icon}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.catLbl,
                                                category === cat.id &&
                                                    styles.catLblActive,
                                            ]}
                                        >
                                            {cat.label.split(" ")[0]}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Details */}
                        <View style={styles.card}>
                            {/* Description */}
                            <Text style={styles.label}>
                                Description (optional)
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="What was this for? e.g. Domino's Pizza"
                                placeholderTextColor={COLORS.text3}
                                maxLength={200}
                            />

                            {/* Date */}
                            <Text style={[styles.label, { marginTop: 14 }]}>
                                Date
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={date}
                                onChangeText={setDate}
                                placeholder="DD/MM/YYYY"
                                placeholderTextColor={COLORS.text3}
                                keyboardType="numeric"
                            />

                            {/* Paid via */}
                            <Text style={[styles.label, { marginTop: 14 }]}>
                                Paid via
                            </Text>
                            <View style={styles.payRow}>
                                {PAY_METHODS.map((m) => (
                                    <TouchableOpacity
                                        key={m.id}
                                        style={[
                                            styles.payOpt,
                                            paidVia === m.id &&
                                                styles.payOptActive,
                                        ]}
                                        onPress={() => setPaidVia(m.id)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={{ fontSize: 18 }}>
                                            {m.icon}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.payLbl,
                                                paidVia === m.id &&
                                                    styles.payLblActive,
                                            ]}
                                        >
                                            {m.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Error */}
                            {!!error && (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>
                                        ⚠️ {error}
                                    </Text>
                                </View>
                            )}

                            {/* Submit */}
                            <TouchableOpacity
                                style={[
                                    styles.submitBtn,
                                    loading && { opacity: 0.7 },
                                ]}
                                onPress={handleSave}
                                disabled={loading}
                                activeOpacity={0.85}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitBtnText}>
                                        ✅ Save Expense
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 30 }} />
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 18 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    headerTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    body: { padding: 14 },

    // Amount block
    amtBlock: {
        backgroundColor: COLORS.text,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        marginBottom: 14,
    },
    amtLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.55)",
        marginBottom: 8,
    },
    amtRow: { flexDirection: "row", alignItems: "center" },
    amtRs: {
        fontFamily: FONTS.nunito.black,
        fontSize: 32,
        color: "rgba(255,255,255,0.6)",
        marginRight: 4,
    },
    amtInput: {
        fontFamily: FONTS.nunito.black,
        fontSize: 44,
        color: "#fff",
        letterSpacing: -2,
        minWidth: 80,
        textAlign: "center",
    },
    selectedCatBadge: {
        marginTop: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    selectedCatText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.card,
    },
    label: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginBottom: 10,
    },

    // Category grid
    catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    catOpt: {
        width: "22%",
        alignItems: "center",
        gap: 4,
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#F9FAFB",
    },
    catOptActive: {
        backgroundColor: COLORS.primaryUltraLight,
        borderColor: COLORS.primary,
    },
    catIcon: { fontSize: 20, lineHeight: 24 },
    catLbl: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.xs,
        color: COLORS.text2,
        textAlign: "center",
    },
    catLblActive: { color: COLORS.primary },

    // Input
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text,
    },

    // Pay via
    payRow: { flexDirection: "row", gap: 8 },
    payOpt: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#F9FAFB",
        gap: 4,
    },
    payOptActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    payLbl: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    payLblActive: { color: COLORS.primary },

    // Error
    errorBox: {
        marginTop: 14,
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
    },
    errorText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },

    // Submit
    submitBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.lg,
        padding: 13,
        alignItems: "center",
        marginTop: 16,
    },
    submitBtnText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
});
