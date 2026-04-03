import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FullModal } from '../../components/common';
import { AppText, Card, ProgressBar, Avatar, Button } from '../../components/ui';
import { colors, radius } from '../../theme';

function PaymentRow({ payment }) {
  const dotConfig = {
    paid:    { bg: '#D1FAE5', emoji: '✅' },
    pending: { bg: '#FEF3C7', emoji: '⏳' },
    due:     { bg: '#FEE2E2', emoji: '⏰' },
  };
  const d = dotConfig[payment.status] || dotConfig.pending;
  const amtColor = payment.status === 'paid' ? colors.primary : payment.status === 'due' ? colors.danger : colors.accent;

  return (
    <View style={styles.payRow}>
      <View style={[styles.payDot, { backgroundColor: d.bg }]}>
        <AppText style={{ fontSize: 14 }}>{d.emoji}</AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="label" color={colors.text}>{payment.label}</AppText>
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
          {payment.date}{payment.method ? ` · ${payment.method}` : ''}
        </AppText>
      </View>
      <AppText variant="h4" color={amtColor}>₹{payment.amount.toLocaleString()}</AppText>
    </View>
  );
}

function DevPayCard({ dev, onPay }) {
  const pct = dev.agreed > 0 ? (dev.paid / dev.agreed) * 100 : 100;
  const barColor = dev.status === 'paid' ? colors.primary : dev.status === 'partial' ? colors.accent : colors.danger;
  const badgeCfg = {
    paid:    { bg: '#D1FAE5', color: '#065F46', label: 'Fully Paid' },
    partial: { bg: '#FEF3C7', color: '#92400E', label: 'Partial' },
    unpaid:  { bg: '#FEE2E2', color: '#991B1B', label: 'Unpaid' },
  };
  const b = badgeCfg[dev.status] || badgeCfg.unpaid;

  return (
    <View style={styles.devCard}>
      <View style={styles.devTop}>
        <Avatar initials={dev.initials} color={dev.color} size={38} />
        <View style={{ flex: 1 }}>
          <AppText variant="label" color={colors.text}>{dev.name}</AppText>
          <AppText variant="caption" color={colors.textSecondary}>{dev.role}</AppText>
        </View>
        <View style={[styles.devBadge, { backgroundColor: b.bg }]}>
          <AppText variant="caption" color={b.color}>{b.label}</AppText>
        </View>
      </View>

      <View style={styles.devAmounts}>
        {[
          { label: 'Agreed', value: dev.agreed, color: colors.text },
          { label: 'Paid',   value: dev.paid,   color: colors.primary },
          { label: 'Left',   value: dev.agreed - dev.paid, color: colors.danger },
        ].map(({ label, value, color }) => (
          <View key={label} style={styles.devAmtBox}>
            <AppText variant="caption" color={colors.textSecondary}>{label}</AppText>
            <AppText variant="label" color={color} style={{ marginTop: 2 }}>₹{value.toLocaleString()}</AppText>
          </View>
        ))}
      </View>

      <ProgressBar progress={pct} color={barColor} style={{ marginBottom: 8 }} />

      {dev.status !== 'paid' && (
        <View style={styles.devActions}>
          <Button title={`💸 Pay ₹${(dev.agreed - dev.paid).toLocaleString()}`} variant="blue" size="sm" style={{ flex: 1 }} onPress={() => onPay(dev)} />
          <Button title="📞 Call" variant="ghost" size="sm" style={{ flex: 1 }} />
        </View>
      )}
    </View>
  );
}

export default function ProjectDetailModal({ project, visible, onClose, onPayDev }) {
  if (!project) return null;

  const progressColor =
    project.progress === 100 ? colors.primary :
    project.progress >= 60  ? colors.accent   : colors.danger;

  return (
    <FullModal
      visible={visible}
      onClose={onClose}
      title={`${project.name}${project.subtitle ? ` (${project.subtitle})` : ''}`}
      subtitle={project.client}
      gradientColors={['#1e3a5f', '#2563eb']}
    >
      {/* Summary */}
      <Card>
        <View style={styles.summaryRow}>
          {[
            { label: 'Total', value: project.price, color: colors.text },
            { label: 'Received', value: project.received, color: colors.primary },
            { label: 'Pending',  value: project.pending,  color: project.pending > 0 ? colors.danger : colors.textSecondary },
          ].map(({ label, value, color }) => (
            <View key={label} style={styles.summaryBox}>
              <AppText variant="h4" color={color}>₹{value.toLocaleString()}</AppText>
              <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>{label}</AppText>
            </View>
          ))}
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={styles.progressLabel}>
            <AppText variant="caption" color={colors.textSecondary}>
              ₹{project.received.toLocaleString()} received of ₹{project.price.toLocaleString()}
            </AppText>
            <AppText variant="labelSm" color={progressColor}>{project.progress}%</AppText>
          </View>
          <ProgressBar progress={project.progress} color={progressColor} />
        </View>
      </Card>

      {/* Client Payments */}
      <Card>
        <AppText variant="sectionHeader" color={colors.textSecondary} style={styles.cardTitle}>
          📥 Client Payments
        </AppText>
        {project.payments.map((p, i) => (
          <View key={i} style={i < project.payments.length - 1 ? styles.bordered : null}>
            <PaymentRow payment={p} />
          </View>
        ))}
      </Card>

      {/* Developers */}
      <AppText variant="sectionHeader" color={colors.textSecondary} style={[styles.cardTitle, { marginBottom: 8 }]}>
        👨‍💻 Developer Payments
      </AppText>
      {project.developers.map((dev, i) => (
        <DevPayCard
          key={dev.id + i}
          dev={dev}
          onPay={(d) => { onClose(); onPayDev?.(d, project); }}
        />
      ))}

      {/* Footer actions */}
      <View style={styles.ovActions}>
        <Button title="🧾 Invoice"     variant="accent"    size="sm" style={{ flex: 1 }} />
        <Button title="📞 Call Client" variant="secondary" size="sm" style={{ flex: 1 }} />
        <Button title="💬 WhatsApp"    variant="success"   size="sm" style={{ flex: 1 }} />
        <Button title="🗑 Delete"      variant="danger"    size="sm" style={{ flex: 1 }} />
      </View>
    </FullModal>
  );
}

const styles = StyleSheet.create({
  summaryRow:    { flexDirection: 'row', gap: 8 },
  summaryBox:    { flex: 1, backgroundColor: colors.inputBg, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle:     { marginBottom: 10 },
  bordered:      { borderBottomWidth: 1, borderBottomColor: colors.border },
  payRow:        { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  payDot:        { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  devCard:       { backgroundColor: colors.inputBg, borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1.5, borderColor: colors.border },
  devTop:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  devBadge:      { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  devAmounts:    { flexDirection: 'row', gap: 8, marginBottom: 8 },
  devAmtBox:     { flex: 1, backgroundColor: colors.white, borderRadius: 10, padding: 8, borderWidth: 1, borderColor: colors.border },
  devActions:    { flexDirection: 'row', gap: 6 },
  ovActions:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
});
