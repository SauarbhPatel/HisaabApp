import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { Text } from 'react-native';

export default function SearchBar({ placeholder, value, onChangeText, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Search...'}
        placeholderTextColor={COLORS.text3}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 10,
  },
  icon: { fontSize: 16 },
  input: {
    flex: 1,
    fontFamily: FONTS.dmSans.regular,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
});
