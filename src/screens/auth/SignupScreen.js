import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../../context/AppContext';
import {
  signupStep1, signupVerifyOTP, signupResendOTP,
  signupSetPassword, signupCompleteProfile,
} from '../../api/auth';
import { getPendingUserId } from '../../api/client';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

const AVATARS = ['😎', '🧑‍💻', '👩‍💼', '🧑‍🎨', '👨‍🍳', '🦸'];

const USE_CASES = [
  { id: 'split',     icon: '💸', title: 'Split Expenses with Friends', sub: 'Track shared bills, groups & balances' },
  { id: 'freelance', icon: '💼', title: 'Freelance Project Manager',   sub: 'Clients, developers & project payments' },
  { id: 'both',      icon: '🎯', title: 'Both',                        sub: 'Use all features of the app' },
];

// ─── Shared components ────────────────────────────────────────────────────────
function InputWithIcon({ icon, placeholder, value, onChangeText, keyboardType, secureTextEntry, rightElement, autoFocus }) {
  return (
    <View style={styles.inputIcon}>
      <Text style={styles.inputEmoji}>{icon}</Text>
      <TextInput
        style={styles.input} value={value} onChangeText={onChangeText}
        placeholder={placeholder} placeholderTextColor={COLORS.text3}
        keyboardType={keyboardType} secureTextEntry={secureTextEntry}
        autoCapitalize="none" autoCorrect={false} autoFocus={autoFocus}
      />
      {rightElement}
    </View>
  );
}

function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>⚠️ {message}</Text>
    </View>
  );
}

function SuccessBox({ message }) {
  if (!message) return null;
  return (
    <View style={styles.successBox}>
      <Text style={styles.successText}>✅ {message}</Text>
    </View>
  );
}

