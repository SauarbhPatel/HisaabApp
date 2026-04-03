import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { NOTIFICATIONS } from '../../data/mockData';

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔔 Notifications</Text>
        <Text style={styles.headerSub}>2 unread alerts</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <Text style={styles.sectionHeader}>Unread</Text>
          {NOTIFICATIONS.unread.map((n) => (
            <View key={n.id} style={[styles.notifCard, { borderLeftColor: n.borderColor }]}>
              <View style={[styles.notifIcon, { backgroundColor: n.iconBg }]}>
                <Text style={{ fontSize: 18 }}>{n.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifBody}>{n.body}</Text>
                {n.actions.length > 0 && (
                  <View style={styles.actionsRow}>
                    {n.actions.map((a) => (
                      <TouchableOpacity
                        key={a.label}
                        style={[styles.actionBtn, { backgroundColor: a.bg }]}
                        onPress={() => a.navigate && navigation.navigate(a.navigate)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.actionBtnText, { color: a.color }]}>{a.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <Text style={styles.notifTime}>{n.time || ''}</Text>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 6 }]}>Earlier</Text>
          {NOTIFICATIONS.earlier.map((n) => (
            <View key={n.id} style={[styles.notifCard, styles.notifCardDim]}>
              <View style={[styles.notifIcon, { backgroundColor: n.iconBg }]}>
                <Text style={{ fontSize: 18 }}>{n.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifBody}>{n.body}</Text>
                {n.actions.length > 0 && (
                  <View style={styles.actionsRow}>
                    {n.actions.map((a) => (
                      <TouchableOpacity key={a.label} style={[styles.actionBtn, { backgroundColor: a.bg }]} activeOpacity={0.8}>
                        <Text style={[styles.actionBtnText, { color: a.color }]}>{a.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <Text style={styles.notifTime}>{n.time || ''}</Text>
            </View>
          ))}
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 18 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerTitle: { fontFamily: FONTS.nunito.black, fontSize: 20, color: '#fff' },
  headerSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  scroll: { flex: 1 },
  body: { padding: 14 },
  sectionHeader: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  notifCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    ...SHADOWS.card, borderLeftWidth: 4, borderLeftColor: 'transparent',
  },
  notifCardDim: { opacity: 0.8 },
  notifIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  notifBody: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2, marginTop: 3, lineHeight: 18 },
  notifTime: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text3 },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { flex: 1, padding: 6, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
});
