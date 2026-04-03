import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText, ProgressBar, Button } from '../../components/ui';
import { StatusPill } from '../../components/common';
import { Avatar } from '../../components/ui';
import { colors, radius, shadows } from '../../theme';

function DevPill({ dev, onPress }) {
  const cfg = {
    paid:    { bg: '#D1FAE5', color: '#065F46' },
    partial: { bg: '#FEF3C7', color: '#92400E' },
    unpaid:  { bg: '#FEE2E2', color: '#991B1B' },
  };
  const c = cfg[dev.status] || cfg.unpaid;
  const remaining = dev.agreed - dev.paid;
  const label = dev.status === 'paid'
    ? `${dev.name} · Paid ✅`
    : `${dev.name} · ₹${dev.paid.toLocaleString()}/₹${dev.agreed.toLocaleString()}`;

  return (
    <TouchableOpacity
      style={[styles.devPill, { backgroundColor: c.bg }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.devAv, { backgroundColor: dev.color }]}>
        <AppText style={styles.devAvText}>{dev.initials}</AppText>
      </View>
      <AppText variant="labelSm" color={c.color}>{label}</AppText>
    </TouchableOpacity>
  );
}

function FinStat({ label, value, valueColor }) {
  return (
    <View style={styles.finItem}>
      <AppText variant="caption" color={colors.textSecondary}>{label}</AppText>
      <AppText variant="label" color={valueColor || colors.text} style={{ marginTop: 2 }}>
        {value}
      </AppText>
    </View>
  );
}

export default function ProjectCard({ project, onPress, onPayDev }) {
  const progressColor =
    project.progress === 100 ? colors.primary :
    project.progress >= 60  ? colors.accent   : colors.danger;

  const unpaidDevs = project.developers.filter(d => d.status !== 'paid');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.clientBadge, { backgroundColor: project.clientBg }]}>
          <AppText variant="labelSm" color={project.clientColor}>{project.client}</AppText>
        </View>
        <StatusPill status={project.status} />
      </View>

      <AppText variant="h4" color={colors.text} style={styles.projName}>
        {project.name}
        {project.subtitle
          ? <AppText variant="body" color={colors.textSecondary}> ({project.subtitle})</AppText>
          : null}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary} style={{ marginBottom: 10 }}>
        {project.startDate}{project.endDate ? ` → ${project.endDate}` : ' → Ongoing'}
      </AppText>

      {/* Progress */}
      <View style={styles.progressHeader}>
        <AppText variant="caption" color={colors.textSecondary}>Payment received</AppText>
        <AppText variant="labelSm" color={progressColor}>{project.progress}%</AppText>
      </View>
      <ProgressBar progress={project.progress} color={progressColor} style={{ marginBottom: 10 }} />

      {/* Financials */}
      <View style={styles.finRow}>
        <FinStat label="Project Price" value={`₹${project.price.toLocaleString()}`} />
        <FinStat label="Received"      value={`₹${project.received.toLocaleString()}`} valueColor={colors.primary} />
        <FinStat label="Pending"       value={`₹${project.pending.toLocaleString()}`} valueColor={project.pending > 0 ? colors.danger : colors.textSecondary} />
      </View>

      {/* Developers */}
      <AppText variant="caption" color={colors.textSecondary} style={styles.devLabel}>Developers</AppText>
      <View style={styles.devsRow}>
        {project.developers.map(dev => (
          <DevPill
            key={dev.id + dev.name}
            dev={dev}
            onPress={() => dev.status !== 'paid' && onPayDev?.(dev, project)}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button title="👁 Details"    variant="secondary" size="sm" style={{ flex: 1 }} onPress={onPress} />
        {unpaidDevs.length > 0 &&
          <Button title="💸 Pay Dev"  variant="blue"      size="sm" style={{ flex: 1 }} onPress={() => onPayDev?.(null, project)} />}
        <Button title="🧾 Invoice"    variant="accent"    size="sm" style={{ flex: 1 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    ...shadows.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  clientBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  projName: { marginBottom: 2 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  finRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  finItem: { flex: 1, backgroundColor: colors.inputBg, borderRadius: 10, padding: 8 },
  devLabel: { marginBottom: 6 },
  devsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  devPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full },
  devAv: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  devAvText: { fontSize: 8, color: '#fff', fontFamily: 'Nunito_800ExtraBold' },
  actions: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
});
