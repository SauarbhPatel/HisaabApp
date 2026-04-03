import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

const METHODS = [
  { id: 'upi', icon: '📱', label: 'UPI / PhonePe / GPay' },
  { id: 'cash', icon: '💵', label: 'Cash' },
  { id: 'bank', icon: '🏦', label: 'Bank Transfer / NEFT' },
  { id: 'cheque', icon: '🧾', label: 'Cheque' },
];

export default function PaymentMethodPicker({ value, onChange, options }) {
  const methods = options || METHODS.slice(0, 3);
  return (
    <View style={styles.container}>
      {methods.map((m) => (
        <TouchableOpacity
          key={m.id}
          onPress={() => onChange(m.id)}
          style={[styles.option, value === m.id && styles.optionSelected]}
          activeOpacity={0.8}
        >
          <Text style={styles.optionIcon}>{m.icon}</Text>
          <Text style={[styles.optionLabel, value === m.id && styles.optionLabelSelected]}>{m.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, marginBottom: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryUltraLight,
  },
  optionIcon: { fontSize: 20 },
  optionLabel: {
    fontFamily: FONTS.nunito.bold,
    fontSize: SIZES.md,
    color: COLORS.text2,
  },
  optionLabelSelected: { color: COLORS.text },
});
