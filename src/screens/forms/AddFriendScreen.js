// export { AddFriendScreen as default } from './FormScreens';

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
    Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import { addFriend, getFriendInitials } from "../../api/friends";

const AVATAR_COLORS = [
    "#1a7a5e",
    "#378add",
    "#d4537e",
    "#534ab7",
    "#ba7517",
    "#d85a30",
    "#2563eb",
    "#7c3aed",
];

export default function AddFriendScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const onAdded = route?.params?.onAdded;

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [nickName, setNickName] = useState("");
    const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Live preview initials
    const previewInitials = getFriendInitials(name || "FR");

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Please enter the friend's name.");
            return;
        }
        setError("");
        setSaving(true);
        const res = await addFriend({
            name,
            phone,
            email,
            nickName,
            avatarColor,
        });
        setSaving(false);
        if (res.ok) {
            if (onAdded) onAdded();
            navigation.goBack();
        } else {
            setError(res.message);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Hey! I use Hisaab to track expenses. Join me so we can split bills easily! 🤝`,
                title: "Join me on Hisaab",
            });
        } catch (_) {}
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

                    {/* Avatar preview */}
                    <View style={s.heroRow}>
                        <View
                            style={[
                                s.previewAv,
                                { backgroundColor: avatarColor },
                            ]}
                        >
                            <Text style={s.previewAvTxt}>
                                {previewInitials}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.heroTitle}>Add Friend</Text>
                            <Text style={s.heroSub}>
                                {name.trim() || "Your new friend"}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={s.body}>
                        <View style={s.card}>
                            <Text style={s.cardTitle}>👤 Friend Details</Text>

                            {/* Name */}
                            <View style={s.fieldWrap}>
                                <Text style={s.fieldLbl}>Full Name *</Text>
                                <View style={s.inputRow}>
                                    <Text style={s.inputIcon}>👤</Text>
                                    <TextInput
                                        style={s.input}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="e.g. Priya Kapoor"
                                        placeholderTextColor={COLORS.text3}
                                        autoFocus
                                    />
                                </View>
                            </View>

                            {/* Phone */}
                            <View style={s.fieldWrap}>
                                <Text style={s.fieldLbl}>Phone Number</Text>
                                <View style={s.inputRow}>
                                    <Text style={s.inputIcon}>📱</Text>
                                    <TextInput
                                        style={s.input}
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="+91 XXXXX XXXXX"
                                        placeholderTextColor={COLORS.text3}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View style={s.fieldWrap}>
                                <Text style={s.fieldLbl}>Email (optional)</Text>
                                <View style={s.inputRow}>
                                    <Text style={s.inputIcon}>✉️</Text>
                                    <TextInput
                                        style={s.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="friend@example.com"
                                        placeholderTextColor={COLORS.text3}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {/* Nick name */}
                            <View style={s.fieldWrap}>
                                <Text style={s.fieldLbl}>
                                    Nick Name (optional)
                                </Text>
                                <TextInput
                                    style={s.plainInput}
                                    value={nickName}
                                    onChangeText={setNickName}
                                    placeholder="e.g. Raju, Neha Di..."
                                    placeholderTextColor={COLORS.text3}
                                />
                            </View>

                            {/* Avatar color */}
                            <View style={s.fieldWrap}>
                                <Text style={s.fieldLbl}>Avatar Color</Text>
                                <View style={s.colorRow}>
                                    {AVATAR_COLORS.map((c) => (
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

                            {!!error && (
                                <View style={s.errorBox}>
                                    <Text style={s.errorTxt}>⚠️ {error}</Text>
                                </View>
                            )}
                        </View>

                        {/* Invite card */}
                        <View style={s.inviteCard}>
                            <Text style={s.inviteTitle}>
                                📲 Invite to Hisaab
                            </Text>
                            <Text style={s.inviteSub}>
                                Send your friend an invite so they can track
                                expenses together with you.
                            </Text>
                            <View style={s.inviteActions}>
                                <TouchableOpacity
                                    style={s.inviteWA}
                                    onPress={handleShare}
                                >
                                    <Text
                                        style={[
                                            s.inviteBtnTxt,
                                            { color: "#065F46" },
                                        ]}
                                    >
                                        💬 WhatsApp
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={s.inviteShare}
                                    onPress={handleShare}
                                >
                                    <Text
                                        style={[
                                            s.inviteBtnTxt,
                                            { color: "#1D4ED8" },
                                        ]}
                                    >
                                        📤 Share Link
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={s.saveBtnTxt}>✅ Add Friend</Text>
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
        marginTop: 6,
    },
    previewAv: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.4)",
    },
    previewAvTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: 22,
        color: "#fff",
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
    fieldWrap: { marginBottom: 14 },
    fieldLbl: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        marginBottom: 6,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.lg,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    inputIcon: { fontSize: 18 },
    input: {
        flex: 1,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    plainInput: {
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
    colorRow: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: 4 },
    colorDot: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 2,
        borderColor: "transparent",
    },
    colorDotActive: { borderColor: "#0f2e24", borderWidth: 3 },
    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
    },
    errorTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },
    inviteCard: {
        backgroundColor: COLORS.primaryUltraLight,
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },
    inviteTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.primary,
        marginBottom: 6,
    },
    inviteSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        marginBottom: 10,
    },
    inviteActions: { flexDirection: "row", gap: 8 },
    inviteWA: {
        flex: 1,
        padding: 9,
        borderRadius: 10,
        backgroundColor: "#D1FAE5",
        alignItems: "center",
    },
    inviteShare: {
        flex: 1,
        padding: 9,
        borderRadius: 10,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
    },
    inviteBtnTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base },
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
