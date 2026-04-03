import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from '../../components/shared/SearchBar';
import { FilterChipRow } from '../../components/shared/FilterChip';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { DEVELOPERS } from '../../data/mockData';

const ROLE_FILTERS = ['All', 'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'DevOps', 'Mobile'];

export default function MyDevsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>👨‍💻 My Developers / Teams</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddDevForm')} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar placeholder="Search developers..." value={search} onChangeText={setSearch} style={{ marginTop: 12 }} />
        <FilterChipRow chips={ROLE_FILTERS} activeChip={filter} onSelect={setFilter} />

        <View style={styles.body}>
          <Text style={styles.sectionHeader}>Your Team ({DEVELOPERS.length})</Text>
          {DEVELOPERS.map((dev) => {
            const isActive = dev.status === 'active';
            const statusCfg = dev.pending === 0
              ? { bg: '#D1FAE5', text: '#065F46', label: 'Paid ✅' }
              : dev.totalPaid === 0
                ? { bg: '#FEE2E2', text: '#991B1B', label: 'Unpaid' }
                : { bg: '#FEF3C7', text: '#92400E', label: 'Pending ₹' + (dev.pending / 1000) + 'k' };
            if (!isActive) statusCfg.bg = '#F3F4F6', statusCfg.text = '#6B7280', statusCfg.label = '⏸ Inactive';

            return (
              <View key={dev.id} style={[styles.devCard, !isActive && styles.devCardInactive]}>
                <View style={styles.devTop}>
                  <View style={[styles.devAv, { backgroundColor: isActive ? dev.color : '#9CA3AF' }]}>
                    <Text style={styles.devAvText}>{dev.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.devName, !isActive && { color: COLORS.text2 }]}>{dev.name}</Text>
                    <Text style={styles.devRole}>{dev.role} · {dev.phone}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                    <Text style={[styles.statusText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  {[
                    { lbl: 'Total Paid', val: `₹${dev.totalPaid.toLocaleString('en-IN')}`, color: COLORS.primary },
                    { lbl: 'Pending', val: `₹${dev.pending.toLocaleString('en-IN')}`, color: dev.pending > 0 ? COLORS.danger : COLORS.text2 },
                    { lbl: 'Projects', val: String(dev.projects), color: COLORS.text },
                  ].map((s) => (
                    <View key={s.lbl} style={styles.statBox}>
                      <Text style={styles.statLbl}>{s.lbl}</Text>
                      <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#DBEAFE' }]}
                    onPress={() => navigation.navigate('DevPay', { devId: dev.id })}>
                    <Text style={[styles.actionText, { color: '#1D4ED8' }]}>💸 Pay Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.actionText, { color: '#065F46' }]}>💬 WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F3F4F6' }]}
                    onPress={() => navigation.navigate('DevDetail', { devId: dev.id })}>
                    <Text style={[styles.actionText, { color: COLORS.text2 }]}>👁 View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff', flex: 1 },
  addBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  addBtnText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: '#fff' },
  body: { paddingHorizontal: 14 },
  sectionHeader: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  devCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10, ...SHADOWS.card },
  devCardInactive: { borderWidth: 1.5, borderColor: COLORS.border, opacity: 0.75 },
  devTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  devAv: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  devAvText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.lg2, color: '#fff' },
  devName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
  devRole: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  statBox: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 9, padding: 7 },
  statLbl: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm, color: COLORS.text2 },
  statVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: 'center' },
  actionText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
});
