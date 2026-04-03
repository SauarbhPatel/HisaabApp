import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── SectionHeader ───────────────────────────────────────────────────────────
export function SectionHeader({ children, style }) {
  return <Text style={[styles.sectionHeader, style]}>{children}</Text>;
}

// ─── FormLabel ───────────────────────────────────────────────────────────────
export function FormLabel({ children }) {
  return <Text style={styles.formLabel}>{children}</Text>;
}

// ─── FormInput ───────────────────────────────────────────────────────────────
export function FormInput({ style, ...props }) {
  return <TextInput style={[styles.formInput, style]} placeholderTextColor={COLORS.text3} {...props} />;
}

// ─── SubmitButton ─────────────────────────────────────────────────────────────
export function SubmitButton({ label, onPress, style, color }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.submitBtn, color ? { backgroundColor: color } : {}, style]}
      activeOpacity={0.85}
    >
      <Text style={styles.submitBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── BackButton ──────────────────────────────────────────────────────────────
export function BackButton({ onPress, light }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backBtn} activeOpacity={0.7}>
      <Text style={[styles.backBtnText, light && { color: 'rgba(255,255,255,0.9)' }]}>← Back</Text>
    </TouchableOpacity>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  sectionHeader: {
    fontFamily: FONTS.nunito.extraBold,
    fontSize: SIZES.sm2,
    color: COLORS.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  formLabel: {
    fontFamily: FONTS.dmSans.semiBold,
    fontSize: SIZES.sm2,
    color: COLORS.text2,
    marginBottom: 4,
  },
  formInput: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: SIZES.md,
    fontFamily: FONTS.dmSans.regular,
    color: COLORS.text,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    fontFamily: FONTS.nunito.extraBold,
    fontSize: SIZES.md2,
    color: '#fff',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  backBtnText: {
    fontFamily: FONTS.nunito.bold,
    fontSize: SIZES.md,
    color: 'rgba(255,255,255,0.9)',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
});
