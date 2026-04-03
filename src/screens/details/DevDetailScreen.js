import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SinglePayPopup from '../../components/shared/popups/SinglePayPopup';
import { DeleteConfirmPopup } from '../../components/shared/popups/ConfirmPopups';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { DEVELOPERS } from '../../data/mockData';

const PAY_STATUS_CONFIG = {
  'paid-full': { bg: '#D1FAE5', text: '#065F46', label: 'Paid ✅' },
  'paid-partial': { bg: '#FEF3C7', text: '#92400E', label: 'Partial' },
  unpaid: { bg: '#FEE2E2', text: '#991B1B', label: 'Unpaid' },
};

export default function DevDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { devId } = route.params || {};
  const dev = DEVELOPERS.find((d) => d.id === devId) || DEVELOPERS[0];

  const [payPopup, setPayPopup] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);

  const totalAgreed = dev.totalPaid + dev.pending;
  const payPct = totalAgreed > 0 ? Math.round((dev.totalPaid / totalAgreed) * 100) : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientAmber}
        start={{ x: 0.13, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={[styles.devAv, { backgroundColor: dev.color }]}>
              <Text style={styles.devAvText}>{dev.initials}</Text>
            </View>
            <View>
              <Text style={styles.devName}>{dev.name}</Text>
              <Text style={styles.devRole}>{dev.role} · {dev.status === 'active' ? 'Active' : 'Inactive'}</Text>
              <Text style={styles.devPhone}>{dev.phone}</Text>
            </View>
          </View>
          <View style={styles.headerBtns}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditDev', { devId: dev.id })}
              style={styles.hdrBtn}><Text>✏️</Text></TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('DevStatus', { devId: dev.id })}
              style={styles.hdrBtn}><Text>🔄</Text></TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {/* Payment Summary */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DevPaymentPage', { devId: dev.id })}
            activeOpacity={0.85}
          >
            <View style={styles.cardTitleRow}>
              <Text style={styles.sectionHeader}>💰 Payment Summary</Text>
              <Text style={styles.detailsLink}>Details 🔗</Text>
            </View>
            <View style={styles.statsRow}>
              {[
                { val: `₹${dev.totalPaid.toLocaleString('en-IN')}`, lbl: 'Total Paid', color: COLORS.primary },
                { val: `₹${dev.pending.toLocaleString('en-IN')}`, lbl: 'Pending', color: dev.pending > 0 ? COLORS.danger : COLORS.text2 },
                { val: String(dev.projects), lbl: 'Projects', color: COLORS.text },
              ].map((s) => (
                <View key={s.lbl} style={styles.statBox}>
                  <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                  <Text style={styles.statLbl}>{s.lbl}</Text>
                </View>
              ))}
            </View>
            <View style={styles.progressWrap}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>₹{dev.totalPaid.toLocaleString('en-IN')} paid of ₹{totalAgreed.toLocaleString('en-IN')}</Text>
                <Text style={[styles.progressPct, { color: COLORS.primary }]}>{payPct}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${payPct}%`, backgroundColor: COLORS.primary }]} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Payment History */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.sectionHeader}>💸 Payment History</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('DevPay', { devId: dev.id })}
                style={styles.payNowBtn}
              >
                <Text style={styles.payNowText}>+ Pay Now</Text>
              </TouchableOpacity>
            </View>
            {(dev.payHistory || []).map((p, i) => (
              <TouchableOpacity
                key={p.id || i}
                style={[styles.histRow, i === (dev.payHistory.length - 1) && { borderBottomWidth: 0 }]}
                onPress={() => setPayPopup({
                  label: p.label, date: p.date, method: p.method,
                  amount: `₹${p.amount.toLocaleString('en-IN')}`,
                  status: p.status, note: p.note,
                })}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.histLabel}>{p.label}</Text>
                  <Text style={styles.histMeta}>{p.date} · {p.method}</Text>
                </View>
                <Text style={[styles.histAmt, { color: p.status === 'paid' ? COLORS.primary : COLORS.danger }]}>
                  ₹{p.amount.toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Projects */}
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>💼 Projects</Text>
            {(dev.projectLinks || []).map((p, i) => {
              const cfg = PAY_STATUS_CONFIG[p.payStatus] || PAY_STATUS_CONFIG.unpaid;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.histRow, i === (dev.projectLinks.length - 1) && { borderBottomWidth: 0 }]}
                  onPress={() => navigation.navigate('ProjectDetail', { projectId: p.id })}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.histLabel}>{p.name}</Text>
                    <Text style={styles.histMeta}>{p.client} · {p.status}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={[styles.payBadge, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.payBadgeText, { color: cfg.text }]}>{cfg.label}</Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Actions */}
          <View style={styles.actionsGrid}>
            {[
              { label: '💸 Pay Now', bg: COLORS.primary, text: '#fff', onPress: () => navigation.navigate('DevPay', { devId: dev.id }) },
              { label: '💬 WhatsApp', bg: '#D1FAE5', text: '#065F46' },
              { label: '📞 Call', bg: COLORS.primaryUltraLight, text: COLORS.primary },
              { label: '🗑 Remove', bg: '#FEE2E2', text: COLORS.danger, onPress: () => setDeletePopup(true) },
            ].map((a) => (
              <TouchableOpacity key={a.label} style={[styles.actionBtn, { backgroundColor: a.bg }]} onPress={a.onPress} activeOpacity={0.8}>
                <Text style={[styles.actionText, { color: a.text }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>

      <SinglePayPopup visible={!!payPopup} data={payPopup} onClose={() => setPayPopup(null)} />
      <DeleteConfirmPopup visible={deletePopup} onClose={() => setDeletePopup(false)} type="dev" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 20 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerContent: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  devAv: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  devAvText: { fontFamily: FONTS.nunito.black, fontSize: 22, color: '#fff' },
  devName: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  devRole: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  devPhone: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  headerBtns: { flexDirection: 'row', gap: 6 },
  hdrBtn: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: 16, marginBottom: 14, ...SHADOWS.card },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionHeader: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailsLink: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: COLORS.primary },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  statBox: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
  statLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text2, marginTop: 2 },
  progressWrap: { marginTop: 10 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
  progressPct: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2 },
  progressTrack: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  payNowBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  payNowText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm, color: '#fff' },
  histRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  histLabel: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  histMeta: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  histAmt: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
  payBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  payBadgeText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
  arrow: { fontSize: SIZES.md2, color: COLORS.text3 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { flex: 1, minWidth: '45%', padding: 11, borderRadius: 12, alignItems: 'center' },
  actionText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base },
});
