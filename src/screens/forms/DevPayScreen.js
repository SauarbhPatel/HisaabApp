// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import PaymentMethodPicker from '../../components/shared/PaymentMethodPicker';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import { FONTS, SIZES, RADIUS } from '../../theme/typography';

// export default function DevPayScreen({ navigation, route }) {
//   const insets = useSafeAreaInsets();
//   const [project, setProject] = useState('Flatshare Karo (Development)');
//   const [dev, setDev] = useState('Zafran — ₹3,000 remaining');
//   const [amount, setAmount] = useState('3000');
//   const [date, setDate] = useState('21/03/2026');
//   const [payMethod, setPayMethod] = useState('upi');
//   const [note, setNote] = useState('');

//   const PROJECTS_OPTS = ['Flatshare Karo (Development)', 'School ERP (March)', 'Flatshare Karo (UI Update)'];
//   const DEV_OPTS = ['Zafran — ₹3,000 remaining', 'Amit — ₹3,000 remaining', 'Neha — ₹1,000 remaining'];

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={COLORS.gradientAmber} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
//         style={[styles.header, { paddingTop: insets.top + 6 }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>💸 Pay Developer</Text>
//       </LinearGradient>

//       <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
//         <View style={styles.body}>
//           <View style={styles.card}>
//             <Text style={styles.label}>Project</Text>
//             <View style={styles.picker}>
//               {PROJECTS_OPTS.map((opt) => (
//                 <TouchableOpacity key={opt} onPress={() => setProject(opt)}
//                   style={[styles.pickerOpt, project === opt && styles.pickerOptActive]}>
//                   <Text style={[styles.pickerOptText, project === opt && styles.pickerOptTextActive]}>{opt}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <Text style={[styles.label, { marginTop: 14 }]}>Developer</Text>
//             <View style={styles.picker}>
//               {DEV_OPTS.map((opt) => (
//                 <TouchableOpacity key={opt} onPress={() => setDev(opt)}
//                   style={[styles.pickerOpt, dev === opt && styles.pickerOptActive]}>
//                   <Text style={[styles.pickerOptText, dev === opt && styles.pickerOptTextActive]}>{opt}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.twoCol}>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.label, { marginTop: 14 }]}>Amount (₹)</Text>
//                 <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholderTextColor={COLORS.text3} />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.label, { marginTop: 14 }]}>Date</Text>
//                 <TextInput style={styles.input} value={date} onChangeText={setDate} placeholderTextColor={COLORS.text3} />
//               </View>
//             </View>

//             <Text style={[styles.label, { marginTop: 14 }]}>Payment Method</Text>
//             <PaymentMethodPicker value={payMethod} onChange={setPayMethod} />

//             <Text style={[styles.label, { marginTop: 14 }]}>Note (optional)</Text>
//             <TextInput
//               style={styles.input} value={note} onChangeText={setNote}
//               placeholder="e.g. Milestone 2 payment" placeholderTextColor={COLORS.text3}
//             />

//             {/* Summary preview */}
//             <View style={styles.summaryBox}>
//               <Text style={styles.summaryTitle}>After this payment</Text>
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Total paid to Zafran</Text>
//                 <Text style={styles.summaryVal}>₹7,000 / ₹7,000</Text>
//               </View>
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Status</Text>
//                 <Text style={[styles.summaryVal, { color: COLORS.primary }]}>✅ Fully Settled</Text>
//               </View>
//             </View>

//             <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
//               <Text style={styles.submitBtnText}>✅ Record Payment</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={{ height: 30 }} />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.bg },
//   header: { paddingHorizontal: 18, paddingBottom: 18 },
//   backBtn: { marginBottom: 10 },
//   backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
//   headerTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
//   body: { padding: 14 },
//   card: { backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: 16, ...SHADOWS.card },
//   label: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm2, color: COLORS.text2, marginBottom: 6 },
//   picker: { gap: 6 },
//   pickerOpt: {
//     padding: 10, borderRadius: RADIUS.md, borderWidth: 1.5,
//     borderColor: COLORS.border, backgroundColor: '#F9FAFB',
//   },
//   pickerOptActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryUltraLight },
//   pickerOptText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
//   pickerOptTextActive: { color: COLORS.text, fontFamily: FONTS.dmSans.semiBold },
//   twoCol: { flexDirection: 'row', gap: 8 },
//   input: {
//     backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: COLORS.border,
//     borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 9,
//     fontSize: SIZES.md, fontFamily: FONTS.dmSans.regular, color: COLORS.text,
//   },
//   summaryBox: { backgroundColor: COLORS.primaryUltraLight, borderRadius: 12, padding: 12, marginTop: 14, marginBottom: 4 },
//   summaryTitle: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: COLORS.primary, marginBottom: 6 },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
//   summaryLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2 },
//   summaryVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base, color: COLORS.text },
//   submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: 12, alignItems: 'center', marginTop: 8 },
//   submitBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
// });
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
import { payDeveloperOnProject } from "../../api/projects";

