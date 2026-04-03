// ─────────────────────────────────────────────────────────────
// AppText
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fonts } from '../../theme';

const T_STYLES = {
  h1:      { fontFamily: fonts.black,     fontSize: 24, letterSpacing: -0.5 },
  h2:      { fontFamily: fonts.black,     fontSize: 20 },
  h3:      { fontFamily: fonts.extraBold, fontSize: 16 },
  h4:      { fontFamily: fonts.extraBold, fontSize: 14 },
  label:   { fontFamily: fonts.bold,      fontSize: 12 },
  labelSm: { fontFamily: fonts.bold,      fontSize: 10 },
  sectionHeader: { fontFamily: fonts.extraBold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 },
  body:    { fontFamily: fonts.regular,   fontSize: 13 },
  bodySm:  { fontFamily: fonts.regular,   fontSize: 11 },
  bodyMd:  { fontFamily: fonts.medium,    fontSize: 12 },
  caption: { fontFamily: fonts.regular,   fontSize: 10 },
  amount:  { fontFamily: fonts.black,     fontSize: 22, letterSpacing: -0.5 },
  amountLg:{ fontFamily: fonts.black,     fontSize: 34, letterSpacing: -1 },
};

export function AppText({ variant = 'body', color, style, children, numberOfLines, onPress }) {
  return (
    <Text
      style={[T_STYLES[variant] || T_STYLES.body, color ? { color } : null, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
}

// ─────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────
import { View } from 'react-native';
import { colors, radius, shadows } from '../../theme';

export function Card({ children, style, padding = 14 }) {
  return <View style={[{ backgroundColor: colors.card, borderRadius: radius.lg, padding, marginBottom: 12, ...shadows.sm }, style]}>{children}</View>;
}

// ─────────────────────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────────────────────
export function Avatar({ initials, color = '#1a7a5e', size = 42 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <AppText style={{ fontSize: size * 0.37, fontFamily: fonts.extraBold, color: '#fff' }}>{initials}</AppText>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────
import { TouchableOpacity, ActivityIndicator } from 'react-native';

const BTN_VARIANTS = {
  primary:   { bg: '#1a7a5e', text: '#fff',     border: null },
  secondary: { bg: '#e1f5ee', text: '#1a7a5e',  border: null },
  outline:   { bg: 'transparent', text:'#1a7a5e', border:'#1a7a5e' },
  ghost:     { bg: '#F3F4F6', text: '#6B7280',  border: null },
  danger:    { bg: '#FEE2E2', text: '#EF4444',  border: null },
  blue:      { bg: '#DBEAFE', text: '#1D4ED8',  border: null },
  success:   { bg: '#D1FAE5', text: '#065F46',  border: null },
  accent:    { bg: '#FEF3C7', text: '#92400E',  border: null },
  solidBlue: { bg: '#2563eb', text: '#fff',     border: null },
};
const BTN_SIZES = {
  sm: { py: 6,  px: 12, fs: 11, br: 8  },
  md: { py: 11, px: 16, fs: 13, br: 12 },
  lg: { py: 14, px: 20, fs: 14, br: 14 },
};

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, style, textStyle }) {
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const s = BTN_SIZES[size] || BTN_SIZES.md;
  return (
    <TouchableOpacity
      onPress={onPress} activeOpacity={0.82}
      style={[{ alignItems:'center', justifyContent:'center', backgroundColor: v.bg, paddingVertical: s.py, paddingHorizontal: s.px, borderRadius: s.br },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : null, style]}
    >
      {loading
        ? <ActivityIndicator size="small" color={v.text} />
        : <Text style={[{ fontFamily: fonts.extraBold, color: v.text, fontSize: s.fs }, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────
// ProgressBar
// ─────────────────────────────────────────────────────────────
export function ProgressBar({ progress = 0, color = '#1a7a5e', height = 7, style }) {
  const clamped = Math.min(Math.max(progress, 0), 100);
  return (
    <View style={[{ height, backgroundColor: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }, style]}>
      <View style={{ width: `${clamped}%`, height, backgroundColor: color, borderRadius: 999 }} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// FormInput
// ─────────────────────────────────────────────────────────────
import { TextInput } from 'react-native';

export function FormInput({ label, placeholder, value, onChangeText, style, keyboardType, secureTextEntry, multiline }) {
  return (
    <View style={[{ marginBottom: 10 }, style]}>
      {label ? <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.text2, marginBottom: 4 }}>{label}</Text> : null}
      <TextInput
        style={{ backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontFamily: fonts.regular, fontSize: 13, color: colors.text }}
        placeholder={placeholder} placeholderTextColor={colors.text3}
        value={value} onChangeText={onChangeText}
        keyboardType={keyboardType} secureTextEntry={secureTextEntry} multiline={multiline}
      />
    </View>
  );
}
