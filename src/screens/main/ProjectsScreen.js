import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopBar from '../../components/shared/TopBar';
import { FilterChipRow } from '../../components/shared/FilterChip';
import SearchBar from '../../components/shared/SearchBar';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { PROJECTS, PROJECT_MONTH_GROUPS } from '../../data/mockData';

const FILTERS = ['All', 'Active', 'Completed', 'Pending Pay', 'Maksoft', 'Flatshare'];

const STATUS_CONFIG = {
  completed: { label: '✅ Completed', bg: '#D1FAE5', text: '#065F46' },
  active: { label: '🔵 Active', bg: '#DBEAFE', text: '#1D4ED8' },
  pending: { label: '⏳ In Progress', bg: '#FEF3C7', text: '#92400E' },
  partial: { label: '⚠️ Partial Pay', bg: '#FEE2E2', text: '#991B1B' },
};

const DEV_PILL_CONFIG = {
  'paid-full': { bg: '#D1FAE5', text: '#065F46' },
  'paid-partial': { bg: '#FEF3C7', text: '#92400E' },
  unpaid: { bg: '#FEE2E2', text: '#991B1B' },
};

function DevPill({ dev, onPress }) {
  const cfg = DEV_PILL_CONFIG[dev.payStatus] || DEV_PILL_CONFIG['unpaid'];
  const label = dev.payStatus === 'paid-full'
    ? `${dev.name} · Paid ✅`
    : `${dev.name} · ₹${dev.paid / 1000 > 0 ? dev.paid / 1000 + 'k' : dev.paid}/₹${dev.agreed / 1000 > 0 ? dev.agreed / 1000 + 'k' : dev.agreed}`;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.devPill, { backgroundColor: cfg.bg }]}
      activeOpacity={0.8}
    >
      <View style={[styles.devAv, { backgroundColor: dev.color }]}>
        <Text style={styles.devAvText}>{dev.initials}</Text>
      </View>
      <Text style={[styles.devPillText, { color: cfg.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ProjectCard({ project, navigation }) {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;
  return (
    <TouchableOpacity
      style={styles.projCard}
      onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
      activeOpacity={0.85}
    >
      {/* Header */}
      <View style={styles.projCardHeader}>
        <View style={[styles.companyBadge, { backgroundColor: project.clientColor.bg }]}>
          <Text style={[styles.companyBadgeText, { color: project.clientColor.text }]}>{project.client}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusPillText, { color: status.text }]}>{status.label}</Text>
        </View>
      </View>
      <Text style={styles.projTitle}>
        {project.name}
        {project.subtitle ? <Text style={styles.projSubtitle}> {project.subtitle}</Text> : null}
      </Text>
      <Text style={styles.projDate}>
        {project.startDate}{project.endDate ? ` → ${project.endDate}` : ''}
      </Text>

      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Payment received</Text>
          <Text style={[styles.progressPct, { color: project.progressColor }]}>{project.progressPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${project.progressPct}%`, backgroundColor: project.progressColor }]} />
        </View>
      </View>

      {/* Fin row */}
      <View style={styles.finRow}>
        {[
          { lbl: 'Project Price', val: `₹${project.price.toLocaleString('en-IN')}` },
          { lbl: 'Received', val: `₹${project.received.toLocaleString('en-IN')}`, color: COLORS.primary },
          { lbl: project.pending > 0 ? 'Pending' : 'Pending', val: `₹${project.pending.toLocaleString('en-IN')}`, color: project.pending > 0 ? COLORS.danger : COLORS.text2 },
        ].map((f) => (
          <View key={f.lbl} style={styles.finItem}>
            <Text style={styles.finLbl}>{f.lbl}</Text>
            <Text style={[styles.finVal, f.color ? { color: f.color } : {}]}>{f.val}</Text>
          </View>
        ))}
      </View>

      {/* Date chips */}
      <View style={styles.dateChips}>
        {project.payments.slice(0, 2).map((p) => (
          <View key={p.id} style={[styles.dateChip, p.status === 'pending' ? styles.dateChipOverdue : styles.dateChipStart]}>
            <Text style={[styles.dateChipText, p.status === 'pending' ? { color: '#92400E' } : { color: COLORS.accent2 }]}>
              {p.status === 'pending' ? `⏰ ₹${p.amount.toLocaleString('en-IN')} due` : `📥 ${p.date?.slice(0, 5)} · ₹${p.amount.toLocaleString('en-IN')}`}
            </Text>
          </View>
        ))}
      </View>

      {/* Developers */}
      <Text style={styles.devsLabel}>Developers</Text>
      <View style={styles.devPills}>
        {project.developers.map((dev) => (
          <DevPill
            key={dev.id}
            dev={dev}
            onPress={() => navigation.navigate('DevPay', { devId: dev.id, projectId: project.id })}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: COLORS.primaryUltraLight }]}
          onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
        >
          <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>👁 Details</Text>
        </TouchableOpacity>
        {project.status !== 'completed' && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#DBEAFE' }]}
            onPress={() => navigation.navigate('DevPay', { projectId: project.id })}
          >
            <Text style={[styles.actionBtnText, { color: '#1D4ED8' }]}>💸 Pay Dev</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.actionBtnText, { color: '#92400E' }]}>🧾 Invoice</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function ProjectsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={COLORS.gradientBlue} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.heroTitle}>💼 Freelance Projects</Text>
          <Text style={styles.heroSub}>Track income, clients & developer payments</Text>
          <View style={styles.heroStats}>
            {[{ val: '₹34k', lbl: 'Received' }, { val: '₹10k', lbl: 'Pending' }, { val: '3', lbl: 'Active' }].map((s) => (
              <View key={s.lbl} style={styles.heroStat}>
                <Text style={styles.heroStatVal}>{s.val}</Text>
                <Text style={styles.heroStatLbl}>{s.lbl}</Text>
              </View>
            ))}
          </View>
          <View style={styles.incomeBanner}>
            <Text>💰</Text>
            <Text style={styles.incomeBannerText}>Total project value Mar: ₹44,000 · Profit after dev pay: ₹25,500</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Year + New Project row */}
          <View style={styles.topRow}>
            <View style={styles.yearRow}>
              <Text style={styles.yearLabel}>{year} Projects</Text>
              <View style={styles.yearPicker}>
                <TouchableOpacity onPress={() => setYear(y => y - 1)}>
                  <Text style={styles.yearArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.yearNum}>{year}</Text>
                <TouchableOpacity onPress={() => setYear(y => y + 1)}>
                  <Text style={styles.yearArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.newProjBtn}
              onPress={() => navigation.navigate('AddProject')}
              activeOpacity={0.85}
            >
              <Text style={styles.newProjBtnText}>+ New Project</Text>
            </TouchableOpacity>
          </View>

          <SearchBar placeholder="Search projects, clients..." value={search} onChangeText={setSearch} style={{ marginHorizontal: 0, marginBottom: 8 }} />
          <FilterChipRow chips={FILTERS} activeChip={filter} onSelect={setFilter} style={{ marginHorizontal: -14, paddingHorizontal: 0, marginBottom: 4 }} />

          {/* Month-grouped projects */}
          {PROJECT_MONTH_GROUPS.map((group) => (
            <View key={group.label}>
              <View style={styles.monthGroup}>
                <Text style={styles.monthGroupLabel}>📅 {group.label}</Text>
                <Text style={styles.monthGroupTotal}>{group.total}</Text>
              </View>
              {group.projectIds.map((pid) => {
                const project = PROJECTS.find((p) => p.id === pid);
                if (!project) return null;
                return <ProjectCard key={pid} project={project} navigation={navigation} />;
              })}
            </View>
          ))}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { padding: 18, paddingBottom: 22 },
  heroTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  heroSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  heroStats: { flexDirection: 'row', gap: 8, marginTop: 14 },
  heroStat: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, padding: 10, alignItems: 'center',
  },
  heroStatVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
  heroStatLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.xs, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  incomeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderRadius: 10, padding: 8, marginTop: 12,
  },
  incomeBannerText: { fontFamily: FONTS.nunito.semiBold, fontSize: SIZES.base, color: '#A7F3D0', flex: 1 },
  body: { padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  yearRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  yearLabel: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5 },
  yearPicker: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  yearArrow: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.primary },
  yearNum: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.text, minWidth: 32, textAlign: 'center' },
  newProjBtn: {
    backgroundColor: '#1e3a5f', borderRadius: RADIUS.lg,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  newProjBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base, color: '#fff' },
  monthGroup: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 10,
  },
  monthGroupLabel: { fontFamily: FONTS.nunito.black, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5 },
  monthGroupTotal: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.primary },
  projCard: {
    backgroundColor: COLORS.card, borderRadius: 18, padding: 14,
    marginBottom: 12, ...SHADOWS.card,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  projCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  companyBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  companyBadgeText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
  projTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2, color: COLORS.text },
  projSubtitle: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.base, color: COLORS.text2 },
  projDate: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2, marginBottom: 10 },
  progressWrap: { marginBottom: 10 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm2, color: COLORS.text2 },
  progressPct: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2 },
  progressTrack: { height: 7, backgroundColor: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  finRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  finItem: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 8 },
  finLbl: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm, color: COLORS.text2 },
  finVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2, color: COLORS.text, marginTop: 2 },
  dateChips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  dateChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  dateChipStart: { backgroundColor: '#EDE9FE' },
  dateChipOverdue: { backgroundColor: '#FEF3C7' },
  dateChipText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
  devsLabel: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm2, color: COLORS.text2, marginBottom: 6 },
  devPills: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  devPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  devAv: {
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  devAvText: { fontFamily: FONTS.nunito.extraBold, fontSize: 8, color: '#fff' },
  devPillText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  actionBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: 'center' },
  actionBtnText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
});
