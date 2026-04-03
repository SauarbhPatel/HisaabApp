import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Avatar, Card } from '../components/ui';
import { colors, shadows } from '../theme';

function SettingRow({ icon, title, sub, right, onPress }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <AppText style={styles.rowIcon}>{icon}</AppText>
        <View>
          <AppText variant="label" color={colors.text}>{title}</AppText>
          {sub ? <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 1 }}>{sub}</AppText> : null}
        </View>
      </View>
      {right !== undefined ? right : <AppText style={styles.arrow}>›</AppText>}
    </TouchableOpacity>
  );
}

function SettingsGroup({ children }) {
  return <View style={styles.group}>{children}</View>;
}

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notifs,  setNotifs]  = useState(true);
  const [budget,  setBudget]  = useState(true);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <AppText style={styles.backText}>← Back</AppText>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <View style={styles.avatar}>
            <AppText style={styles.avatarText}>RK</AppText>
          </View>
          <AppText variant="h2" color="#fff" style={{ marginTop: 10 }}>Rahul Kumar</AppText>
          <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{ marginTop: 3 }}>
            rahul.kumar@gmail.com · Freelancer
          </AppText>
          <View style={styles.badgeRow}>
            {['7 Projects', '4 Devs', '3 Clients'].map(b => (
              <View key={b} style={styles.badge}>
                <AppText variant="labelSm" color="#fff">{b}</AppText>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Spent', value: '₹8,940', color: colors.danger  },
            { label: 'Income',      value: '₹34,000', color: colors.blue   },
            { label: 'Owed to You', value: '₹5,650',  color: colors.primary },
            { label: 'Dev Dues',    value: '₹9,000',   color: colors.accent },
          ].map(s => (
            <View key={s.label} style={styles.statBox}>
              <AppText variant="h3" color={s.color}>{s.value}</AppText>
              <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>{s.label}</AppText>
            </View>
          ))}
        </View>

        {/* Account */}
        <SettingsGroup>
          <SettingRow icon="👤" title="Edit Profile"     sub="Name, photo, phone" />
          <SettingRow icon="💳" title="Payment Methods"  sub="UPI, Bank, Cards" />
          <SettingRow icon="👨‍💻" title="My Developers"    sub="Manage dev team" onPress={() => {}} />
          <SettingRow icon="🏢" title="My Clients"       sub="Maksoft, Flatshare, School" onPress={() => {}} />
        </SettingsGroup>

        {/* Prefs */}
        <SettingsGroup>
          <SettingRow
            icon="🔔" title="Notifications" sub="Reminders & alerts"
            right={<Switch value={notifs} onValueChange={setNotifs} trackColor={{ false: '#E5E7EB', true: colors.primaryLight }} thumbColor={notifs ? colors.primary : '#f4f3f4'} />}
          />
          <SettingRow
            icon="💰" title="Budget Alerts" sub="Alert at 80% of budget"
            right={<Switch value={budget} onValueChange={setBudget} trackColor={{ false: '#E5E7EB', true: colors.primaryLight }} thumbColor={budget ? colors.primary : '#f4f3f4'} />}
          />
        </SettingsGroup>

        {/* Tools */}
        <SettingsGroup>
          <SettingRow icon="📊" title="Export Reports"      sub="PDF, CSV, Excel" />
          <SettingRow icon="🧾" title="Invoice Templates"   sub="Create & send invoices" />
          <SettingRow icon="🔒" title="Privacy & Security"  sub="PIN, biometrics" />
        </SettingsGroup>

        <TouchableOpacity style={styles.logoutBtn}>
          <AppText variant="label" color={colors.danger}>🚪 Log Out</AppText>
        </TouchableOpacity>
        <AppText variant="caption" color={colors.textTertiary} style={styles.version}>Hisaab v1.0.0</AppText>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero:       { paddingHorizontal: 18, paddingBottom: 24 },
  back:       { marginBottom: 10 },
  backText:   { fontFamily: 'Nunito_700Bold', fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  avatar:     { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Nunito_900Black', fontSize: 26, color: '#fff' },
  badgeRow:   { flexDirection: 'row', gap: 10, marginTop: 14 },
  badge:      { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  body:       { padding: 14 },
  statsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  statBox:    { flex: 1, minWidth: '45%', backgroundColor: colors.card, borderRadius: 12, padding: 10, alignItems: 'center', ...shadows.sm },
  group:      { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 14, ...shadows.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLeft:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowIcon:    { fontSize: 18 },
  arrow:      { fontSize: 18, color: colors.textTertiary },
  logoutBtn:  { alignItems: 'center', padding: 14 },
  version:    { textAlign: 'center', marginBottom: 8 },
});
