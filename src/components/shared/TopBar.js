import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import { FONTS, SIZES } from '../../theme/typography';

export default function TopBar({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.left}>
        <Text style={styles.appName}>💸 Hisaab</Text>
        <View style={styles.monthBadge}>
          <Text style={styles.monthText}>Mar 2026</Text>
        </View>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => navigation?.navigate('Notifications')} style={styles.iconBtn}>
          <Text style={styles.iconText}>🔔</Text>
          <View style={styles.notifDot}>
            <Text style={styles.notifCount}>2</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('Profile')} style={styles.iconBtn}>
          <Text style={styles.iconText}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appName: {
    fontFamily: FONTS.nunito.extraBold,
    fontSize: SIZES.lg2,
    color: '#fff',
  },
  monthBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  monthText: {
    fontFamily: FONTS.nunito.bold,
    fontSize: SIZES.xs,
    color: '#fff',
  },
  icons: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn: { position: 'relative' },
  iconText: { fontSize: 20 },
  notifDot: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: COLORS.accent,
    width: 15,
    height: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifCount: {
    fontFamily: FONTS.nunito.black,
    fontSize: 8,
    color: '#fff',
  },
});
