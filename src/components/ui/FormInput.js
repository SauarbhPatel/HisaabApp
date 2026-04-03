import React from 'react';
import { View, TextInput as RNInput, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

export default function FormInput({ label, placeholder, value, onChangeText, style, inputStyle, multiline, keyboardType, secureTextEntry }) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10 },
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: colors.text,
  },
});
