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
    settleFriend,
    getFriendColor,
    getFriendInitials,
} from "../../api/friends";

const PAY_METHODS = [
    { id: "upi", icon: "📱", label: "UPI / GPay / PhonePe" },
    { id: "cash", icon: "💵", label: "Cash" },
    { id: "bank", icon: "🏦", label: "Bank Transfer" },
];

export default function SettleFriendScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { friendId, friend, onSettled } = route.params || {};

    const balance = Math.abs(friend?.balance || 0);
    const initials =
        friend?.initials || getFriendInitials(friend?.friendName || "");
    const color =
        friend?.avatarColor || getFriendColor(friend?.friendName || "");
    const isYouOwe = (friend?.balance || 0) > 0; // negative = you owe

    const [amount, setAmount] = useState(String(balance));
    const [method, setMethod] = useState("upi");
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSettle = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError("Enter a valid amount.");
            return;
        }
        setError("");
        setSaving(true);
        const res = await settleFriend(friendId, {
            amount: Number(amount),
            method,
            note: note.trim() || undefined,
        });
        setSaving(false);
        if (res.ok) {
            if (onSettled) onSettled();
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
                        <Text style={s.backTxt}>← Back</Text>
                    </TouchableOpacity>

                    <View style={s.heroRow}>
                        <View style={[s.avatar, { backgroundColor: color }]}>
                            <Text style={s.avatarTxt}>{initials}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.heroTitle}>💰 Settle Up</Text>
                            <Text style={s.heroSub}>
                                {isYouOwe
                                    ? `You owe ${friend?.friendName?.split(" ")[0]}`
                                    : `${friend?.friendName?.split(" ")[0]} owes you`}
                            </Text>
                        </View>
                    </View>

                    {/* Balance display */}
                    <View style={s.balanceBox}>
                        <Text style={s.balanceLbl}>Outstanding Balance</Text>
                        <Text style={s.balanceAmt}>
                            ₹{balance.toLocaleString("en-IN")}
                        </Text>
                    </View>
                </LinearGradient>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={s.body}>
                        <View style={s.card}>
                            {/* Amount */}
                            <Text style={s.fieldLbl}>Settlement Amount</Text>
                            <View style={s.amtRow}>
                                <Text style={s.amtRs}>₹</Text>
                                <TextInput
                                    style={s.amtInput}
                                    value={amount}
                                    onChangeText={(v) =>
                                        setAmount(v.replace(/[^0-9.]/g, ""))
                                    }
                                    keyboardType="decimal-pad"
                                    selectTextOnFocus
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => setAmount(String(balance))}
                                style={s.fullAmtBtn}
                            >
                                <Text style={s.fullAmtTxt}>
                                    Settle full ₹
                                    {balance.toLocaleString("en-IN")}
                                </Text>
                            </TouchableOpacity>

                            {/* Payment method */}
                            <Text style={[s.fieldLbl, { marginTop: 16 }]}>
                                Payment Method
                            </Text>
                            <View style={{ gap: 8, marginBottom: 14 }}>
                                {PAY_METHODS.map((m) => (
                                    <TouchableOpacity
                                        key={m.id}
                                        onPress={() => setMethod(m.id)}
                                        style={[
                                            s.methodRow,
                                            method === m.id &&
                                                s.methodRowActive,
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={{ fontSize: 20 }}>
                                            {m.icon}
                                        </Text>
                                        <Text
                                            style={[
                                                s.methodTxt,
                                                method === m.id &&
                                                    s.methodTxtActive,
                                            ]}
                                        >
                                            {m.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Note */}
                            <Text style={s.fieldLbl}>Note (optional)</Text>
                            <TextInput
                                style={s.input}
                                value={note}
                                onChangeText={setNote}
                                placeholder="e.g. Final settlement, via PhonePe..."
                                placeholderTextColor={COLORS.text3}
                            />

                            {/* Preview */}
                            <View style={s.previewBox}>
                                <Text style={s.previewTitle}>
                                    After Settlement
                                </Text>
                                <View style={s.previewRow}>
                                    <Text style={s.previewL}>Settling</Text>
                                    <Text
                                        style={[
                                            s.previewV,
                                            { color: COLORS.primary },
                                        ]}
                                    >
                                        ₹
                                        {Number(amount || 0).toLocaleString(
                                            "en-IN",
                                        )}
                                    </Text>
                                </View>
                                <View style={s.previewRow}>
                                    <Text style={s.previewL}>
                                        Remaining balance
                                    </Text>
                                    <Text
                                        style={[
                                            s.previewV,
                                            {
                                                color:
                                                    Math.max(
                                                        0,
                                                        balance -
                                                            Number(amount || 0),
                                                    ) > 0
                                                        ? COLORS.danger
                                                        : COLORS.primary,
                                            },
                                        ]}
                                    >
                                        ₹
                                        {Math.max(
                                            0,
                                            balance - Number(amount || 0),
                                        ).toLocaleString("en-IN")}
                                        {Math.max(
                                            0,
                                            balance - Number(amount || 0),
                                        ) === 0
                                            ? " ✅"
                                            : ""}
                                    </Text>
                                </View>
                            </View>

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
                        style={[s.saveBtn, saving && { opacity: 0.7 }]}
                        onPress={handleSettle}
                        disabled={saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={s.saveBtnTxt}>
                                ✅ Confirm Settlement
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
        gap: 12,
        marginTop: 8,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarTxt: { fontFamily: FONTS.nunito.black, fontSize: 20, color: "#fff" },
    heroTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    heroSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    balanceBox: {
        backgroundColor: "rgba(0,0,0,0.15)",
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
        alignItems: "center",
    },
    balanceLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.7)",
        marginBottom: 4,
    },
    balanceAmt: {
        fontFamily: FONTS.nunito.black,
        fontSize: 30,
        color: "#fff",
        letterSpacing: -1,
    },
    body: { padding: 14 },
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
        marginBottom: 8,
    },
    amtRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 8,
    },
    amtRs: {
        fontFamily: FONTS.nunito.black,
        fontSize: 22,
        color: COLORS.text2,
        marginRight: 6,
    },
    amtInput: {
        flex: 1,
        fontFamily: FONTS.nunito.black,
        fontSize: 28,
        color: COLORS.text,
        letterSpacing: -1,
    },
    fullAmtBtn: { alignSelf: "flex-end", marginBottom: 4 },
    fullAmtTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.primary,
    },
    methodRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        backgroundColor: "#F9FAFB",
    },
    methodRowActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    methodTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    methodTxtActive: { color: COLORS.primary },
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
    previewBox: {
        backgroundColor: COLORS.primaryUltraLight,
        borderRadius: 12,
        padding: 12,
        marginTop: 14,
    },
    previewTitle: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.primary,
        marginBottom: 8,
    },
    previewRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    previewL: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    previewV: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base },
    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        marginTop: 10,
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
    saveBtn: {
        backgroundColor: COLORS.primary,
        padding: 13,
        borderRadius: 14,
        alignItems: "center",
    },
    saveBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
});
