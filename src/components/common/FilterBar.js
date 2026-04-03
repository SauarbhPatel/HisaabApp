import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, radius } from '../../theme';

export default function FilterBar({ options, active, onSelect, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={styles.row}
    >
      {options.map((opt) => {
        const isActive = active === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: colors.textSecondary },
  chipTextActive: { color: colors.white },
});
