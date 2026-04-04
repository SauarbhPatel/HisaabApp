import React, { useState, useRef } from "react";
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
    loginWithPassword,
    loginOTPRequest,
    loginOTPVerify,
} from "../../api/auth";
import { getPendingUid } from "../../api/client";
import { COLORS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";

// ─── Reusable small components ────────────────────────────────────────────────
function ErrorBox({ msg }) {
    if (!msg) return null;
    return (
        <View style={s.errorBox}>
            <Text style={s.errorText}>⚠️ {msg}</Text>
        </View>
    );
}

function InfoBox({ msg }) {
    if (!msg) return null;
    return (
        <View style={s.infoBox}>
            <Text style={s.infoText}>ℹ️ {msg}</Text>
        </View>
    );
}

// ─── OTP Login Sub-screen ─────────────────────────────────────────────────────
function OTPLogin({ onBack, onSuccess, onIncomplete }) {
    const [phone, setPhone] = useState("");
    const [userId, setUserId] = useState(null);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [step, setStep] = useState("phone"); // 'phone' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const refs = useRef([...Array(6)].map(() => React.createRef())).current;

    const handleRequestOTP = async () => {
        setError("");
        if (!phone.trim()) {
            setError("Enter your phone number.");
            return;
        }
        setLoading(true);
        const res = await loginOTPRequest({ phone });
        setLoading(false);
        if (res.ok) {
            setUserId(res.data.userId);
            setStep("otp");
        } else {
            setError(res.message);
        }
    };

    const handleVerifyOTP = async () => {
        setError("");
        const code = otp.join("");
        if (code.length < 6) {
            setError("Enter all 6 digits.");
            return;
        }

        const uid = userId || (await getPendingUid());
        setLoading(true);
        const res = await loginOTPVerify({ userId: uid, otp: code });
        setLoading(false);

        if (res.ok) {
            onSuccess(res.data);
        } else if (res.incompleteSignup) {
            onIncomplete({
                userId: res.userId,
                nextStep: res.nextStep,
                message: res.message,
            });
        } else {
            setError(res.message);
            setOtp(["", "", "", "", "", ""]);
            refs[0]?.current?.focus();
        }
    };

    const handleOTPChange = (val, i) => {
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        if (val && i < 5) refs[i + 1]?.current?.focus();
    };
    const handleOTPKey = (e, i) => {
        if (e.nativeEvent.key === "Backspace" && !otp[i] && i > 0)
            refs[i - 1]?.current?.focus();
    };

    return (
        <View>
            {step === "phone" ? (
                <>
                    <View style={s.inputWrap}>
                        <Text style={s.inputLabel}>PHONE NUMBER</Text>
                        <View style={s.inputRow}>
                            <Text style={s.emoji}>📱</Text>
                            <TextInput
                                style={s.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+91 XXXXX XXXXX"
                                placeholderTextColor={COLORS.text3}
                                keyboardType="phone-pad"
                                autoFocus
                            />
                        </View>
                    </View>
                    <ErrorBox msg={error} />
                    <TouchableOpacity
                        style={[s.btn, loading && s.btnDim]}
                        onPress={handleRequestOTP}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={s.btnText}>Send OTP →</Text>
                        )}
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={s.otpHint}>OTP sent to {phone}</Text>
                    <View style={s.otpRow}>
                        {otp.map((d, i) => (
                            <TextInput
                                key={i}
                                ref={refs[i]}
                                style={s.otpBox}
                                value={d}
                                onChangeText={(v) => handleOTPChange(v, i)}
                                onKeyPress={(e) => handleOTPKey(e, i)}
                                maxLength={1}
                                keyboardType="number-pad"
                                textAlign="center"
                                placeholder="·"
                                placeholderTextColor={COLORS.text3}
                                autoFocus={i === 0}
                            />
                        ))}
                    </View>
                    <ErrorBox msg={error} />
                    <TouchableOpacity
                        style={[s.btn, loading && s.btnDim]}
                        onPress={handleVerifyOTP}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={s.btnText}>Verify OTP →</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setStep("phone");
                            setOtp(["", "", "", "", "", ""]);
                            setError("");
                        }}
                        style={s.textLink}
                    >
                        <Text style={s.textLinkText}>← Change number</Text>
                    </TouchableOpacity>
                </>
            )}
            <TouchableOpacity onPress={onBack} style={s.textLink}>
                <Text style={[s.textLinkText, { color: COLORS.text2 }]}>
                    ← Back to password login
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Main LoginScreen ─────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { handleAuthSuccess, handleIncompleteSignup } = useAppContext();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [showOTP, setShowOTP] = useState(false);

    const clearMsgs = () => {
        setError("");
        setInfo("");
    };

    // ─── Password login ──────────────────────────────────────────────────────
    const handleLogin = async () => {
        clearMsgs();
        if (!identifier.trim()) {
            setError("Enter your phone number or email.");
            return;
        }
        if (!password) {
            setError("Enter your password.");
            return;
        }

        setLoading(true);
        const res = await loginWithPassword({ identifier, password });
        setLoading(false);

        if (res.ok) {
            // Fully registered — go to app
            handleAuthSuccess(res.data);
            return;
        }

        if (res.incompleteSignup) {
            // User started signup but never finished.
            // Store in context and navigate them to the correct signup step.
            handleIncompleteSignup({
                userId: res.userId,
                nextStep: res.nextStep,
            });
            navigation.navigate("Signup", {
                resume: { userId: res.userId, nextStep: res.nextStep },
            });
            return;
        }

        setError(res.message);
    };

    // ─── OTP login success ───────────────────────────────────────────────────
    const handleOTPSuccess = (data) => handleAuthSuccess(data);

    // ─── OTP login → incomplete signup ───────────────────────────────────────
    const handleOTPIncomplete = ({ userId, nextStep, message }) => {
        handleIncompleteSignup({ userId, nextStep });
        navigation.navigate("Signup", {
            resume: { userId, nextStep },
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Art header */}
            <LinearGradient
                colors={["#0a1f16", "#1a7a5e"]}
                style={[s.topArt, { paddingTop: insets.top + 20 }]}
            >
                <View style={s.logoBox}>
                    <Text style={{ fontSize: 30 }}>💸</Text>
                </View>
                <Text style={s.logoName}>Hisaab</Text>
                <Text style={s.logoSub}>Welcome back 👋</Text>
            </LinearGradient>

            <ScrollView
                style={s.body}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={s.title}>Sign In</Text>
                <Text style={s.sub}>Enter your phone or email to continue</Text>

                {showOTP ? (
                    <OTPLogin
                        onBack={() => {
                            setShowOTP(false);
                            clearMsgs();
                        }}
                        onSuccess={handleOTPSuccess}
                        onIncomplete={handleOTPIncomplete}
                    />
                ) : (
                    <>
                        {/* Identifier input */}
                        <View style={s.inputWrap}>
                            <Text style={s.inputLabel}>PHONE OR EMAIL</Text>
                            <View style={s.inputRow}>
                                <Text style={s.emoji}>📱</Text>
                                <TextInput
                                    style={s.input}
                                    value={identifier}
                                    onChangeText={setIdentifier}
                                    placeholder="+91 XXXXX XXXXX or email"
                                    placeholderTextColor={COLORS.text3}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Password input */}
                        <View style={s.inputWrap}>
                            <Text style={s.inputLabel}>PASSWORD</Text>
                            <View style={s.inputRow}>
                                <Text style={s.emoji}>🔒</Text>
                                <TextInput
                                    style={s.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.text3}
                                    secureTextEntry={!showPw}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPw((v) => !v)}
                                >
                                    <Text style={{ fontSize: 16 }}>
                                        {showPw ? "🙈" : "👁"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={s.forgotRow}>
                            <Text style={s.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <ErrorBox msg={error} />
                        <InfoBox msg={info} />

                        {/* Sign In button */}
                        <TouchableOpacity
                            style={[s.btn, loading && s.btnDim]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={s.btnText}>Sign In →</Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={s.divRow}>
                            <View style={s.divLine} />
                            <Text style={s.divText}>or</Text>
                            <View style={s.divLine} />
                        </View>

                        {/* OTP Login */}
                        <TouchableOpacity
                            style={s.outlineBtn}
                            onPress={() => {
                                setShowOTP(true);
                                clearMsgs();
                            }}
                            activeOpacity={0.85}
                        >
                            <Text style={s.outlineBtnText}>
                                📱 Login with OTP
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Switch to Signup */}
                <View style={s.switchRow}>
                    <Text style={s.switchTxt}>Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={s.switchLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

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
        paddingTop: 28,
    },
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
        marginBottom: 24,
    },

    inputWrap: { marginBottom: 14 },
    inputLabel: {
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

    forgotRow: { alignItems: "flex-end", marginBottom: 16, marginTop: -4 },
    forgotText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.primary,
    },

    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        marginBottom: 12,
    },
    errorText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
        lineHeight: 20,
    },

    infoBox: {
        backgroundColor: "#EFF6FF",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.blue,
        marginBottom: 12,
    },
    infoText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "#1D4ED8",
        lineHeight: 20,
    },

    btn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.xl,
        padding: 14,
        alignItems: "center",
    },
    btnDim: { opacity: 0.65 },
    btnText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },

    outlineBtn: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: RADIUS.xl,
        padding: 13,
        alignItems: "center",
    },
    outlineBtnText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.primary,
    },

    divRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 16,
    },
    divLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    divText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text3,
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

    // OTP
    otpHint: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        marginBottom: 10,
    },
    otpRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
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
    textLink: { alignItems: "center", marginTop: 10 },
    textLinkText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.primary,
    },
});
