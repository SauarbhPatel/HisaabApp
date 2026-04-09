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
import { SuggestionChipRow } from "../../components/shared/SuggestionChip";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import { updateDevSlotStatus } from "../../api/projects";
import {
    updateDeveloper,
    getDevInitials,
    getDevColor,
} from "../../api/developers";

// Note: The backend doesn't have a direct PATCH for a dev slot's agreedAmount/role
// We update via the developer's own record (role) and keep agreedAmount display-only
// since changing agreed amounts mid-project is a business decision.
// We DO allow updating the developer's global role from here.

const ROLE_CHIPS = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack",
    "UI/UX Designer",
    "DevOps Engineer",
    "Mobile Developer",
    "QA Tester",
];

export default function EditDevInProjectScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { projectId, slot, onSaved } = route.params || {};

    const dev = slot?.developer || {};
    const name = dev.name || "Developer";
    const initials = getDevInitials(name);
    const color = getDevColor(name);

    const [role, setRole] = useState(slot?.role || dev.role || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Agreed amount is shown but not editable (would require a new API endpoint)
    const agreed = slot?.agreedAmount || 0;
    const paid = slot?.paidAmount || 0;
    const remain = Math.max(0, agreed - paid);

    const handleSave = async () => {
        setError("");
        setLoading(true);
        // Update the developer's global role
        const res = await updateDeveloper(dev._id, { role });
        setLoading(false);
        if (res.ok) {
            setSuccess(true);
            if (onSaved) onSaved();
            setTimeout(() => navigation.goBack(), 600);
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
                <View style={s.devRow}>
                    <View style={[s.devAv, { backgroundColor: color }]}>
                        <Text style={s.devAvTxt}>{initials}</Text>
                    </View>
                    <View>
                        <Text style={s.devName}>{name}</Text>
                        <Text style={s.devRole}>
                            {slot?.role || dev.role || "Developer"}
                        </Text>
                    </View>
                </View>
                <Text style={s.headerTitle}>✏️ Edit Developer on Project</Text>
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
                    {success && (
                        <View style={s.successBox}>
                            <Text style={s.successTxt}>
                                ✅ Saved successfully!
                            </Text>
                        </View>
                    )}

                    {/* Read-only amounts summary */}
                    <View style={s.card}>
                        <Text style={s.sectionHdr}>💰 Payment Summary</Text>
                        <View style={s.amtRow}>
                            {[
                                {
                                    lbl: "Agreed Amount",
                                    val: `₹${agreed.toLocaleString("en-IN")}`,
                                    color: COLORS.text,
                                },
                                {
                                    lbl: "Paid So Far",
                                    val: `₹${paid.toLocaleString("en-IN")}`,
                                    color: COLORS.primary,
                                },
                                {
                                    lbl: "Remaining",
                                    val: `₹${remain.toLocaleString("en-IN")}`,
                                    color:
                                        remain > 0
                                            ? COLORS.danger
                                            : COLORS.text2,
                                },
                            ].map((a) => (
                                <View key={a.lbl} style={s.amtBox}>
                                    <Text style={s.amtLbl}>{a.lbl}</Text>
                                    <Text
                                        style={[s.amtVal, { color: a.color }]}
                                    >
                                        {a.val}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text style={s.hint}>
                            💡 Agreed amount cannot be changed after payments
                            have begun. Contact developer to renegotiate.
                        </Text>
                    </View>

                    {/* Editable role */}
                    <View style={s.card}>
                        <Text style={s.sectionHdr}>👨‍💻 Developer Role</Text>
                        <Text style={s.fieldLbl}>Role on this Project</Text>
                        <TextInput
                            style={s.input}
                            value={role}
                            onChangeText={setRole}
                            placeholder="e.g. Frontend Developer"
                            placeholderTextColor={COLORS.text3}
                        />
                        <SuggestionChipRow
                            chips={ROLE_CHIPS}
                            onSelect={setRole}
                            small
                        />

                        <TouchableOpacity
                            style={[
                                s.saveBtn,
                                loading && { opacity: 0.65 },
                                success && { backgroundColor: "#D1FAE5" },
                            ]}
                            onPress={handleSave}
                            disabled={loading || success}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text
                                    style={[
                                        s.saveBtnTxt,
                                        success && { color: "#065F46" },
                                    ]}
                                >
                                    {success ? "✅ Saved!" : "💾 Save Changes"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Slot status quick actions */}
                    <View style={s.card}>
                        <Text style={s.sectionHdr}>
                            ⚙️ Developer Status on Project
                        </Text>
                        <Text style={s.hint}>
                            Current status:{" "}
                            {slot?.status === "paused"
                                ? "⏸ Paused"
                                : "● Active"}
                        </Text>
                        <View style={s.statusBtns}>
                            {slot?.status !== "active" && (
                                <TouchableOpacity
                                    style={[
                                        s.statusBtn,
                                        { backgroundColor: "#D1FAE5" },
                                    ]}
                                    onPress={async () => {
                                        const res = await updateDevSlotStatus(
                                            projectId,
                                            slot._id,
                                            "active",
                                        );
                                        if (res.ok) {
                                            if (onSaved) onSaved();
                                            navigation.goBack();
                                        } else setError(res.message);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            s.statusBtnTxt,
                                            { color: "#065F46" },
                                        ]}
                                    >
                                        ▶ Resume
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {slot?.status === "active" && (
                                <TouchableOpacity
                                    style={[
                                        s.statusBtn,
                                        { backgroundColor: "#FEF3C7" },
                                    ]}
                                    onPress={async () => {
                                        const res = await updateDevSlotStatus(
                                            projectId,
                                            slot._id,
                                            "paused",
                                        );
                                        if (res.ok) {
                                            if (onSaved) onSaved();
                                            navigation.goBack();
                                        } else setError(res.message);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            s.statusBtnTxt,
                                            { color: "#92400E" },
                                        ]}
                                    >
                                        ⏸ Pause
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[
                                    s.statusBtn,
                                    { backgroundColor: "#FEE2E2" },
                                ]}
                                onPress={async () => {
                                    const res = await updateDevSlotStatus(
                                        projectId,
                                        slot._id,
                                        "removed",
                                    );
                                    if (res.ok) {
                                        if (onSaved) onSaved();
                                        navigation.goBack();
                                    } else setError(res.message);
                                }}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        s.statusBtnTxt,
                                        { color: COLORS.danger },
                                    ]}
                                >
                                    🗑 Remove from Project
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 16 },
    backBtn: { marginBottom: 8 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    devRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
    },
    devAv: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    devAvTxt: { fontFamily: FONTS.nunito.black, fontSize: 18, color: "#fff" },
    devName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.lg2,
        color: "#fff",
    },
    devRole: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
    },
    headerTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "rgba(255,255,255,0.9)",
    },
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        marginBottom: 14,
        ...SHADOWS.card,
    },
    sectionHdr: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    amtRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
    amtBox: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    amtLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm,
        color: COLORS.text2,
    },
    amtVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        marginTop: 2,
    },
    hint: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        lineHeight: 18,
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
        marginBottom: 8,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.xl,
        padding: 13,
        alignItems: "center",
        marginTop: 10,
    },
    saveBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    statusBtns: {
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
        flexWrap: "wrap",
    },
    statusBtn: {
        flex: 1,
        minWidth: "45%",
        padding: 11,
        borderRadius: 12,
        alignItems: "center",
    },
    statusBtnTxt: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base },
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
    successBox: {
        backgroundColor: "#F0FDF4",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
        marginBottom: 12,
    },
    successTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.primary,
    },
});
