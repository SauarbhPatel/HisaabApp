import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../../context/AppContext";
import {
    signupStep1,
    signupVerifyOTP,
    signupResendOTP,
    signupSetPassword,
    signupCompleteProfile,
} from "../../api/auth";
import { getPendingUid } from "../../api/client";
import { COLORS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";

const AVATARS = ["😎", "🧑‍💻", "👩‍💼", "🧑‍🎨", "👨‍🍳", "🦸"];
const USE_CASES = [
    {
        id: "split",
        icon: "💸",
        title: "Split Expenses with Friends",
        sub: "Track shared bills, groups & balances",
    },
    {
        id: "freelance",
        icon: "💼",
        title: "Freelance Project Manager",
        sub: "Clients, developers & project payments",
    },
    {
        id: "both",
        icon: "🎯",
        title: "Both",
        sub: "Use all features of the app",
    },
];

// ─── Step mapping ─────────────────────────────────────────────────────────────
// nextStep from backend → which numeric step to jump to
const STEP_MAP = {
    "verify-otp": 2,
    "set-password": 2, // skips OTP row, shows password form
    "complete-profile": 3,
};

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function ErrorBox({ msg }) {
    if (!msg) return null;
    return (
        <View style={s.errorBox}>
            <Text style={s.errorTxt}>⚠️ {msg}</Text>
        </View>
    );
}
function SuccessBox({ msg }) {
    if (!msg) return null;
    return (
        <View style={s.successBox}>
            <Text style={s.successTxt}>✅ {msg}</Text>
        </View>
    );
}
function InputRow({
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    secureTextEntry,
    right,
    autoFocus,
}) {
    return (
        <View style={s.inputRow}>
            <Text style={s.emoji}>{icon}</Text>
            <TextInput
                style={s.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.text3}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={autoFocus}
            />
            {right}
        </View>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SignupScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { handleAuthSuccess, clearResumeSignup } = useAppContext();

    // resume = { userId, nextStep } when coming from login with incomplete signup
    const resume = route?.params?.resume || null;

    // ── Determine initial step from resume ────────────────────────────────────
    const initialStep = resume ? STEP_MAP[resume.nextStep] || 1 : 1;
    // If nextStep is 'set-password' we skip OTP and go straight to password form
    const startAtPassword = resume?.nextStep === "set-password";

    // ── State ─────────────────────────────────────────────────────────────────
    const [step, setStep] = useState(initialStep);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(
        resume
            ? `Resuming signup — ${resume.nextStep === "verify-otp" ? "please verify your OTP" : resume.nextStep === "set-password" ? "please set your password" : "almost done!"}`
            : "",
    );

    // Step 1
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // Step 2 — userId (from step1 API or resume)
    const [userId, setUserId] = useState(resume?.userId || null);

    // Step 2 — OTP
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpVerified, setOtpVerified] = useState(startAtPassword); // true = phone already verified
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef([...Array(6)].map(() => React.createRef())).current;

    // Step 2 — Password
    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showPw, setShowPw] = useState(false);

    // Step 3
    const [avatarIdx, setAvatarIdx] = useState(0);
    const [useCase, setUseCase] = useState("split");

    const clearMsgs = () => {
        setError("");
        setSuccess("");
    };

    // Load pending userId from AsyncStorage if not provided via params
    useEffect(() => {
        if (!userId) {
            getPendingUid().then((uid) => {
                if (uid) setUserId(uid);
            });
        }
    }, []);

    // ── OTP helpers ───────────────────────────────────────────────────────────
    const handleOTPChange = (val, i) => {
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        if (val && i < 5) otpRefs[i + 1]?.current?.focus();
    };
    const handleOTPKey = (e, i) => {
        if (e.nativeEvent.key === "Backspace" && !otp[i] && i > 0)
            otpRefs[i - 1]?.current?.focus();
    };

    // ── STEP 1 — Basic info + OTP ─────────────────────────────────────────────
    const handleStep1 = async () => {
        clearMsgs();
        if (!name.trim()) {
            setError("Please enter your full name.");
            return;
        }
        if (!phone.trim() && !email.trim()) {
            setError("Please enter a phone number or email.");
            return;
        }

        setLoading(true);
        const res = await signupStep1({ name, phone, email });
        setLoading(false);

        if (res.ok) {
            setUserId(res.data.userId);
            setSuccess(res.message);
            setStep(2);
        } else {
            setError(res.message);
        }
    };

    // ── STEP 2a — Verify OTP ──────────────────────────────────────────────────
    const handleVerifyOTP = async () => {
        clearMsgs();
        const code = otp.join("");
        if (code.length < 6) {
            setError("Enter all 6 digits.");
            return;
        }

        const uid = userId || (await getPendingUid());
        if (!uid) {
            setError("Session expired. Please restart.");
            return;
        }

        setLoading(true);
        const res = await signupVerifyOTP({ userId: uid, otp: code });
        setLoading(false);

        if (res.ok) {
            setOtpVerified(true);
            setSuccess("Phone verified! ✅ Now set your password.");
        } else {
            setError(res.message);
            setOtp(["", "", "", "", "", ""]);
            otpRefs[0]?.current?.focus();
        }
    };

    // ── Resend OTP ────────────────────────────────────────────────────────────
    const handleResend = async () => {
        clearMsgs();
        const uid = userId || (await getPendingUid());
        setLoading(true);
        const res = await signupResendOTP({ userId: uid });
        setLoading(false);

        if (res.ok) {
            setSuccess("New OTP sent!");
            setOtp(["", "", "", "", "", ""]);
            otpRefs[0]?.current?.focus();
            let c = 30;
            setResendCooldown(c);
            const iv = setInterval(() => {
                c -= 1;
                setResendCooldown(c);
                if (c <= 0) clearInterval(iv);
            }, 1000);
        } else {
            setError(res.message);
        }
    };

    // ── STEP 2b — Set Password ────────────────────────────────────────────────
    const handleSetPassword = async () => {
        clearMsgs();
        if (!pw) {
            setError("Enter a password.");
            return;
        }
        if (pw !== confirmPw) {
            setError("Passwords do not match.");
            return;
        }
        if (pw.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (!/[a-zA-Z]/.test(pw) || !/\d/.test(pw)) {
            setError("Password must have at least 1 letter and 1 number.");
            return;
        }

        const uid = userId || (await getPendingUid());
        if (!uid) {
            setError("Session expired. Please restart.");
            return;
        }

        setLoading(true);
        const res = await signupSetPassword({
            userId: uid,
            password: pw,
            confirmPassword: confirmPw,
        });
        setLoading(false);

        if (res.ok) {
            setSuccess("Password set! ✅ Last step.");
            setStep(3);
        } else {
            setError(res.message);
        }
    };

    // ── STEP 3 — Complete profile ─────────────────────────────────────────────
    const handleComplete = async () => {
        clearMsgs();
        const uid = userId || (await getPendingUid());
        if (!uid) {
            setError("Session expired. Please restart signup.");
            return;
        }

        setLoading(true);
        const res = await signupCompleteProfile({
            userId: uid,
            avatar: AVATARS[avatarIdx],
            useCase,
        });
        setLoading(false);

        if (res.ok) {
            clearResumeSignup(); // clear context resume state
            handleAuthSuccess(res.data);
        } else {
            setError(res.message);
        }
    };

    // ── Header gradient ───────────────────────────────────────────────────────
    const headerColors =
        step === 3 ? ["#1e3a5f", "#6C3EF4"] : ["#0a1f16", "#1a7a5e"];

    const isResume = !!resume;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <LinearGradient
                colors={headerColors}
                style={[s.topArt, { paddingTop: insets.top + 20 }]}
            >
                <View style={s.logoBox}>
                    <Text style={{ fontSize: 30 }}>
                        {step === 3 ? "🚀" : isResume ? "🔄" : "💸"}
                    </Text>
                </View>
                <Text style={s.logoName}>
                    {isResume
                        ? "Resume Signup"
                        : step === 3
                          ? "Set Up Profile"
                          : "Create Account"}
                </Text>
                <Text style={s.logoSub}>
                    {isResume
                        ? "Continue where you left off"
                        : "Join Hisaab — It's free!"}
                </Text>
            </LinearGradient>

            <ScrollView
                style={s.body}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Progress dots */}
                <View style={s.progressRow}>
                    {[1, 2, 3].map((n) => (
                        <View key={n} style={[s.dot, n <= step && s.dotDone]} />
                    ))}
                </View>

                <SuccessBox msg={success} />
                <ErrorBox msg={error} />

                {/* ══ STEP 1 ══════════════════════════════════════════════════════════ */}
                {step === 1 && (
                    <>
                        <Text style={s.title}>Your Details</Text>
                        <Text style={s.sub}>Let's start with the basics</Text>

                        <View style={s.fieldWrap}>
                            <Text style={s.label}>FULL NAME</Text>
                            <InputRow
                                icon="👤"
                                placeholder="e.g. Rahul Kumar"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={s.fieldWrap}>
                            <Text style={s.label}>PHONE NUMBER</Text>
                            <InputRow
                                icon="📱"
                                placeholder="+91 XXXXX XXXXX"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={s.fieldWrap}>
                            <Text style={s.label}>EMAIL (OPTIONAL)</Text>
                            <InputRow
                                icon="✉️"
                                placeholder="you@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        <TouchableOpacity
                            style={[s.btn, loading && s.btnDim]}
                            onPress={handleStep1}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={s.btnTxt}>Continue →</Text>
                            )}
                        </TouchableOpacity>

                        <View style={s.switchRow}>
                            <Text style={s.switchTxt}>
                                Already have an account?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Login")}
                            >
                                <Text style={s.switchLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* ══ STEP 2 ══════════════════════════════════════════════════════════ */}
                {step === 2 && (
                    <>
                        <Text style={s.title}>
                            {startAtPassword || otpVerified
                                ? "Set Password"
                                : "Verify & Secure"}
                        </Text>
                        <Text style={s.sub}>
                            {startAtPassword || otpVerified
                                ? "Choose a strong password for your account"
                                : `OTP sent to ${phone || "your phone"}`}
                        </Text>

                        {/* OTP section — only shown if phone not yet verified */}
                        {!otpVerified && !startAtPassword && (
                            <>
                                <View style={s.fieldWrap}>
                                    <Text style={s.label}>OTP CODE</Text>
                                    <View style={s.otpRow}>
                                        {otp.map((d, i) => (
                                            <TextInput
                                                key={i}
                                                ref={otpRefs[i]}
                                                style={s.otpBox}
                                                value={d}
                                                onChangeText={(v) =>
                                                    handleOTPChange(v, i)
                                                }
                                                onKeyPress={(e) =>
                                                    handleOTPKey(e, i)
                                                }
                                                maxLength={1}
                                                keyboardType="number-pad"
                                                textAlign="center"
                                                placeholder="·"
                                                placeholderTextColor={
                                                    COLORS.text3
                                                }
                                                autoFocus={i === 0}
                                            />
                                        ))}
                                    </View>
                                    <View style={s.resendRow}>
                                        <Text style={s.resendLabel}>
                                            Didn't receive?{" "}
                                        </Text>
                                        {resendCooldown > 0 ? (
                                            <Text style={s.resendCooldown}>
                                                Resend in {resendCooldown}s
                                            </Text>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={handleResend}
                                                disabled={loading}
                                            >
                                                <Text style={s.resendLink}>
                                                    Resend OTP
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[s.btn, loading && s.btnDim]}
                                    onPress={handleVerifyOTP}
                                    disabled={loading}
                                    activeOpacity={0.85}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={s.btnTxt}>
                                            Verify OTP →
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <View style={s.orRow}>
                                    <View style={s.orLine} />
                                    <Text style={s.orText}>
                                        then set password
                                    </Text>
                                    <View style={s.orLine} />
                                </View>
                            </>
                        )}

                        {/* Password section — shown once OTP is verified or startAtPassword */}
                        {(otpVerified || startAtPassword) && (
                            <>
                                <View style={s.fieldWrap}>
                                    <Text style={s.label}>SET PASSWORD</Text>
                                    <InputRow
                                        icon="🔒"
                                        placeholder="Min 8 chars, 1 letter + 1 number"
                                        value={pw}
                                        onChangeText={setPw}
                                        secureTextEntry={!showPw}
                                        right={
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setShowPw((v) => !v)
                                                }
                                            >
                                                <Text style={{ fontSize: 16 }}>
                                                    {showPw ? "🙈" : "👁"}
                                                </Text>
                                            </TouchableOpacity>
                                        }
                                    />
                                </View>
                                <View style={s.fieldWrap}>
                                    <Text style={s.label}>
                                        CONFIRM PASSWORD
                                    </Text>
                                    <InputRow
                                        icon="🔒"
                                        placeholder="Re-enter password"
                                        value={confirmPw}
                                        onChangeText={setConfirmPw}
                                        secureTextEntry={!showPw}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[s.btn, loading && s.btnDim]}
                                    onPress={handleSetPassword}
                                    disabled={loading}
                                    activeOpacity={0.85}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={s.btnTxt}>
                                            Set Password & Continue →
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}

                        {!isResume && (
                            <TouchableOpacity
                                style={s.outlineBtn}
                                onPress={() => {
                                    setStep(1);
                                    clearMsgs();
                                }}
                                activeOpacity={0.85}
                            >
                                <Text style={s.outlineBtnTxt}>← Back</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                {/* ══ STEP 3 ══════════════════════════════════════════════════════════ */}
                {step === 3 && (
                    <>
                        <Text style={s.title}>Set Up Profile</Text>
                        <Text style={s.sub}>
                            Choose an avatar and tell us your role
                        </Text>

                        {/* Avatar picker */}
                        <View style={s.fieldWrap}>
                            <Text style={s.label}>PICK AN AVATAR</Text>
                            <View style={s.avatarRow}>
                                {AVATARS.map((av, i) => (
                                    <TouchableOpacity
                                        key={av}
                                        style={[
                                            s.avatarOpt,
                                            avatarIdx === i &&
                                                s.avatarOptActive,
                                        ]}
                                        onPress={() => setAvatarIdx(i)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={{ fontSize: 24 }}>
                                            {av}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Use case */}
                        <View style={s.fieldWrap}>
                            <Text style={s.label}>
                                I PRIMARILY USE THIS APP FOR
                            </Text>
                            <View style={{ gap: 8 }}>
                                {USE_CASES.map((uc) => {
                                    const sel = useCase === uc.id;
                                    return (
                                        <TouchableOpacity
                                            key={uc.id}
                                            style={[
                                                s.ucCard,
                                                sel && s.ucCardActive,
                                            ]}
                                            onPress={() => setUseCase(uc.id)}
                                            activeOpacity={0.85}
                                        >
                                            <Text style={{ fontSize: 20 }}>
                                                {uc.icon}
                                            </Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={s.ucTitle}>
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

                        <TouchableOpacity
                            style={[s.btn, loading && s.btnDim]}
                            onPress={handleComplete}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={s.btnTxt}>🚀 Get Started</Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    topArt: { paddingBottom: 28, alignItems: "center", gap: 8 },
    logoBox: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.18)",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    logoName: { fontFamily: FONTS.nunito.black, fontSize: 22, color: "#fff" },
    logoSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.65)",
    },

    body: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    progressRow: { flexDirection: "row", gap: 6, marginBottom: 16 },
    dot: {
        flex: 1,
        height: 4,
        borderRadius: 99,
        backgroundColor: COLORS.border,
    },
    dotDone: { backgroundColor: COLORS.primary },

    title: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xxl,
        color: COLORS.text,
        marginBottom: 4,
    },
    sub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        marginBottom: 16,
    },

    fieldWrap: { marginBottom: 14 },
    label: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
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
    emoji: { fontSize: 18 },
    input: {
        flex: 1,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },

    otpRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
    otpBox: {
        width: 42,
        height: 48,
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.lg,
        fontFamily: FONTS.nunito.extraBold,
        fontSize: 20,
        color: COLORS.text,
    },
    resendRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    resendLabel: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    resendLink: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.primary,
    },
    resendCooldown: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text3,
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
        lineHeight: 20,
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
        lineHeight: 20,
    },

    btn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.xl,
        padding: 14,
        alignItems: "center",
        marginTop: 6,
    },
    btnDim: { opacity: 0.65 },
    btnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
        letterSpacing: 0.2,
    },

    outlineBtn: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: RADIUS.xl,
        padding: 13,
        alignItems: "center",
        marginTop: 10,
    },
    outlineBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.primary,
    },

    switchRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 18,
    },
    switchTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    switchLink: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.primary,
    },

    orRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 14,
    },
    orLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    orText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text3,
    },

    avatarRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
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

    ucCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: RADIUS.lg,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#fff",
    },
    ucCardActive: {
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
});
