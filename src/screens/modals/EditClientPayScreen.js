import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PaymentMethodPicker from "../../components/shared/PaymentMethodPicker";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    updateClientPayment,
    isoToDisplay,
    isoToShort,
} from "../../api/projects";

function Field({ label, children }) {
    return (
        <View style={s.formRow}>
            <Text style={s.label}>{label}</Text>
            {children}
        </View>
    );
}
function Input({ value, onChangeText, placeholder, keyboardType }) {
    return (
        <TextInput
            style={s.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.text3}
            keyboardType={keyboardType}
            autoCapitalize="none"
        />
    );
}

export default function EditClientPayScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const {
        projectId,
        payment,
        projectName = "",
        onSaved,
    } = route.params || {};

    const [label, setLabel] = useState(payment?.label || "");
    const [amount, setAmount] = useState(String(payment?.amount || ""));
    const [date, setDate] = useState(
        payment?.date ? isoToDisplay(payment.date) : "",
    );
    const [method, setMethod] = useState(payment?.method || "upi");
    const [reference, setRef] = useState(payment?.reference || "");
    const [note, setNote] = useState(payment?.note || "");
    const [status, setStatus] = useState(payment?.status || "paid");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        setError("");
        if (!label.trim()) {
            setError("Payment label is required.");
            return;
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError("Valid amount is required.");
            return;
        }
        setLoading(true);
        const res = await updateClientPayment(projectId, payment._id, {
            label,
            amount: Number(amount),
            date,
            method,
            reference,
            note,
            status,
        });
        setLoading(false);
        if (res.ok) {
            if (onSaved) onSaved();
            navigation.goBack();
        } else setError(res.message);
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
                <Text style={s.headerTitle}>✏️ Edit Payment</Text>
                {projectName ? (
                    <Text style={s.headerSub}>{projectName}</Text>
                ) : null}
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={s.body}>
                    {!!error && (
                        <View style={s.errorBox}>
                            <Text style={s.errorTxt}>⚠️ {error}</Text>
                        </View>
                    )}

                    <View style={s.card}>
                        <Field label="Payment Label">
                            <Input
                                value={label}
                                onChangeText={setLabel}
                                placeholder="e.g. Final Payment, Milestone 2..."
                            />
                        </Field>

                        <View style={s.twoCol}>
                            <View style={{ flex: 1 }}>
                                <Field label="Amount (₹)">
                                    <Input
                                        value={amount}
                                        onChangeText={setAmount}
                                        placeholder="e.g. 5000"
                                        keyboardType="numeric"
                                    />
                                </Field>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Field label="Date">
                                    <Input
                                        value={date}
                                        onChangeText={setDate}
                                        placeholder="DD/MM/YYYY"
                                        keyboardType="numeric"
                                    />
                                </Field>
                            </View>
                        </View>

                        <Field label="Payment Method">
                            <PaymentMethodPicker
                                value={method}
                                onChange={setMethod}
                                options={[
                                    {
                                        id: "upi",
                                        icon: "📱",
                                        label: "UPI / GPay",
                                    },
                                    {
                                        id: "bank",
                                        icon: "🏦",
                                        label: "Bank / NEFT",
                                    },
                                    { id: "cash", icon: "💵", label: "Cash" },
                                    {
                                        id: "cheque",
                                        icon: "🧾",
                                        label: "Cheque",
                                    },
                                ]}
                            />
                        </Field>

                        <Field label="Transaction Reference (optional)">
                            <Input
                                value={reference}
                                onChangeText={setRef}
                                placeholder="e.g. UPI Ref: 123456789"
                            />
                        </Field>

                        <Field label="Notes (optional)">
                            <Input
                                value={note}
                                onChangeText={setNote}
                                placeholder="e.g. Received after follow-up"
                            />
                        </Field>

                        {/* Status toggle */}
                        <Field label="Payment Status">
                            <View style={s.statusRow}>
                                {[
                                    {
                                        id: "paid",
                                        label: "✅ Paid",
                                        bg: "#D1FAE5",
                                        activeBg: COLORS.primary,
                                        activeText: "#fff",
                                    },
                                    {
                                        id: "pending",
                                        label: "⏳ Pending",
                                        bg: "#FEF3C7",
                                        activeBg: "#F59E0B",
                                        activeText: "#fff",
                                    },
                                    {
                                        id: "due",
                                        label: "⚠️ Due",
                                        bg: "#FEE2E2",
                                        activeBg: COLORS.danger,
                                        activeText: "#fff",
                                    },
                                ].map((opt) => (
                                    <TouchableOpacity
                                        key={opt.id}
                                        onPress={() => setStatus(opt.id)}
                                        style={[
                                            s.statusOpt,
                                            {
                                                backgroundColor:
                                                    status === opt.id
                                                        ? opt.activeBg
                                                        : opt.bg,
                                            },
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text
                                            style={[
                                                s.statusOptTxt,
                                                {
                                                    color:
                                                        status === opt.id
                                                            ? opt.activeText
                                                            : COLORS.text,
                                                },
                                            ]}
                                        >
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Field>

                        <TouchableOpacity
                            style={[s.saveBtn, loading && { opacity: 0.65 }]}
                            onPress={handleSave}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={s.saveBtnTxt}>
                                    💾 Save Changes
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

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
    headerTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    headerSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        ...SHADOWS.card,
    },
    formRow: { marginBottom: 14 },
    label: {
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
    },
    twoCol: { flexDirection: "row", gap: 8 },
    statusRow: { flexDirection: "row", gap: 8 },
    statusOpt: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    statusOptTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
    saveBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.xl,
        padding: 14,
        alignItems: "center",
        marginTop: 6,
    },
    saveBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        marginBottom: 12,
    },
    errorTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },
});
