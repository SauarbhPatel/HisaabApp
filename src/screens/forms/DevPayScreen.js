import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PaymentMethodPicker from '../../components/shared/PaymentMethodPicker';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

export default function DevPayScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [project, setProject] = useState('Flatshare Karo (Development)');
  const [dev, setDev] = useState('Zafran — ₹3,000 remaining');
  const [amount, setAmount] = useState('3000');
  const [date, setDate] = useState('21/03/2026');
  const [payMethod, setPayMethod] = useState('upi');
  const [note, setNote] = useState('');

  const PROJECTS_OPTS = ['Flatshare Karo (Development)', 'School ERP (March)', 'Flatshare Karo (UI Update)'];
  const DEV_OPTS = ['Zafran — ₹3,000 remaining', 'Amit — ₹3,000 remaining', 'Neha — ₹1,000 remaining'];

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientAmber} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💸 Pay Developer</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.label}>Project</Text>
            <View style={styles.picker}>
              {PROJECTS_OPTS.map((opt) => (
                <TouchableOpacity key={opt} onPress={() => setProject(opt)}
                  style={[styles.pickerOpt, project === opt && styles.pickerOptActive]}>
                  <Text style={[styles.pickerOptText, project === opt && styles.pickerOptTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 14 }]}>Developer</Text>
            <View style={styles.picker}>
              {DEV_OPTS.map((opt) => (
                <TouchableOpacity key={opt} onPress={() => setDev(opt)}
                  style={[styles.pickerOpt, dev === opt && styles.pickerOptActive]}>
                  <Text style={[styles.pickerOptText, dev === opt && styles.pickerOptTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.twoCol}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { marginTop: 14 }]}>Amount (₹)</Text>
                <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholderTextColor={COLORS.text3} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { marginTop: 14 }]}>Date</Text>
                <TextInput style={styles.input} value={date} onChangeText={setDate} placeholderTextColor={COLORS.text3} />
              </View>
            </View>

            <Text style={[styles.label, { marginTop: 14 }]}>Payment Method</Text>
            <PaymentMethodPicker value={payMethod} onChange={setPayMethod} />

            <Text style={[styles.label, { marginTop: 14 }]}>Note (optional)</Text>
            <TextInput
              style={styles.input} value={note} onChangeText={setNote}
              placeholder="e.g. Milestone 2 payment" placeholderTextColor={COLORS.text3}
            />

            {/* Summary preview */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>After this payment</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total paid to Zafran</Text>
                <Text style={styles.summaryVal}>₹7,000 / ₹7,000</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Status</Text>
                <Text style={[styles.summaryVal, { color: COLORS.primary }]}>✅ Fully Settled</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>✅ Record Payment</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 18 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
  body: { padding: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: 16, ...SHADOWS.card },
  label: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm2, color: COLORS.text2, marginBottom: 6 },
  picker: { gap: 6 },
  pickerOpt: {
    padding: 10, borderRadius: RADIUS.md, borderWidth: 1.5,
    borderColor: COLORS.border, backgroundColor: '#F9FAFB',
  },
  pickerOptActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryUltraLight },
  pickerOptText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  pickerOptTextActive: { color: COLORS.text, fontFamily: FONTS.dmSans.semiBold },
  twoCol: { flexDirection: 'row', gap: 8 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 9,
    fontSize: SIZES.md, fontFamily: FONTS.dmSans.regular, color: COLORS.text,
  },
  summaryBox: { backgroundColor: COLORS.primaryUltraLight, borderRadius: 12, padding: 12, marginTop: 14, marginBottom: 4 },
  summaryTitle: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: COLORS.primary, marginBottom: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2 },
  summaryVal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base, color: COLORS.text },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: 12, alignItems: 'center', marginTop: 8 },
  submitBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
});
