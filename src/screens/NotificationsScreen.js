import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '../components/ui';
import { SectionHeader } from '../components/common';
import NotificationCard from '../features/notifications/NotificationCard';
import { notifications } from '../data/mockData';
import { colors } from '../theme';

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n =>  n.read);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <AppText style={styles.backText}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color="#fff">🔔 Notifications</AppText>
        <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>
          {unread.length} unread alerts
        </AppText>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {unread.length > 0 && (
            <>
              <SectionHeader title="Unread" />
              {unread.map(n => <NotificationCard key={n.id} notif={n} />)}
            </>
          )}
          <SectionHeader title="Earlier" style={{ marginTop: 6 }} />
          {read.map(n => <NotificationCard key={n.id} notif={n} />)}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero:     { paddingHorizontal: 18, paddingBottom: 18 },
  back:     { marginBottom: 8 },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  body:     { padding: 14 },
});
