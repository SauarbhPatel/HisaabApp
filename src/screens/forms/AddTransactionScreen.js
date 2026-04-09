import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    addTransaction,
    getFriendColor,
    getFriendInitials,
} from "../../api/friends";

const PAY_METHODS = [
    { id: "upi", icon: "📱", label: "UPI / GPay" },
    { id: "cash", icon: "💵", label: "Cash" },
    { id: "bank", icon: "🏦", label: "Bank Transfer" },
    { id: "card", icon: "💳", label: "Card" },
];

const todayStr = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};
const parseDate = (str) => {
    if (!str) return new Date().toISOString();
    const [dd, mm, yyyy] = str.split("/");
    if (!dd || !mm || !yyyy) return new Date().toISOString();
    return new Date(`${yyyy}-${mm}-${dd}`).toISOString();
};

const LABEL_SUGGESTIONS = {
    gave: [
        "Lunch split",
        "Cab fare",
        "Groceries",
        "Electricity bill",
        "Movie tickets",
        "Dinner",
        "Coffee",
        "Party expenses",
    ],
    received: [
        "Settled up",
        "Refund",
        "Their share",
        "Split return",
        "Cab refund",
        "Bill settlement",
    ],
};

export default function AddTransactionScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const {
        friendId,
        friend,
        direction: initialType,
        onAdded,
    } = route.params || {};

    const isGave = initialType === "gave";

    const [amount, setAmount] = useState("");
    const [label, setLabel] = useState("");
    const [date, setDate] = useState(todayStr());
    const [method, setMethod] = useState("cash");
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const initials =
        friend?.initials || getFriendInitials(friend?.friendName || "");
    const color =
        friend?.avatarColor || getFriendColor(friend?.friendName || "");

    const gradColors = isGave
        ? ["#991B1B", COLORS.danger]
        : ["#065F46", COLORS.primary];

    const handleSave = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError("Enter a valid amount.");
            return;
        }
        setError("");
        setSaving(true);
        const res = await addTransaction(friendId, {
            direction: initialType,
            label: label.trim() || (isGave ? "You gave" : "You received"),
            amount: Number(amount),
            date: parseDate(date),
            method,
            note: note.trim() || undefined,
        });
        setSaving(false);
        if (res.ok) {
            if (onAdded) onAdded();
            navigation.goBack();
        } else {
            setError(res.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={s.container}>
                {/* Header */}
                <LinearGradient
                    colors={gradColors}
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
                        <View
                            style={[
                                s.dirIcon,
                                { backgroundColor: "rgba(255,255,255,0.2)" },
                            ]}
                        >
                            <Text style={{ fontSize: 20 }}>
                                {isGave ? "↑" : "↓"}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.heroTitle}>
                                {isGave
                                    ? "You Gave Money"
                                    : "You Received Money"}
                            </Text>
                            <Text style={s.heroSub}>
                                {isGave ? "to" : "from"}{" "}
                                {friend?.name || "Friend"}
                            </Text>
                        </View>
                        <View style={[s.avatar, { backgroundColor: color }]}>
                            <Text style={s.avatarTxt}>{initials}</Text>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={s.body}>
                        {/* Amount block */}
                        <View style={s.amtBlock}>
                            <Text style={s.amtLbl}>Enter Amount</Text>
                            <View style={s.amtRow}>
                                <Text style={s.amtRs}>₹</Text>
                                <TextInput
                                    style={s.amtInput}
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
                        </View>

                        <View style={s.card}>
                            {/* Label */}
                            <Text style={s.fieldLbl}>What for?</Text>
                            <TextInput
                                style={s.input}
                                value={label}
                                onChangeText={setLabel}
                                placeholder={
                                    isGave
                                        ? "e.g. Lunch split, Cab fare..."
                                        : "e.g. Settled up, Refund..."
                                }
                                placeholderTextColor={COLORS.text3}
                            />
                            {/* Suggestion chips */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginTop: 8, marginBottom: 14 }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        gap: 6,
                                        paddingBottom: 2,
                                    }}
                                >
                                    {LABEL_SUGGESTIONS[initialType].map((s) => (
                                        <TouchableOpacity
                                            key={s}
                                            onPress={() => setLabel(s)}
                                            style={st.chip}
                                            activeOpacity={0.75}
                                        >
                                            <Text style={st.chipTxt}>{s}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {/* Date */}
                            <Text style={s.fieldLbl}>Date</Text>
                            <TextInput
                                style={[s.input, { marginBottom: 14 }]}
                                value={date}
                                onChangeText={setDate}
                                placeholder="DD/MM/YYYY"
                                placeholderTextColor={COLORS.text3}
                                keyboardType="numeric"
                            />

                            {/* Payment method */}
                            <Text style={s.fieldLbl}>Payment Method</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 8,
                                    marginBottom: 14,
                                    flexWrap: "wrap",
                                }}
                            >
                                {PAY_METHODS.map((m) => (
                                    <TouchableOpacity
                                        key={m.id}
                                        onPress={() => setMethod(m.id)}
                                        style={[
                                            st.methodBtn,
                                            method === m.id &&
                                                st.methodBtnActive,
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text>{m.icon}</Text>
                                        <Text
                                            style={[
                                                st.methodTxt,
                                                method === m.id &&
                                                    st.methodTxtActive,
                                            ]}
                                        >
                                            {m.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Note */}
                            {/* <Text style={s.fieldLbl}>Note (optional)</Text>
                            <TextInput
                                style={s.input}
                                value={note}
                                onChangeText={setNote}
                                placeholder="Any additional details..."
                                placeholderTextColor={COLORS.text3}
                            /> */}

                            {!!error && (
                                <View style={s.errorBox}>
                                    <Text style={s.errorTxt}>⚠️ {error}</Text>
                                </View>
                            )}
                        </View>
                        <View style={{ height: 100 }} />
                    </View>
                </ScrollView>

                {/* Sticky save */}
                <View
                    style={[
                        s.stickyBottom,
                        { paddingBottom: insets.bottom + 12 },
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            s.saveBtn,
                            {
                                backgroundColor: isGave
                                    ? COLORS.danger
                                    : COLORS.primary,
                            },
                            saving && { opacity: 0.7 },
                        ]}
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={s.saveBtnTxt}>
                                {isGave
                                    ? "✅ Save — You Gave"
                                    : "✅ Save — You Received"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 18 },
    backBtn: { marginBottom: 10 },
    backTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    heroRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 8,
    },
    dirIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },
    heroTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    heroSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.75)",
        marginTop: 1,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: "#fff",
    },
    body: { padding: 14 },
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
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        ...SHADOWS.card,
    },
    fieldLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginBottom: 6,
    },
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
        marginBottom: 4,
    },
    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        marginTop: 8,
    },
    errorTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },
    stickyBottom: {
        backgroundColor: "#fff",
        borderTopWidth: 1.5,
        borderTopColor: COLORS.border,
        padding: 12,
    },
    saveBtn: { padding: 13, borderRadius: 14, alignItems: "center" },
    saveBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
});
const st = StyleSheet.create({
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: COLORS.primaryUltraLight,
        borderWidth: 1.5,
        borderColor: "rgba(26,122,94,0.2)",
    },
    chipTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.primary,
    },
    methodBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#F9FAFB",
    },
    methodBtnActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    methodTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    methodTxtActive: { color: COLORS.primary },
});
