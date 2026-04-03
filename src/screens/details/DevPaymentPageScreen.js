import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SinglePayPopup from '../../components/shared/popups/SinglePayPopup';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { DEVELOPERS, PROJECTS } from '../../data/mockData';

export default function DevPaymentPageScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { devId, projectId } = route.params || {};
  const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[1];
  const devInProject = project.developers?.find((d) => d.id === devId) || project.developers?.[0];
  const devGlobal = DEVELOPERS.find((d) => d.id === devId) || DEVELOPERS[0];
  const dev = devInProject || devGlobal;

  const [payPopup, setPayPopup] = useState(null);

  const payHistory = devInProject?.payHistory || devGlobal?.payHistory || [];
  const agreed = devInProject?.agreed || 7000;
  const paid = devInProject?.paid || 4000;
  const remaining = devInProject?.remaining || 3000;
  const payPct = agreed > 0 ? Math.round((paid / agreed) * 100) : 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientAmber} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.devAv, { backgroundColor: dev.color || '#ba7517' }]}>
            <Text style={styles.devAvText}>{dev.initials || 'ZF'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.devName}>{dev.name || 'Zafran'}</Text>
            <Text style={styles.devRole}>{dev.role || 'Frontend Developer'} · {project.name}</Text>
          </View>
        </View>
        <View style={styles.balanceSummary}>
          {[
            { val: `₹${agreed.toLocaleString('en-IN')}`, lbl: 'Total Agreed' },
            { val: `₹${paid.toLocaleString('en-IN')}`, lbl: 'Paid', col: '#A7F3D0' },
            { val: `₹${remaining.toLocaleString('en-IN')}`, lbl: 'Remaining', col: '#FCA5A5' },
          ].map((s, i) => (
            <React.Fragment key={s.lbl}>
              {i > 0 && <View style={styles.vDivider} />}
              <View style={styles.balItem}>
                <Text style={[styles.balVal, s.col ? { color: s.col } : {}]}>{s.val}</Text>
                <Text style={styles.balLbl}>{s.lbl}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${payPct}%` }]} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <Text style={styles.historyLabel}>Payment History</Text>
          {payHistory.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No payments recorded yet</Text>
            </View>
          )}
          {payHistory.map((p, i) => (
            <View key={i} style={styles.payCard}>
              <View style={[styles.payIcon, { backgroundColor: p.status === 'paid' ? '#D1FAE5' : '#FEF3C7' }]}>
                <Text style={{ fontSize: 16 }}>{p.status === 'paid' ? '✅' : '⏳'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.payLabel}>{p.label}</Text>
                <Text style={styles.payMeta}>{p.date} · {p.method === 'UPI' ? '📱 UPI' : p.method === 'Cash' ? '💵 Cash' : p.method}</Text>
              </View>
              <Text style={[styles.payAmt, { color: p.status === 'paid' ? COLORS.primary : COLORS.accent }]}>
                ₹{p.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.payNowBtn}
          onPress={() => navigation.navigate('DevPay', { devId: dev.id || devId, projectId })}>
          <Text style={styles.payNowText}>💸 Pay ₹{remaining.toLocaleString('en-IN')} Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBtn}>
          <Text style={styles.callBtnText}>📞 Call</Text>
        </TouchableOpacity>
      </View>

      <SinglePayPopup visible={!!payPopup} data={payPopup} onClose={() => setPayPopup(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 20 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  devAv: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  devAvText: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  devName: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  devRole: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  balanceSummary: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 14, padding: 12, marginTop: 14,
  },
  vDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  balItem: { flex: 1, alignItems: 'center' },
  balVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
  balLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden', marginTop: 10 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 99 },
  scroll: { flex: 1 },
  body: { padding: 14 },
  historyLabel: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  emptyCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 20, alignItems: 'center', ...SHADOWS.card },
  emptyText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  payCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOWS.card },
  payIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  payLabel: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  payMeta: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  payAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2 },
  stickyBottom: {
    backgroundColor: '#fff', borderTopWidth: 1.5, borderTopColor: COLORS.border,
    padding: 12, flexDirection: 'row', gap: 10,
  },
  payNowBtn: { flex: 1, padding: 13, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center' },
  payNowText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: '#fff' },
  callBtn: { padding: 13, paddingHorizontal: 16, borderRadius: 14, backgroundColor: '#F3F4F6', alignItems: 'center' },
  callBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text2 },
});
