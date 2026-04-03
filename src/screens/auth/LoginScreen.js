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

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useAppContext();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Top art */}
      <LinearGradient
        colors={['#0a1f16', '#1a7a5e']}
        style={[styles.topArt, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.topIcon}><Text style={{ fontSize: 30 }}>💸</Text></View>
        <Text style={styles.topName}>Hisaab</Text>
        <Text style={styles.topSub}>Welcome back 👋</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.sub}>Enter your phone number or email to continue</Text>

        {/* Phone / Email */}
        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>PHONE OR EMAIL</Text>
          <View style={styles.inputIcon}>
            <Text style={styles.inputEmoji}>📱</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 XXXXX XXXXX or email"
              placeholderTextColor={COLORS.text3}
              value={phone}
              onChangeText={setPhone}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <View style={styles.inputIcon}>
            <Text style={styles.inputEmoji}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.text3}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInBtn} onPress={() => login('both')} activeOpacity={0.85}>
          <Text style={styles.signInBtnText}>Sign In →</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text>🇬 Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Text>📱 OTP Login</Text>
          </TouchableOpacity>
        </View>

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
  topArt: {
    paddingBottom: 28,
    alignItems: 'center',
    gap: 8,
  },
  topIcon: {
    width: 60, height: 60, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  topName: { fontFamily: FONTS.nunito.black, fontSize: 22, color: '#fff' },
  topSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.65)' },
  body: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 24, paddingTop: 28 },
  title: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xxl, color: COLORS.text, marginBottom: 4 },
  sub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2, marginBottom: 24 },
  inputWrap: { marginBottom: 14 },
  inputLabel: {
    fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2,
    color: COLORS.text2, textTransform: 'uppercase',
    letterSpacing: 0.04 * SIZES.sm2, marginBottom: 6,
  },
  inputIcon: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1.5,
    borderColor: COLORS.border, borderRadius: RADIUS.lg,
    paddingHorizontal: 14, paddingVertical: 12,
    gap: 10,
  },
  inputEmoji: { fontSize: 18 },
  input: {
    flex: 1, fontFamily: FONTS.dmSans.regular,
    fontSize: SIZES.md2, color: COLORS.text,
  },
  forgotRow: { alignItems: 'flex-end', marginBottom: 18, marginTop: -6 },
  forgotText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.primary },
  signInBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    padding: 14, alignItems: 'center',
  },
  signInBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff', letterSpacing: 0.2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text3 },
  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  socialBtn: {
    flex: 1, padding: 11, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: '#fff', alignItems: 'center',
  },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  switchText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  switchLink: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: COLORS.primary },
});
