import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FullModal, PaymentMethodPicker } from '../../components/common';
import { Card, FormInput, Button } from '../../components/ui';
import { colors } from '../../theme';

export default function SettleModal({ visible, onClose, friend }) {
  const [method, setMethod] = useState('upi');

  return (
    <FullModal
      visible={visible}
      onClose={onClose}
      title="💰 Settle Up"
      gradientColors={[colors.primary, colors.primaryLight]}
    >
      <Card>
        <FormInput label="Paying To" value={friend ? `${friend.name} · ₹${Math.abs(friend.balance).toLocaleString()} pending` : ''} />
        <FormInput label="Amount"    value={friend ? `₹${Math.abs(friend.balance).toLocaleString()}` : ''} keyboardType="numeric" />

        <FormInput label="Date"      value="22/03/2026" />

        <PaymentMethodPicker value={method} onChange={setMethod} />

        <Button title="✅ Confirm Settlement" onPress={onClose} size="lg" style={{ marginTop: 12 }} />
      </Card>
    </FullModal>
  );
}
