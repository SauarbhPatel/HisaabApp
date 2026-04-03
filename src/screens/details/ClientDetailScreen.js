import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SinglePayPopup from '../../components/shared/popups/SinglePayPopup';
import { DeleteConfirmPopup } from '../../components/shared/popups/ConfirmPopups';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { CLIENTS } from '../../data/mockData';

const PAY_STATUS_CONFIG = {
  'paid-full': { bg: '#D1FAE5', text: '#065F46', label: 'Paid ✅' },
  partial: { bg: '#FEF3C7', text: '#92400E', label: '⏳ Partial' },
};

export default function ClientDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { clientId } = route.params || {};
  const client = CLIENTS.find((c) => c.id === clientId) || CLIENTS[1];

  const [payPopup, setPayPopup] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);

  const payPct = client.totalBilled > 0
    ? Math.round((client.received / client.totalBilled) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientBlue}
        start={{ x: 0.13, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={[styles.clientIcon, { backgroundColor: client.iconBg }]}>
              <Text style={{ fontSize: 26 }}>{client.icon}</Text>
            </View>
            <View>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientContact}>Contact: {client.contact} · {client.phone}</Text>
              <Text style={styles.clientIndustry}>{client.industry}</Text>
            </View>
          </View>
          <View style={styles.headerBtns}>
            <TouchableOpacity onPress={() => navigation.navigate('EditClient', { clientId: client.id })} style={styles.hdrBtn}><Text>✏️</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ClientStatus', { clientId: client.id })} style={styles.hdrBtn}><Text>🔄</Text></TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {/* Payment Summary */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddClientPay', { clientId: client.id })} activeOpacity={0.85}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.sectionHeader}>💰 Payment Summary</Text>
              <Text style={styles.detailsLink}>Details 🔗</Text>
            </View>
            <View style={styles.statsRow}>
              {[
                { val: `₹${client.totalBilled.toLocaleString('en-IN')}`, lbl: 'Total Billed', color: COLORS.text },
                { val: `₹${client.received.toLocaleString('en-IN')}`, lbl: 'Received', color: COLORS.primary },
                { val: `₹${client.pending.toLocaleString('en-IN')}`, lbl: 'Pending', color: client.pending > 0 ? COLORS.danger : COLORS.text2 },
              ].map((s) => (
                <View key={s.lbl} style={styles.statBox}>
                  <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                  <Text style={styles.statLbl}>{s.lbl}</Text>
                </View>
              ))}
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${payPct}%`, backgroundColor: '#2563eb' }]} />
            </View>
            <Text style={styles.progressNote}>₹{client.received.toLocaleString('en-IN')} received of ₹{client.totalBilled.toLocaleString('en-IN')} ({payPct}%)</Text>
          </TouchableOpacity>

          {/* Payment History */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.sectionHeader}>📥 Payment History</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddClientPay', { clientId: client.id })} style={styles.recordBtn}>
                <Text style={styles.recordBtnText}>+ Record</Text>
              </TouchableOpacity>
            </View>
            {(client.payHistory || []).map((p, i) => (
              <TouchableOpacity
                key={p.id || i}
                style={[styles.histRow, i === (client.payHistory.length - 1) && { borderBottomWidth: 0 }]}
                onPress={() => setPayPopup({ label: p.label, date: p.date, method: p.method, amount: `₹${p.amount.toLocaleString('en-IN')}`, status: p.status, note: p.note })}
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
            {(client.projectLinks || []).map((p, i) => {
              const cfg = PAY_STATUS_CONFIG[p.payStatus] || { bg: '#FEF3C7', text: '#92400E', label: p.pendingAmt || '⏳ Partial' };
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.histRow, i === (client.projectLinks.length - 1) && { borderBottomWidth: 0 }]}
                  onPress={() => navigation.navigate('ProjectDetail', { projectId: p.id })}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.histLabel}>{p.name}</Text>
                    <Text style={styles.histMeta}>{p.startDate} · {p.status} · ₹{p.price.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={[styles.projBadge, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.projBadgeText, { color: cfg.text }]}>{p.pendingAmt || cfg.label}</Text>
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
              { label: '📥 Record Payment', bg: COLORS.primary, text: '#fff', onPress: () => navigation.navigate('AddClientPay', { clientId: client.id }) },
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
      <DeleteConfirmPopup visible={deletePopup} onClose={() => setDeletePopup(false)} type="client" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 20 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerContent: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  clientIcon: { width: 54, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  clientName: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  clientContact: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  clientIndustry: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  headerBtns: { flexDirection: 'row', gap: 6 },
  hdrBtn: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: 16, marginBottom: 14, ...SHADOWS.card },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionHeader: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailsLink: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: '#2563eb' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  statBox: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
  statLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text2, marginTop: 2 },
  progressTrack: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 99, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 99 },
  progressNote: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
  recordBtn: { backgroundColor: '#2563eb', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  recordBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm, color: '#fff' },
  histRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  histLabel: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  histMeta: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  histAmt: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2 },
  projBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  projBadgeText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
  arrow: { fontSize: SIZES.md2, color: COLORS.text3 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { flex: 1, minWidth: '45%', padding: 11, borderRadius: 12, alignItems: 'center' },
  actionText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base },
});
