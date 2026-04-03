import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GradientHeader({ colors, children, style }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.13, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + 6 }, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
});
