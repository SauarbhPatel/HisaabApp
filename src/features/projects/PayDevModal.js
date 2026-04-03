import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FullModal, PaymentMethodPicker } from '../../components/common';
import { Card, FormInput, Button, AppText } from '../../components/ui';
import { colors } from '../../theme';

export default function PayDevModal({ visible, onClose, project, dev }) {
  const [method, setMethod] = useState('upi');

  const remaining = dev ? dev.agreed - dev.paid : 0;

  return (
    <FullModal
      visible={visible}
      onClose={onClose}
      title="💸 Pay Developer"
      gradientColors={[colors.primary, colors.primaryLight]}
    >
      <Card>
        {project && (
          <View style={styles.projectBanner}>
            <AppText variant="caption" color="rgba(255,255,255,0.8)">Project</AppText>
            <AppText variant="label" color="#fff">{project.name}{project.subtitle ? ` (${project.subtitle})` : ''}</AppText>
          </View>
        )}

        <FormInput label="Developer" value={dev ? `${dev.name} · ₹${remaining.toLocaleString()} remaining` : ''} />
        <View style={styles.row}>
          <FormInput label="Amount" value={dev ? `₹${remaining.toLocaleString()}` : ''} style={{ flex: 1 }} />
          <FormInput label="Date"   value="21/03/2026" style={{ flex: 1 }} />
        </View>

        <AppText variant="bodyMd" color={colors.textSecondary} style={styles.methodLabel}>Payment Method</AppText>
        <PaymentMethodPicker value={method} onChange={setMethod} />

        <FormInput label="Note (optional)" placeholder="e.g. Milestone 2 payment" style={{ marginTop: 10 }} />

        {dev && (
          <View style={styles.summary}>
            <AppText variant="labelSm" color={colors.primary} style={{ marginBottom: 6 }}>After this payment</AppText>
            <View style={styles.summaryRow}>
              <AppText variant="bodySm" color={colors.textSecondary}>Total paid to {dev.name}</AppText>
              <AppText variant="label" color={colors.text}>₹{dev.agreed.toLocaleString()} / ₹{dev.agreed.toLocaleString()}</AppText>
            </View>
            <View style={styles.summaryRow}>
              <AppText variant="bodySm" color={colors.textSecondary}>Status</AppText>
              <AppText variant="labelSm" color={colors.primary}>✅ Fully Settled</AppText>
            </View>
          </View>
        )}

        <Button title="✅ Record Payment" onPress={onClose} size="lg" style={{ marginTop: 6 }} />
      </Card>
    </FullModal>
  );
}

const styles = StyleSheet.create({
  projectBanner: {
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  row: { flexDirection: 'row', gap: 8 },
  methodLabel: { marginBottom: 6 },
  summary: {
    backgroundColor: colors.primaryUltraLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    gap: 6,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
