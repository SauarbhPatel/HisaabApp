import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Avatar({ initials, color = '#1a7a5e', size = 42, fontSize }) {
  const fs = fontSize || Math.round(size * 0.37);
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.text, { fontSize: fs }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: 'Nunito_800ExtraBold', color: '#fff' },
});
