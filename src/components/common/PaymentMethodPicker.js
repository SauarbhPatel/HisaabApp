import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

const METHODS = [
  { key: 'upi',  icon: '📱', label: 'UPI / PhonePe / GPay' },
  { key: 'cash', icon: '💵', label: 'Cash' },
  { key: 'bank', icon: '🏦', label: 'Bank Transfer' },
];

export default function PaymentMethodPicker({ value, onChange }) {
  return (
    <View style={styles.list}>
      {METHODS.map((m) => {
        const selected = value === m.key;
        return (
          <TouchableOpacity
            key={m.key}
            style={[styles.item, selected && styles.itemSelected]}
            onPress={() => onChange(m.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.icon}>{m.icon}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>{m.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 6 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  itemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryUltraLight,
  },
  icon: { fontSize: 20 },
  label: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.text },
  labelSelected: { color: colors.primary },
});
