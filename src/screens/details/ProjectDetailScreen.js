import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SinglePayPopup from '../../components/shared/popups/SinglePayPopup';
import { DeleteConfirmPopup, PauseDevPopup, ResumeDevPopup } from '../../components/shared/popups/ConfirmPopups';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { PROJECTS } from '../../data/mockData';

export default function ProjectDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { projectId } = route.params || {};
  const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[1];

  const [payPopup, setPayPopup] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [pausePopup, setPausePopup] = useState(null);
  const [resumePopup, setResumePopup] = useState(null);

  const STATUS_CONFIG = {
    completed: { label: '✅ Completed', bg: '#D1FAE5', text: '#065F46' },
    active: { label: '🔵 Active', bg: '#DBEAFE', text: '#1D4ED8' },
    pending: { label: '⏳ In Progress', bg: '#FEF3C7', text: '#92400E' },
    partial: { label: '⚠️ Partial Pay', bg: '#FEE2E2', text: '#991B1B' },
  };
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={COLORS.gradientBlue} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerCompany}>{project.client}</Text>
            <Text style={styles.headerName}>{project.name}{project.subtitle ? ` ${project.subtitle}` : ''}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProject', { projectId: project.id })}
              style={styles.iconBtn}><Text>✏️</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Status', { projectId: project.id })}
              style={styles.iconBtn}><Text>🔄</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerPills}>
          <View style={[styles.pill, { backgroundColor: status.bg }]}>
            <Text style={[styles.pillText, { color: status.text }]}>{status.label}</Text>
          </View>
          <View style={styles.pill2}><Text style={styles.pill2Text}>📅 {project.startDate}</Text></View>
          <View style={styles.pill2}><Text style={styles.pill2Text}>{project.client}</Text></View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {/* Payment Summary */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.sectionHeader}>💰 Payment Summary</Text>
              <Text style={styles.clientLabel}>Client: {project.client}</Text>
            </View>
            <View style={styles.finRow}>
              {[
                { lbl: 'Total', val: `₹${project.price.toLocaleString('en-IN')}`, color: COLORS.text },
                { lbl: 'Received', val: `₹${project.received.toLocaleString('en-IN')}`, color: COLORS.primary },
                { lbl: 'Pending', val: `₹${project.pending.toLocaleString('en-IN')}`, color: project.pending > 0 ? COLORS.danger : COLORS.text2 },
              ].map((f) => (
                <View key={f.lbl} style={styles.finItem}>
                  <Text style={[styles.finVal, { color: f.color }]}>{f.val}</Text>
                  <Text style={styles.finLbl}>{f.lbl}</Text>
                </View>
              ))}
            </View>
            <View style={styles.progressWrap}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>₹{project.received.toLocaleString('en-IN')} received of ₹{project.price.toLocaleString('en-IN')}</Text>
                <Text style={[styles.progressPct, { color: project.progressColor }]}>{project.progressPct}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${project.progressPct}%`, backgroundColor: project.progressColor }]} />
              </View>
            </View>
          </View>

          {/* Client Payments */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.sectionHeader}>📥 Client Payments</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddClientPay', { projectId: project.id })}
                style={styles.recordBtn}><Text style={styles.recordBtnText}>+ Record</Text></TouchableOpacity>
            </View>
            {project.payments.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.payRow}
                onPress={() => setPayPopup({ label: p.label, date: p.date, method: p.method, amount: `₹${p.amount.toLocaleString('en-IN')}`, status: p.status, note: p.note })}
                activeOpacity={0.8}
              >
                <View style={[styles.payDot, { backgroundColor: p.status === 'paid' ? '#D1FAE5' : '#FEF3C7' }]}>
                  <Text style={{ fontSize: 14 }}>{p.status === 'paid' ? '✅' : '⏳'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.payLabel}>{p.label}</Text>
                  <Text style={styles.payDate}>{p.date} · {p.method}</Text>
                </View>
                <Text style={[styles.payAmt, { color: p.status === 'paid' ? COLORS.primary : COLORS.accent }]}>
                  ₹{p.amount.toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Developer Payments */}
          <View style={styles.cardTitleRow}>
            <Text style={styles.sectionHeader}>👨‍💻 Developer Payments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddDevToProject', { projectId: project.id })}
              style={[styles.recordBtn, { backgroundColor: COLORS.primary }]}>
              <Text style={[styles.recordBtnText, { color: '#fff' }]}>+ Add Dev</Text>
            </TouchableOpacity>
          </View>

          {project.developers.map((dev) => {
            const payPct = dev.agreed > 0 ? Math.round((dev.paid / dev.agreed) * 100) : 0;
            const isActive = dev.active !== false;
            return (
              <View key={dev.id} style={[styles.devCard, !isActive && styles.devCardInactive]}>
                <View style={styles.devCardTop}>
                  <View style={[styles.devAv, { backgroundColor: isActive ? dev.color : '#9CA3AF' }]}>
                    <Text style={styles.devAvText}>{dev.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.devName, !isActive && { color: COLORS.text2 }]}>{dev.name}</Text>
                    <Text style={styles.devRole}>
                      {dev.role} ·{' '}
                      <Text style={{ color: isActive ? COLORS.primary : '#9CA3AF' }}>
                        {isActive ? '● Active' : '⏸ Paused'}
                      </Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('DevPaymentPage', { devId: dev.id, projectId: project.id })}
                    style={[styles.devStatusBadge, {
                      backgroundColor: dev.payStatus === 'paid-full' ? '#D1FAE5' : dev.payStatus === 'paid-partial' ? '#FEF3C7' : '#FEE2E2',
                    }]}>
                    <Text style={[styles.devStatusText, {
                      color: dev.payStatus === 'paid-full' ? '#065F46' : dev.payStatus === 'paid-partial' ? '#92400E' : '#991B1B',
                    }]}>
                      {dev.payStatus === 'paid-full' ? 'Paid ✅' : dev.payStatus === 'paid-partial' ? 'Partial 🔗' : 'Unpaid 🔗'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.devAmounts}>
                  {[
                    { lbl: 'Total Agreed', val: `₹${dev.agreed.toLocaleString('en-IN')}` },
                    { lbl: 'Paid', val: `₹${dev.paid.toLocaleString('en-IN')}`, color: COLORS.primary },
                    { lbl: 'Remaining', val: `₹${dev.remaining.toLocaleString('en-IN')}`, color: dev.remaining > 0 ? COLORS.danger : COLORS.text2 },
                  ].map((a) => (
                    <View key={a.lbl} style={styles.devAmtBox}>
                      <Text style={styles.devAmtLbl}>{a.lbl}</Text>
                      <Text style={[styles.devAmtVal, a.color ? { color: a.color } : {}]}>{a.val}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.devProgressTrack}>
                  <View style={[styles.devProgressFill, {
                    width: `${payPct}%`,
                    backgroundColor: dev.payStatus === 'paid-full' ? COLORS.primary : dev.payStatus === 'paid-partial' ? COLORS.accent : COLORS.danger,
                  }]} />
                </View>
                <View style={styles.devActions}>
                  {isActive ? (
                    <>
                      <TouchableOpacity style={[styles.devActionBtn, { backgroundColor: '#DBEAFE' }]}
                        onPress={() => navigation.navigate('DevPay', { devId: dev.id, projectId: project.id })}>
                        <Text style={[styles.devActionText, { color: '#1D4ED8' }]}>💸 Pay</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.devActionBtn, { backgroundColor: COLORS.primaryUltraLight }]}
                        onPress={() => navigation.navigate('DevPaymentPage', { devId: dev.id, projectId: project.id })}>
                        <Text style={[styles.devActionText, { color: COLORS.primary }]}>🔗 Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.devActionBtn, { backgroundColor: '#F3F4F6' }]}
                        onPress={() => navigation.navigate('EditDev', { devId: dev.id })}>
                        <Text style={[styles.devActionText, { color: COLORS.text2 }]}>✏️ Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.devActionBtn, { backgroundColor: '#FEF3C7' }]}
                        onPress={() => setPausePopup(dev.name)}>
                        <Text style={[styles.devActionText, { color: '#92400E' }]}>⏸ Pause</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.devActionBtn, { backgroundColor: '#D1FAE5' }]}
                        onPress={() => setResumePopup(dev.name)}>
                        <Text style={[styles.devActionText, { color: '#065F46' }]}>▶ Resume</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.devActionBtn, { backgroundColor: '#F3F4F6' }]}>
                        <Text style={[styles.devActionText, { color: COLORS.text2 }]}>📞 Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.devActionBtn, { backgroundColor: '#FEE2E2' }]}
                        onPress={() => setDeletePopup(true)}>
                        <Text style={[styles.devActionText, { color: COLORS.danger }]}>🗑 Remove</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })}

          {/* Bottom actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={[styles.bottomBtn, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.bottomBtnText, { color: '#92400E' }]}>🧾 Send Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bottomBtn, { backgroundColor: COLORS.primaryUltraLight }]}>
              <Text style={[styles.bottomBtnText, { color: COLORS.primary }]}>📞 Call Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bottomBtn, { backgroundColor: '#D1FAE5' }]}>
              <Text style={[styles.bottomBtnText, { color: '#065F46' }]}>💬 WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bottomBtn, { backgroundColor: '#FEE2E2' }]}
              onPress={() => setDeletePopup(true)}>
              <Text style={[styles.bottomBtnText, { color: COLORS.danger }]}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>

      <SinglePayPopup visible={!!payPopup} data={payPopup} onClose={() => setPayPopup(null)} />
      <DeleteConfirmPopup visible={deletePopup} onClose={() => setDeletePopup(false)} type="project" />
      <PauseDevPopup visible={!!pausePopup} onClose={() => setPausePopup(null)} devName={pausePopup} />
      <ResumeDevPopup visible={!!resumePopup} onClose={() => setResumePopup(null)} devName={resumePopup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 18 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerContent: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  headerCompany: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  headerName: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  headerPills: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  pillText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base },
  pill2: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  pill2Text: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: '#fff' },
  body: { padding: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: 16, marginBottom: 14, ...SHADOWS.card },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionHeader: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5 },
  clientLabel: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: '#2563eb' },
  finRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  finItem: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  finVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2 },
  finLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text2, marginTop: 2 },
  progressWrap: { marginTop: 10 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
  progressPct: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2 },
  progressTrack: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  recordBtn: { backgroundColor: '#2563eb', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  recordBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm, color: '#fff' },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  payDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  payLabel: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  payDate: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
  payAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2 },
  devCard: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1.5, borderColor: COLORS.border },
  devCardInactive: { opacity: 0.65 },
  devCardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  devAv: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  devAvText: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md, color: '#fff' },
  devName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  devRole: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
  devStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  devStatusText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
  devAmounts: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  devAmtBox: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 8, borderWidth: 1, borderColor: COLORS.border },
  devAmtLbl: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm, color: COLORS.text2 },
  devAmtVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2, color: COLORS.text, marginTop: 2 },
  devProgressTrack: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 99, overflow: 'hidden', marginBottom: 8 },
  devProgressFill: { height: '100%', borderRadius: 99 },
  devActions: { flexDirection: 'row', gap: 6 },
  devActionBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: 'center' },
  devActionText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm },
  bottomActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  bottomBtn: { flex: 1, minWidth: '45%', padding: 11, borderRadius: 12, alignItems: 'center' },
  bottomBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base },
});
