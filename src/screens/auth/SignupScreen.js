import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

const AVATARS = ['😎', '🧑‍💻', '👩‍💼', '🧑‍🎨', '👨‍🍳', '🦸'];

const USE_CASES = [
  {
    id: 'split',
    icon: '💸',
    title: 'Split Expenses with Friends',
    sub: 'Track shared bills, groups & balances',
  },
  {
    id: 'freelance',
    icon: '💼',
    title: 'Freelance Project Manager',
    sub: 'Clients, developers & project payments',
  },
  {
    id: 'both',
    icon: '🎯',
    title: 'Both',
    sub: 'Use all features of the app',
  },
];

export default function SignupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useAppContext();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedUseCase, setSelectedUseCase] = useState('split');

  const progressColors = ['#1a7a5e', '#25a87f'];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient
        colors={step === 3 ? ['#1e3a5f', '#6C3EF4'] : ['#0a1f16', '#1a7a5e']}
        style={[styles.topArt, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.topIcon}>
          <Text style={{ fontSize: 30 }}>{step === 3 ? '🚀' : '💸'}</Text>
        </View>
        <Text style={styles.topName}>{step === 3 ? 'Set Up Profile' : 'Create Account'}</Text>
        <Text style={styles.topSub}>Join Hisaab — It's free!</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Progress dots */}
        <View style={styles.progressRow}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[styles.progressDot, n <= step && styles.progressDotDone]}
            />
          ))}
        </View>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <Text style={styles.title}>Your Name</Text>
            <Text style={styles.sub}>Let's start with the basics</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={styles.inputIcon}>
                <Text style={styles.inputEmoji}>👤</Text>
                <TextInput style={styles.input} placeholder="e.g. Rahul Kumar" placeholderTextColor={COLORS.text3} value={name} onChangeText={setName} />
              </View>
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>PHONE NUMBER</Text>
              <View style={styles.inputIcon}>
                <Text style={styles.inputEmoji}>📱</Text>
                <TextInput style={styles.input} placeholder="+91 XXXXX XXXXX" placeholderTextColor={COLORS.text3} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </View>
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>EMAIL (OPTIONAL)</Text>
              <View style={styles.inputIcon}>
                <Text style={styles.inputEmoji}>✉️</Text>
                <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={COLORS.text3} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => setStep(2)} activeOpacity={0.85}>
              <Text style={styles.btnText}>Continue →</Text>
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
            <Text style={styles.sub}>Enter the OTP sent to +91 98XXX XXXXX</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>OTP CODE</Text>
              <View style={styles.otpRow}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <TextInput
                    key={i}
                    style={styles.otpInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    textAlign="center"
                    placeholderTextColor={COLORS.text3}
                    placeholder="·"
                  />
                ))}
              </View>
              <Text style={styles.resendText}>
                Didn't receive? <Text style={styles.resendLink}>Resend in 30s</Text>
              </Text>
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>SET PASSWORD</Text>
              <View style={styles.inputIcon}>
                <Text style={styles.inputEmoji}>🔒</Text>
                <TextInput style={styles.input} placeholder="Min 8 characters" placeholderTextColor={COLORS.text3} secureTextEntry />
              </View>
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
              <View style={styles.inputIcon}>
                <Text style={styles.inputEmoji}>🔒</Text>
                <TextInput style={styles.input} placeholder="Re-enter password" placeholderTextColor={COLORS.text3} secureTextEntry />
              </View>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => setStep(3)} activeOpacity={0.85}>
              <Text style={styles.btnText}>Verify & Continue →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => setStep(1)} activeOpacity={0.85}>
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
                  <TouchableOpacity
                    key={av}
                    style={[styles.avatarOpt, selectedAvatar === i && styles.avatarOptActive]}
                    onPress={() => setSelectedAvatar(i)}
                    activeOpacity={0.8}
                  >
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
                  const isSelected = selectedUseCase === uc.id;
                  return (
                    <TouchableOpacity
                      key={uc.id}
                      onPress={() => setSelectedUseCase(uc.id)}
                      style={[styles.ucCard, isSelected && styles.ucCardActive]}
                      activeOpacity={0.85}
                    >
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

            <TouchableOpacity style={styles.btn} onPress={() => login(selectedUseCase)} activeOpacity={0.85}>
              <Text style={styles.btnText}>🚀 Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => setStep(2)} activeOpacity={0.85}>
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  topName: { fontFamily: FONTS.nunito.black, fontSize: 22, color: '#fff' },
  topSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.65)' },
  body: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 24, paddingTop: 20 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressDot: { flex: 1, height: 4, borderRadius: 99, backgroundColor: COLORS.border },
  progressDotDone: { backgroundColor: COLORS.primary },
  title: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xxl, color: COLORS.text, marginBottom: 4 },
  sub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2, marginBottom: 24 },
  inputWrap: { marginBottom: 14 },
  inputLabel: {
    fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2,
    color: COLORS.text2, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 6,
  },
  inputIcon: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1.5,
    borderColor: COLORS.border, borderRadius: RADIUS.lg,
    paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  inputEmoji: { fontSize: 18 },
  input: { flex: 1, fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md2, color: COLORS.text },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  otpInput: {
    width: 42, height: 48,
    backgroundColor: '#fff', borderWidth: 1.5,
    borderColor: COLORS.border, borderRadius: RADIUS.lg,
    fontFamily: FONTS.nunito.extraBold, fontSize: 20, color: COLORS.text,
  },
  resendText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2, marginTop: 6 },
  resendLink: { color: COLORS.primary, fontFamily: FONTS.nunito.bold },
  avatarRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  avatarOpt: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#F3F4F6', borderWidth: 2,
    borderColor: 'transparent', alignItems: 'center', justifyContent: 'center',
  },
  avatarOptActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryUltraLight },
  ucCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: '#fff',
  },
  ucCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryUltraLight, borderWidth: 2 },
  ucTitle: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  ucSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    padding: 14, alignItems: 'center', marginTop: 6,
  },
  btnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff', letterSpacing: 0.2 },
  btnOutline: {
    borderRadius: RADIUS.xl, borderWidth: 1.5,
    borderColor: COLORS.primary, padding: 13,
    alignItems: 'center', marginTop: 10,
  },
  btnOutlineText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.primary },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  switchText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  switchLink: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: COLORS.primary },
});
