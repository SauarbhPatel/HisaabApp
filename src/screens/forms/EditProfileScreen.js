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
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../../context/AppContext";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import { apiCall } from "../../api/client";

const AVATARS = ["😎", "🧑‍💻", "👩‍💼", "🧑‍🎨", "👨‍🍳", "🦸", "🧑‍🎤", "👩‍🔬"];
const AV_COLORS = [
    "#1a7a5e",
    "#378add",
    "#d4537e",
    "#534ab7",
    "#ba7517",
    "#d85a30",
    "#2563eb",
    "#7c3aed",
];
const USE_CASES = [
    {
        id: "split",
        icon: "💸",
        title: "Split Expenses",
        sub: "Track shared bills & groups",
    },
    {
        id: "freelance",
        icon: "💼",
        title: "Freelancer",
        sub: "Clients, developers & projects",
    },
    { id: "both", icon: "🎯", title: "Both", sub: "All features" },
];

function Field({ label, children }) {
    return (
        <View style={s.field}>
            <Text style={s.fieldLbl}>{label}</Text>
            {children}
        </View>
    );
}
function Input({
    value,
    onChangeText,
    placeholder,
    keyboardType,
    autoCapitalize,
    secureTextEntry,
}) {
    return (
        <TextInput
            style={s.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.text3}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize || "words"}
            secureTextEntry={secureTextEntry}
        />
    );
}

export default function EditProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { user, updateUser } = useAppContext();

    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatar, setAvatar] = useState(user?.avatar || "😎");
    const [avatarColor, setAvatarColor] = useState(
        user?.avatarColor || AV_COLORS[0],
    );
    const [useCase, setUseCase] = useState(user?.useCase || "both");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const initials =
        name
            .split(" ")
            .filter(Boolean)
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "RK";

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Name is required.");
            return;
        }
        setError("");
        setSuccess("");
        setSaving(true);

        const res = await apiCall("/api/auth/profile", {
            method: "PATCH",
            auth: true,
            body: {
                name: name.trim(),
                phone: phone.trim() || undefined,
                email: email.trim() || undefined,
                avatar,
                avatarColor,
                useCase,
            },
        });

        setSaving(false);
        if (res.ok) {
            updateUser({
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                avatar,
                avatarColor,
                useCase,
                initials: name
                    .trim()
                    .split(" ")
                    .filter(Boolean)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2),
            });
            setSuccess("Profile updated ✅");
            setTimeout(() => navigation.goBack(), 700);
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
                    {/* Live preview */}
                    <View style={s.heroRow}>
                        <View
                            style={[
                                s.previewAv,
                                { backgroundColor: avatarColor },
                            ]}
                        >
                            <Text style={s.previewAvEmoji}>{avatar}</Text>
                            <View style={s.previewInitialsBadge}>
                                <Text style={s.previewInitials}>
                                    {initials}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.heroTitle}>Edit Profile</Text>
                            <Text style={s.heroSub}>
                                {name.trim() || "Your Name"}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={s.body}>
                        {/* ── Basic Info ─────────────────────────────────────── */}
                        <View style={s.card}>
                            <Text style={s.cardTitle}>👤 Basic Info</Text>
                            <Field label="Full Name *">
                                <Input
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. Rahul Kumar"
                                />
                            </Field>
                            <Field label="Phone Number">
                                <Input
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="+91 XXXXX XXXXX"
                                    keyboardType="phone-pad"
                                    autoCapitalize="none"
                                />
                            </Field>
                            <Field label="Email Address">
                                <Input
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="you@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Field>
                        </View>

                        {/* ── Avatar ─────────────────────────────────────────── */}
                        <View style={s.card}>
                            <Text style={s.cardTitle}>🎭 Avatar</Text>
                            <Text style={s.fieldLbl}>Pick Emoji</Text>
                            <View style={s.avatarGrid}>
                                {AVATARS.map((av) => (
                                    <TouchableOpacity
                                        key={av}
                                        onPress={() => setAvatar(av)}
                                        style={[
                                            s.avatarOpt,
                                            avatar === av && s.avatarOptActive,
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={{ fontSize: 26 }}>
                                            {av}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[s.fieldLbl, { marginTop: 14 }]}>
                                Avatar Colour
                            </Text>
                            <View style={s.colorRow}>
                                {AV_COLORS.map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        onPress={() => setAvatarColor(c)}
                                        style={[
                                            s.colorDot,
                                            { backgroundColor: c },
                                            avatarColor === c &&
                                                s.colorDotActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* ── Use Case ───────────────────────────────────────── */}
                        <View style={s.card}>
                            <Text style={s.cardTitle}>
                                🎯 I primarily use this app for
                            </Text>
                            <View style={{ gap: 10 }}>
                                {USE_CASES.map((uc) => {
                                    const sel = useCase === uc.id;
                                    return (
                                        <TouchableOpacity
                                            key={uc.id}
                                            onPress={() => setUseCase(uc.id)}
                                            style={[
                                                s.ucRow,
                                                sel && s.ucRowActive,
                                            ]}
                                            activeOpacity={0.85}
                                        >
                                            <Text style={{ fontSize: 20 }}>
                                                {uc.icon}
                                            </Text>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={[
                                                        s.ucTitle,
                                                        sel && {
                                                            color: COLORS.primary,
                                                        },
                                                    ]}
                                                >
                                                    {uc.title}
                                                </Text>
                                                <Text style={s.ucSub}>
                                                    {uc.sub}
                                                </Text>
                                            </View>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    opacity: sel ? 1 : 0,
                                                }}
                                            >
                                                ✅
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {!!error && (
                            <View style={s.errorBox}>
                                <Text style={s.errorTxt}>⚠️ {error}</Text>
                            </View>
                        )}
                        {!!success && (
                            <View style={s.successBox}>
                                <Text style={s.successTxt}>{success}</Text>
                            </View>
                        )}
                        <View style={{ height: 100 }} />
                    </View>
                </ScrollView>

                <View
                    style={[
                        s.stickyBottom,
                        { paddingBottom: insets.bottom + 12 },
                    ]}
                >
                    <TouchableOpacity
                        style={[s.saveBtn, saving && { opacity: 0.7 }]}
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={s.saveBtnTxt}>💾 Save Changes</Text>
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
        gap: 14,
        marginTop: 4,
    },
    previewAv: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.35)",
        position: "relative",
    },
    previewAvEmoji: { fontSize: 28 },
    previewInitialsBadge: {
        position: "absolute",
        bottom: -4,
        right: -4,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    previewInitials: {
        fontFamily: FONTS.nunito.black,
        fontSize: 9,
        color: COLORS.primary,
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
        marginTop: 2,
    },
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.card,
    },
    cardTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
        marginBottom: 14,
    },
    field: { marginBottom: 12 },
    fieldLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginBottom: 4,
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
    avatarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    avatarOpt: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        borderWidth: 2,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarOptActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    colorRow: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: 4 },
    colorDot: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 2,
        borderColor: "transparent",
    },
    colorDotActive: {
        borderColor: "#0f2e24",
        borderWidth: 3,
        transform: [{ scale: 1.12 }],
    },
    ucRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#F9FAFB",
    },
    ucRowActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
        borderWidth: 2,
    },
    ucTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    ucSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        marginBottom: 8,
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
        marginBottom: 8,
    },
    successTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.primary,
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
