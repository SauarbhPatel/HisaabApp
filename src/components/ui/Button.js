import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius } from '../../theme';

/**
 * variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({ title, onPress, variant = 'primary', size = 'md', loading, style, textStyle }) {
  const variantStyles = {
    primary:   { bg: colors.primary, text: colors.white, border: null },
    secondary: { bg: colors.primaryUltraLight, text: colors.primary, border: null },
    outline:   { bg: 'transparent', text: colors.primary, border: colors.primary },
    ghost:     { bg: '#F3F4F6', text: colors.textSecondary, border: null },
    danger:    { bg: colors.dangerBg, text: colors.danger, border: null },
    blue:      { bg: '#DBEAFE', text: '#1D4ED8', border: null },
    success:   { bg: colors.successBg, text: colors.successText, border: null },
    accent:    { bg: colors.accentBg, text: colors.accentText, border: null },
  };
  const sizeStyles = {
    sm: { py: 6, px: 12, fs: 11, br: radius.sm },
    md: { py: 11, px: 16, fs: 13, br: radius.md },
    lg: { py: 14, px: 20, fs: 14, br: radius.md },
  };
  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size] || sizeStyles.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[
        styles.base,
        { backgroundColor: v.bg, paddingVertical: s.py, paddingHorizontal: s.px, borderRadius: s.br },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : null,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator size="small" color={v.text} />
        : <Text style={[styles.text, { color: v.text, fontSize: s.fs }, textStyle]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: 'Nunito_800ExtraBold' },
});
