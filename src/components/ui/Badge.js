import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({ label, bg, color, style }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
  },
});
