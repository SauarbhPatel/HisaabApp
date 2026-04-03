import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../../context/AppContext';
import { loginWithPassword, loginOTPRequest, loginOTPVerify } from '../../api/auth';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

// ─── Sub-screen: OTP Login ────────────────────────────────────────────────────
function OTPLoginScreen({ onBack, onSuccess }) {
  const [phone, setPhone]           = useState('');
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [userId, setUserId]         = useState(null);
  const [step, setStep]             = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [attemptsLeft, setAttempts] = useState(5);
  const otpRefs                     = Array(6).fill(null).map(() => React.createRef());

  const handleRequestOTP = async () => {
    setError('');
    if (!phone.trim()) { setError('Please enter your phone number.'); return; }
    setLoading(true);
    const result = await loginOTPRequest({ phone });
    setLoading(false);
    if (result.ok) {
      setUserId(result.data.userId);
      setStep('otp');
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    const otpString = otp.join('');
    if (otpString.length < 6) { setError('Please enter all 6 digits.'); return; }
    setLoading(true);
    const result = await loginOTPVerify({ userId, otp: otpString });
    setLoading(false);
    if (result.ok) {
      onSuccess(result.data);
    } else {
      setError(result.message);
      if (result.data?.attemptsRemaining !== undefined) {
        setAttempts(result.data.attemptsRemaining);
      }
    }
  };

  const handleOTPInput = (val, index) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) otpRefs[index + 1]?.current?.focus();
  };

  const handleOTPKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <View style={{ gap: 0 }}>
      {step === 'phone' ? (
        <>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>PHONE NUMBER</Text>
            <View style={styles.inputIcon}>
              <Text style={styles.inputEmoji}>📱</Text>
              <TextInput
                style={styles.input} value={phone} onChangeText={setPhone}
                placeholder="+91 XXXXX XXXXX" placeholderTextColor={COLORS.text3}
                keyboardType="phone-pad" autoFocus
              />
            </View>
          </View>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.signInBtn} onPress={handleRequestOTP} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.signInBtnText}>Send OTP →</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.sub}>OTP sent to {phone}</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>OTP CODE</Text>
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i} ref={otpRefs[i]}
                  style={styles.otpInput} value={digit}
                  onChangeText={(v) => handleOTPInput(v, i)}
                  onKeyPress={(e) => handleOTPKeyPress(e, i)}
                  maxLength={1} keyboardType="number-pad"
                  textAlign="center" placeholder="·" placeholderTextColor={COLORS.text3}
                  autoFocus={i === 0}
                />
              ))}
            </View>
            {attemptsLeft < 5 && (
              <Text style={[styles.resendText, { color: COLORS.danger }]}>{attemptsLeft} attempt(s) remaining</Text>
            )}
          </View>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.signInBtn} onPress={handleVerifyOTP} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.signInBtnText}>Verify OTP →</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }} style={{ alignItems: 'center', marginTop: 12 }}>
            <Text style={styles.forgotText}>← Change Number</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={onBack} style={{ alignItems: 'center', marginTop: 12 }}>
        <Text style={[styles.forgotText, { color: COLORS.text2 }]}>← Back to Password Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main LoginScreen ─────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { handleAuthSuccess } = useAppContext();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [showOTP, setShowOTP]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ─── Password login ──────────────────────────────────────────────────────────
  const handlePasswordLogin = async () => {
    setError('');
    if (!identifier.trim()) { setError('Please enter your phone or email.'); return; }
    if (!password)          { setError('Please enter your password.'); return; }

    setLoading(true);
    const result = await loginWithPassword({ identifier, password });
    setLoading(false);

    if (result.ok) {
      handleAuthSuccess(result.data);
    } else {
      setError(result.message);
    }
  };

  // ─── OTP login success ───────────────────────────────────────────────────────
  const handleOTPSuccess = (data) => {
    handleAuthSuccess(data);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Top art */}
      <LinearGradient colors={['#0a1f16', '#1a7a5e']} style={[styles.topArt, { paddingTop: insets.top + 20 }]}>
        <View style={styles.topIcon}><Text style={{ fontSize: 30 }}>💸</Text></View>
        <Text style={styles.topName}>Hisaab</Text>
        <Text style={styles.topSub}>Welcome back 👋</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.sub}>Enter your phone number or email to continue</Text>

        {showOTP ? (
          <OTPLoginScreen onBack={() => { setShowOTP(false); setError(''); }} onSuccess={handleOTPSuccess} />
        ) : (
          <>
            {/* Identifier */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>PHONE OR EMAIL</Text>
              <View style={styles.inputIcon}>
                <Text style={styles.inputEmoji}>📱</Text>
                <TextInput
                  style={styles.input} value={identifier} onChangeText={setIdentifier}
                  placeholder="+91 XXXXX XXXXX or email" placeholderTextColor={COLORS.text3}
                  keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.inputIcon}>
                <Text style={styles.inputEmoji}>🔒</Text>
                <TextInput
                  style={styles.input} value={password} onChangeText={setPassword}
                  placeholder="Enter your password" placeholderTextColor={COLORS.text3}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Text style={{ fontSize: 16 }}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Error */}
            {!!error && <Text style={styles.errorText}>{error}</Text>}

            {/* Sign In */}
            <TouchableOpacity
              style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
              onPress={handlePasswordLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.signInBtnText}>Sign In →</Text>}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* OTP Login */}
            <TouchableOpacity style={styles.otpLoginBtn} onPress={() => { setShowOTP(true); setError(''); }} activeOpacity={0.85}>
              <Text style={styles.otpLoginBtnText}>📱 Login with OTP</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.switchLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

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
  body:    { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 24, paddingTop: 28 },
  title:   { fontFamily: FONTS.nunito.black, fontSize: SIZES.xxl, color: COLORS.text, marginBottom: 4 },
  sub:     { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2, marginBottom: 24 },
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
  forgotRow: { alignItems: 'flex-end', marginBottom: 18, marginTop: -6 },
  forgotText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.primary },
  errorText: {
    fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.danger,
    marginBottom: 12, paddingHorizontal: 4,
    backgroundColor: '#FEF2F2', borderRadius: 8, padding: 10,
    borderLeftWidth: 3, borderLeftColor: COLORS.danger,
  },
  signInBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    padding: 14, alignItems: 'center',
  },
  signInBtnDisabled: { opacity: 0.7 },
  signInBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff', letterSpacing: 0.2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text3 },
  otpLoginBtn: {
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.xl,
    padding: 13, alignItems: 'center', backgroundColor: '#fff',
  },
  otpLoginBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.primary },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  switchText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  switchLink: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: COLORS.primary },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  otpInput: {
    width: 42, height: 48, backgroundColor: '#fff', borderWidth: 1.5,
    borderColor: COLORS.border, borderRadius: RADIUS.lg,
    fontFamily: FONTS.nunito.extraBold, fontSize: 20, color: COLORS.text,
  },
  resendText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, marginTop: 6 },
});
