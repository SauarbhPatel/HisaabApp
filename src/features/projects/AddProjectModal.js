import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Text } from 'react-native';
import { FullModal } from '../../components/common';
import { Card, FormInput, Button, AppText } from '../../components/ui';
import { colors, radius } from '../../theme';

const PROJECT_TYPES = ['Development', 'UI/UX Design', 'Deployment', 'Maintenance', 'Mobile App', 'Web App'];
const CLIENTS      = ['Maksoft', 'Flatshare', 'School ERP', 'New Client'];
const DEV_ROLES    = ['Frontend', 'Backend', 'Full Stack', 'UI/UX', 'DevOps', 'Mobile'];

function ChipRow({ options, active, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
      <View style={styles.chipRow}>
        {options.map(o => (
          <TouchableOpacity
            key={o}
            style={[styles.chip, active === o && styles.chipActive]}
            onPress={() => onSelect(o)}
          >
            <Text style={[styles.chipText, active === o && { color: '#fff' }]}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default function AddProjectModal({ visible, onClose }) {
  const [type, setType]     = useState('Development');
  const [client, setClient] = useState('');
  const [role, setRole]     = useState('Frontend');

  return (
    <FullModal
      visible={visible}
      onClose={onClose}
      title="➕ New Project"
      gradientColors={['#1e3a5f', '#2563eb']}
    >
      <Card>
        <FormInput label="Project Name"      placeholder="e.g. School ERP v2" />
        <FormInput label="Project Price (₹)" placeholder="e.g. 15,000" keyboardType="numeric" />

        <AppText variant="bodyMd" color={colors.textSecondary} style={styles.fieldLabel}>Project Type</AppText>
        <ChipRow options={PROJECT_TYPES} active={type} onSelect={setType} />

        <FormInput label="Client / Company" placeholder="e.g. Maksoft" style={{ marginTop: 12 }} />
        <ChipRow options={CLIENTS} active={client} onSelect={setClient} />

        <View style={[styles.row, { marginTop: 12 }]}>
          <FormInput label="Start Date" placeholder="01/04/2026" style={{ flex: 1 }} />
          <FormInput label="End Date"   placeholder="Optional"   style={{ flex: 1 }} />
        </View>
      </Card>

      <Card>
        <AppText variant="h4" color={colors.text} style={{ marginBottom: 10 }}>👨‍💻 Add Developer</AppText>
        <AppText variant="bodySm" color={colors.textSecondary} style={{ marginBottom: 12 }}>
          You can add more developers later from the project detail.
        </AppText>

        <View style={styles.devSlot}>
          <View style={styles.row}>
            <FormInput label="Developer Name" placeholder="e.g. Zafran" style={{ flex: 2 }} />
            <FormInput label="Payment ₹"      placeholder="Agreed amt"  style={{ flex: 1 }} keyboardType="numeric" />
          </View>
          <AppText variant="bodyMd" color={colors.textSecondary} style={styles.fieldLabel}>Role</AppText>
          <ChipRow options={DEV_ROLES} active={role} onSelect={setRole} />
        </View>
      </Card>

      <View style={styles.footerBtns}>
        <Button title="Skip"                variant="ghost"   size="lg" style={{ flex: 1 }} onPress={onClose} />
        <Button title="✅ Create Project"   variant="primary" size="lg" style={{ flex: 2 }} onPress={onClose} />
      </View>
    </FullModal>
  );
}

const styles = StyleSheet.create({
  row:        { flexDirection: 'row', gap: 8 },
  fieldLabel: { marginBottom: 2 },
  chipRow:    { flexDirection: 'row', gap: 6, paddingBottom: 2 },
  chip:       { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: '#fff' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText:   { fontFamily: 'Nunito_700Bold', fontSize: 11, color: colors.textSecondary },
  devSlot:    { backgroundColor: colors.inputBg, borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: colors.border },
  footerBtns: { flexDirection: 'row', gap: 10 },
});
