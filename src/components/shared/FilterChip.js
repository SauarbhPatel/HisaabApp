import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

export function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.75}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function FilterChipRow({ chips, activeChip, onSelect, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.row, style]}
      contentContainerStyle={styles.rowContent}
    >
      {chips.map((chip) => (
        <FilterChip
          key={chip}
          label={chip}
          active={activeChip === chip}
          onPress={() => onSelect(chip)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexGrow: 0 },
  rowContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontFamily: FONTS.nunito.bold,
    fontSize: SIZES.base,
    color: COLORS.text2,
  },
  chipTextActive: { color: '#fff' },
});
