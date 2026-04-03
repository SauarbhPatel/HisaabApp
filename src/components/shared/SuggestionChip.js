import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

export function SuggestionChip({ label, onPress, small }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, small && styles.chipSm]} activeOpacity={0.75}>
      <Text style={[styles.chipText, small && styles.chipTextSm]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SuggestionChipRow({ chips, onSelect, style, small }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.row, style]}
      contentContainerStyle={styles.rowContent}
    >
      {chips.map((chip) => (
        <SuggestionChip
          key={chip}
          label={chip}
          small={small}
          onPress={() => onSelect(chip)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexGrow: 0, marginTop: 6 },
  rowContent: { paddingBottom: 2, gap: 6, flexDirection: 'row' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryUltraLight,
    borderWidth: 1.5,
    borderColor: 'rgba(26,122,94,0.2)',
  },
  chipSm: { paddingHorizontal: 10, paddingVertical: 5 },
  chipText: {
    fontFamily: FONTS.nunito.bold,
    fontSize: SIZES.base,
    color: COLORS.primary,
  },
  chipTextSm: { fontSize: SIZES.sm2 },
});
