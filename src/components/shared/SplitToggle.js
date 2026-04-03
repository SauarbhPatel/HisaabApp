import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

export default function SplitToggle({ value, onChange, options }) {
  const opts = options || ['= Equal', '% Percent', '✏ Custom'];
  return (
    <View style={styles.container}>
      {opts.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onChange(opt)}
          style={[styles.opt, value === opt && styles.optActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.optText, value === opt && styles.optTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 2,
  },
  opt: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  optActive: { backgroundColor: '#fff' },
  optText: {
    fontFamily: FONTS.nunito.bold,
    fontSize: SIZES.base,
    color: COLORS.text2,
  },
  optTextActive: { color: COLORS.primary },
});
