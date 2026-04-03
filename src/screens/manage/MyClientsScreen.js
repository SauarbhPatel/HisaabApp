import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from '../../components/shared/SearchBar';
import { FilterChipRow } from '../../components/shared/FilterChip';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { CLIENTS } from '../../data/mockData';

const INDUSTRY_FILTERS = ['All', 'Tech', 'Education', 'Real Estate', 'Retail', 'Finance'];

export default function MyClientsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientBlue} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>🏢 My Clients</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddClientForm')} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar placeholder="Search clients..." value={search} onChangeText={setSearch} style={{ marginTop: 12 }} />
        <FilterChipRow chips={INDUSTRY_FILTERS} activeChip={filter} onSelect={setFilter} />

        <View style={styles.body}>
          <Text style={styles.sectionHeader}>Your Clients ({CLIENTS.length})</Text>
          {CLIENTS.map((client) => {
            const statusCfg = client.pending === 0
              ? { bg: '#D1FAE5', text: '#065F46', label: 'Active' }
              : client.pending > 5000
                ? { bg: '#FEE2E2', text: '#991B1B', label: `Due ₹${(client.pending / 1000).toFixed(0)}k` }
                : { bg: '#FEF3C7', text: '#92400E', label: `Pending ₹${(client.pending / 1000).toFixed(0)}k` };

            return (
              <View key={client.id} style={styles.clientCard}>
                <View style={styles.clientTop}>
                  <View style={[styles.clientIcon, { backgroundColor: client.iconBg }]}>
                    <Text style={{ fontSize: 20 }}>{client.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientSub}>Contact: {client.contact} · {client.phone}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                    <Text style={[styles.statusText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  {[
                    { lbl: 'Total Billed', val: `₹${client.totalBilled.toLocaleString('en-IN')}` },
                    { lbl: 'Received', val: `₹${client.received.toLocaleString('en-IN')}`, color: COLORS.primary },
                    { lbl: 'Projects', val: String(client.projects) },
                  ].map((s) => (
                    <View key={s.lbl} style={styles.statBox}>
                      <Text style={styles.statLbl}>{s.lbl}</Text>
                      <Text style={[styles.statVal, s.color ? { color: s.color } : {}]}>{s.val}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primaryUltraLight }]}>
                    <Text style={[styles.actionText, { color: COLORS.primary }]}>📞 Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.actionText, { color: '#065F46' }]}>💬 WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#DBEAFE' }]}
                    onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}>
                    <Text style={[styles.actionText, { color: '#1D4ED8' }]}>👁 View</Text>
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
  clientCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10, ...SHADOWS.card },
  clientTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  clientIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  clientName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
  clientSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  statBox: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 9, padding: 7 },
  statLbl: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm, color: COLORS.text2 },
  statVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: 'center' },
  actionText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
});
