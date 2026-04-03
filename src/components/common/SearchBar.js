import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { AppText } from '../ui';
import { colors, radius } from '../../theme';

export default function SearchBar({ placeholder = 'Search...', value, onChangeText, style }) {
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.icon}>🔍</AppText>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
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
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 10,
  },
  icon: { fontSize: 14 },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: colors.text,
    padding: 0,
  },
});