// ─── Main SignupScreen ────────────────────────────────────────────────────────
export default function SignupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { handleAuthSuccess } = useAppContext();

  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  // Step 1 fields
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [email, setEmail]   = useState('');

  // Step 2 fields — OTP
  const [otp, setOtp]       = useState(['', '', '', '', '', '']);
  const [userId, setUserId] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef(Array(6).fill(null).map(() => React.createRef())).current;

  // Step 2 fields — Password
  const [password, setPassword]     = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [pwVerified, setPwVerified] = useState(false); // OTP + password both done

  // Step 3 fields
  const [avatarIdx, setAvatarIdx]   = useState(0);
  const [useCase, setUseCase]       = useState('split');

  const clearMessages = () => { setError(''); setSuccess(''); };

  // ─── OTP input helpers ────────────────────────────────────────────────────────
  const handleOTPChange = (val, i) => {
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs[i + 1]?.current?.focus();
  };
  const handleOTPKey = (e, i) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[i] && i > 0) otpRefs[i - 1]?.current?.focus();
  };

  // ─── STEP 1 — Send basic info + OTP ──────────────────────────────────────────
  const handleStep1 = async () => {
    clearMessages();
    if (!name.trim())  { setError('Please enter your full name.'); return; }
    if (!phone.trim() && !email.trim()) { setError('Please enter your phone number or email.'); return; }

    setLoading(true);
    const result = await signupStep1({ name, phone, email });
    setLoading(false);

    if (result.ok) {
      setUserId(result.data.userId);
      setSuccess(result.message);
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  // ─── STEP 2a — Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOTP = async () => {
    clearMessages();
    const otpStr = otp.join('');
    if (otpStr.length < 6) { setError('Please enter all 6 digits.'); return; }

    const uid = userId || await getPendingUserId();
    if (!uid) { setError('Session expired. Please go back and try again.'); return; }

    setLoading(true);
    const result = await signupVerifyOTP({ userId: uid, otp: otpStr });
    setLoading(false);

    if (result.ok) {
      setSuccess('Phone verified! ✅ Now set your password.');
      setPwVerified(false); // show password form below
      // Don't advance step yet — password is also step 2
    } else {
      setError(result.message);
      // Reset OTP on failure
      setOtp(['', '', '', '', '', '']);
      otpRefs[0]?.current?.focus();
    }
  };

  // ─── STEP 2b — Set password ───────────────────────────────────────────────────
  const handleSetPassword = async () => {
    clearMessages();
    if (!password)              { setError('Please enter a password.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }
    if (password.length < 8)   { setError('Password must be at least 8 characters.'); return; }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must contain at least 1 letter and 1 number.'); return;
    }

    const uid = userId || await getPendingUserId();
    setLoading(true);
    const result = await signupSetPassword({ userId: uid, password, confirmPassword: confirmPw });
    setLoading(false);

    if (result.ok) {
      setSuccess('Password set! ✅ Almost done.');
      setPwVerified(true);
      setStep(3);
    } else {
      setError(result.message);
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResend = async () => {
    clearMessages();
    const uid = userId || await getPendingUserId();
    setLoading(true);
    const result = await signupResendOTP({ userId: uid });
    setLoading(false);
    if (result.ok) {
      setSuccess('New OTP sent!');
      setOtp(['', '', '', '', '', '']);
      otpRefs[0]?.current?.focus();
      // 30s cooldown
      setResendCooldown(30);
      const interval = setInterval(() => {
        setResendCooldown((c) => { if (c <= 1) { clearInterval(interval); return 0; } return c - 1; });
      }, 1000);
    } else {
      setError(result.message);
    }
  };

  // ─── STEP 3 — Complete profile ────────────────────────────────────────────────
  const handleCompleteProfile = async () => {
    clearMessages();
    const uid = userId || await getPendingUserId();
    if (!uid) { setError('Session expired. Please restart signup.'); return; }

    setLoading(true);
    const result = await signupCompleteProfile({
      userId: uid,
      avatar: AVATARS[avatarIdx],
      useCase,
    });
    setLoading(false);

    if (result.ok) {
      handleAuthSuccess(result.data);
    } else {
      setError(result.message);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  const headerColors = step === 3 ? ['#1e3a5f', '#6C3EF4'] : ['#0a1f16', '#1a7a5e'];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={headerColors} style={[styles.topArt, { paddingTop: insets.top + 20 }]}>
        <View style={styles.topIcon}>
          <Text style={{ fontSize: 30 }}>{step === 3 ? '🚀' : '💸'}</Text>
        </View>
        <Text style={styles.topName}>{step === 3 ? 'Set Up Profile' : 'Create Account'}</Text>
        <Text style={styles.topSub}>Join Hisaab — It's free!</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Progress */}
        <View style={styles.progressRow}>
          {[1, 2, 3].map((n) => (
            <View key={n} style={[styles.progressDot, n <= step && styles.progressDotDone]} />
          ))}
        </View>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <Text style={styles.title}>Your Details</Text>
            <Text style={styles.sub}>Let's start with the basics</Text>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <InputWithIcon icon="👤" placeholder="e.g. Rahul Kumar" value={name} onChangeText={setName} />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>PHONE NUMBER</Text>
              <InputWithIcon icon="📱" placeholder="+91 XXXXX XXXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>EMAIL (OPTIONAL)</Text>
              <InputWithIcon icon="✉️" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
            </View>

            <ErrorBox message={error} />

            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleStep1} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue →</Text>}
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <Text style={styles.title}>Verify & Secure</Text>
            <SuccessBox message={success} />

            {/* OTP section */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>OTP CODE</Text>
              <Text style={styles.otpHint}>Sent to {phone || email}</Text>
              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i} ref={otpRefs[i]}
                    style={styles.otpInput} value={digit}
                    onChangeText={(v) => handleOTPChange(v, i)}
                    onKeyPress={(e) => handleOTPKey(e, i)}
                    maxLength={1} keyboardType="number-pad"
                    textAlign="center" placeholder="·"
                    placeholderTextColor={COLORS.text3}
                    autoFocus={i === 0}
                  />
                ))}
              </View>
              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Didn't receive? </Text>
                {resendCooldown > 0 ? (
                  <Text style={styles.resendCooldown}>Resend in {resendCooldown}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={loading}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <ErrorBox message={error} />

            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleVerifyOTP} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify OTP →</Text>}
            </TouchableOpacity>

            {/* Password section — shown after OTP verified */}
            {success?.includes('Phone verified') && !pwVerified && (
              <>
                <View style={[styles.dividerRow, { marginVertical: 20 }]}>
                  <View style={styles.dividerLine} /><Text style={styles.dividerText}>set your password</Text><View style={styles.dividerLine} />
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>SET PASSWORD</Text>
                  <InputWithIcon
                    icon="🔒" placeholder="Min 8 characters, 1 letter + 1 number"
                    value={password} onChangeText={setPassword}
                    secureTextEntry={!showPw}
                    rightElement={
                      <TouchableOpacity onPress={() => setShowPw((v) => !v)}>
                        <Text style={{ fontSize: 16 }}>{showPw ? '🙈' : '👁'}</Text>
                      </TouchableOpacity>
                    }
                  />
                </View>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                  <InputWithIcon icon="🔒" placeholder="Re-enter password" value={confirmPw} onChangeText={setConfirmPw} secureTextEntry={!showPw} />
                </View>

                <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSetPassword} disabled={loading} activeOpacity={0.85}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Set Password & Continue →</Text>}
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.btnOutline} onPress={() => { setStep(1); clearMessages(); }} activeOpacity={0.85}>
              <Text style={styles.btnOutlineText}>← Back</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <>
            <Text style={styles.title}>Set Up Profile</Text>
            <Text style={styles.sub}>Choose an avatar and tell us your role</Text>

            {/* Avatar picker */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>PICK AN AVATAR</Text>
              <View style={styles.avatarRow}>
                {AVATARS.map((av, i) => (
                  <TouchableOpacity key={av} style={[styles.avatarOpt, avatarIdx === i && styles.avatarOptActive]} onPress={() => setAvatarIdx(i)} activeOpacity={0.8}>
                    <Text style={{ fontSize: 24 }}>{av}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Use case */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>I PRIMARILY USE THIS APP FOR</Text>
              <View style={{ gap: 8 }}>
                {USE_CASES.map((uc) => {
                  const isSelected = useCase === uc.id;
                  return (
                    <TouchableOpacity key={uc.id} onPress={() => setUseCase(uc.id)}
                      style={[styles.ucCard, isSelected && styles.ucCardActive]} activeOpacity={0.85}>
                      <Text style={{ fontSize: 20 }}>{uc.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.ucTitle}>{uc.title}</Text>
                        <Text style={styles.ucSub}>{uc.sub}</Text>
                      </View>
                      <Text style={{ fontSize: 16, opacity: isSelected ? 1 : 0 }}>✅</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <ErrorBox message={error} />

            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleCompleteProfile} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>🚀 Get Started</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnOutline} onPress={() => { setStep(2); clearMessages(); }} activeOpacity={0.85}>
              <Text style={styles.btnOutlineText}>← Back</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topArt: { paddingBottom: 28, alignItems: 'center', gap: 8 },
  topIcon: {
    width: 60, height: 60, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  topName: { fontFamily: FONTS.nunito.black, fontSize: 22, color: '#fff' },
  topSub:  { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.65)' },
  body: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 24, paddingTop: 20 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressDot: { flex: 1, height: 4, borderRadius: 99, backgroundColor: COLORS.border },
  progressDotDone: { backgroundColor: COLORS.primary },
  title: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xxl, color: COLORS.text, marginBottom: 4 },
  sub:   { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2, marginBottom: 20 },
  inputWrap: { marginBottom: 14 },
  inputLabel: {
    fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2,
    color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
  },
  inputIcon: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  inputEmoji: { fontSize: 18 },
  input: { flex: 1, fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md2, color: COLORS.text },
  otpHint: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2, marginBottom: 8 },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  otpInput: {
    width: 42, height: 48, backgroundColor: '#fff', borderWidth: 1.5,
    borderColor: COLORS.border, borderRadius: RADIUS.lg,
    fontFamily: FONTS.nunito.extraBold, fontSize: 20, color: COLORS.text,
  },
  resendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  resendLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2 },
  resendLink: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.primary },
  resendCooldown: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.text3 },
  errorBox: {
    backgroundColor: '#FEF2F2', borderRadius: 8, padding: 10,
    borderLeftWidth: 3, borderLeftColor: COLORS.danger, marginBottom: 12,
  },
  errorText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.danger },
  successBox: {
    backgroundColor: '#F0FDF4', borderRadius: 8, padding: 10,
    borderLeftWidth: 3, borderLeftColor: COLORS.primary, marginBottom: 12,
  },
  successText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.primary },
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: 14, alignItems: 'center', marginTop: 6 },
  btnDisabled: { opacity: 0.7 },
  btnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff', letterSpacing: 0.2 },
  btnOutline: { borderRadius: RADIUS.xl, borderWidth: 1.5, borderColor: COLORS.primary, padding: 13, alignItems: 'center', marginTop: 10 },
  btnOutlineText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.primary },
  avatarRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  avatarOpt: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: '#F3F4F6',
    borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center',
  },
  avatarOptActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryUltraLight },
  ucCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
    borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff',
  },
  ucCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryUltraLight, borderWidth: 2 },
  ucTitle: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  ucSub:   { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  switchText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  switchLink: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: COLORS.primary },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text3 },
});
