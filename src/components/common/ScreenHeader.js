import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../ui';
import { colors } from '../../theme';

export default function ScreenHeader({ title, subtitle, gradientColors, onBack, rightElement }) {
  const insets = useSafeAreaInsets();
  const gradColors = gradientColors || [colors.primary, colors.primaryLight];

  return (
    <LinearGradient
      colors={gradColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.8}>
            <AppText style={styles.backText}>← Back</AppText>
          </TouchableOpacity>
        ) : null}
        {rightElement || null}
      </View>
      <AppText variant="h2" color={colors.white} style={styles.title}>{title}</AppText>
      {subtitle ? <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>{subtitle}</AppText> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18, paddingBottom: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  backBtn: { paddingVertical: 4 },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  title: { marginTop: 4 },
});
