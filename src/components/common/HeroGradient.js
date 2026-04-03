import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HeroGradient({ colors, style, children }) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.base, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
  },
});
