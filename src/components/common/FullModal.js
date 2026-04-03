import React from 'react';
import { Modal, View, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../ui';
import { colors, radius } from '../../theme';

export default function FullModal({
  visible, onClose, title, subtitle,
  gradientColors, children, footer,
}) {
  const insets = useSafeAreaInsets();
  const grad = gradientColors || [colors.primary, colors.primaryLight];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.8}>
            <AppText style={styles.backText}>← Back</AppText>
          </TouchableOpacity>
          <AppText variant="h2" color={colors.white}>{title}</AppText>
          {subtitle ? <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>{subtitle}</AppText> : null}
        </LinearGradient>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
          <View style={{ height: 32 }} />
        </ScrollView>

        {footer ? (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
            {footer}
          </View>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 18 },
  backBtn: { marginBottom: 8 },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  scroll: { flex: 1 },
  content: { padding: 14 },
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
    paddingHorizontal: 14,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
});