function today() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function DevPayScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const {
        projectId,
        devSlotId,
        devName = "Developer",
        agreedAmount = 0,
        paidAmount = 0,
        onPaid,
    } = route.params || {};

    const remaining = Math.max(0, agreedAmount - paidAmount);

    const [amount, setAmount] = useState(String(remaining));
    const [date, setDate] = useState(today());
    const [payMethod, setPayMethod] = useState("upi");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const newTotal = paidAmount + Number(amount || 0);
    const fullyPaid = agreedAmount > 0 && newTotal >= agreedAmount;

    const handleSubmit = async () => {
        setError("");
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError("Enter a valid amount.");
            return;
        }
        if (Number(amount) > remaining) {
            setError(
                `Amount exceeds remaining balance of ₹${remaining.toLocaleString("en-IN")}.`,
            );
            return;
        }
        if (!projectId || !devSlotId) {
            setError("Missing project or developer info.");
            return;
        }
        setLoading(true);
        const res = await payDeveloperOnProject(projectId, devSlotId, {
            amount,
            date,
            method: payMethod,
            note,
        });
        setLoading(false);
        if (res.ok) {
            if (onPaid) onPaid();
            navigation.goBack();
        } else {
            setError(res.message);
        }
    };

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
                <Text style={s.headerTitle}>💸 Pay Developer</Text>
                {devName ? (
                    <Text style={s.headerSub}>Paying: {devName}</Text>
                ) : null}

                {/* Balance mini-row */}
                <View style={s.balRow}>
                    <View style={s.balItem}>
                        <Text style={s.balVal}>
                            ₹{agreedAmount.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.balLbl}>Agreed</Text>
                    </View>
                    <View style={s.balItem}>
                        <Text style={[s.balVal, { color: "#A7F3D0" }]}>
                            ₹{paidAmount.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.balLbl}>Paid</Text>
                    </View>
                    <View style={s.balItem}>
                        <Text style={[s.balVal, { color: "#FCA5A5" }]}>
                            ₹{remaining.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.balLbl}>Remaining</Text>
                    </View>
                </View>
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
                        {/* Amount */}
                        <Text style={s.label}>Amount (₹)</Text>
                        <TextInput
                            style={s.input}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder={`Max ₹${remaining.toLocaleString("en-IN")}`}
                            placeholderTextColor={COLORS.text3}
                        />

                        {/* Date */}
                        <Text style={[s.label, { marginTop: 14 }]}>Date</Text>
                        <TextInput
                            style={s.input}
                            value={date}
                            onChangeText={setDate}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor={COLORS.text3}
                            keyboardType="numeric"
                        />

                        {/* Payment method */}
                        <Text style={[s.label, { marginTop: 14 }]}>
                            Payment Method
                        </Text>
                        <PaymentMethodPicker
                            value={payMethod}
                            onChange={setPayMethod}
                        />

                        {/* Note */}
                        <Text style={[s.label, { marginTop: 14 }]}>
                            Note (optional)
                        </Text>
                        <TextInput
                            style={s.input}
                            value={note}
                            onChangeText={setNote}
                            placeholder="e.g. Milestone 2 payment"
                            placeholderTextColor={COLORS.text3}
                        />

                        {/* After-payment summary */}
                        <View style={s.summaryBox}>
                            <Text style={s.summaryTitle}>
                                After this payment
                            </Text>
                            <View style={s.summaryRow}>
                                <Text style={s.summaryLbl}>
                                    Total paid to {devName}
                                </Text>
                                <Text style={s.summaryVal}>
                                    ₹{newTotal.toLocaleString("en-IN")} / ₹
                                    {agreedAmount.toLocaleString("en-IN")}
                                </Text>
                            </View>
                            <View style={s.summaryRow}>
                                <Text style={s.summaryLbl}>Status</Text>
                                <Text
                                    style={[
                                        s.summaryVal,
                                        {
                                            color: fullyPaid
                                                ? COLORS.primary
                                                : COLORS.accent,
                                        },
                                    ]}
                                >
                                    {fullyPaid
                                        ? "✅ Fully Settled"
                                        : `₹${Math.max(0, agreedAmount - newTotal).toLocaleString("en-IN")} remaining`}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[s.submitBtn, loading && { opacity: 0.65 }]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={s.submitBtnTxt}>
                                    ✅ Record Payment
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
    balRow: { flexDirection: "row", gap: 8, marginTop: 14 },
    balItem: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 10,
        padding: 8,
        alignItems: "center",
    },
    balVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.lg2,
        color: "#fff",
    },
    balLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: "rgba(255,255,255,0.7)",
        marginTop: 2,
    },
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        ...SHADOWS.card,
    },
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
        paddingVertical: 9,
        fontSize: SIZES.md,
        fontFamily: FONTS.dmSans.regular,
        color: COLORS.text,
    },
    summaryBox: {
        backgroundColor: COLORS.primaryUltraLight,
        borderRadius: 12,
        padding: 12,
        marginTop: 14,
        marginBottom: 4,
    },
    summaryTitle: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.primary,
        marginBottom: 6,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
        alignItems: "center",
        flexWrap: "wrap",
        gap: 4,
    },
    summaryLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    summaryVal: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.base,
        color: COLORS.text,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.lg,
        padding: 13,
        alignItems: "center",
        marginTop: 8,
    },
    submitBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: "#EF4444",
        marginBottom: 12,
    },
    errorTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "#EF4444",
    },
});
