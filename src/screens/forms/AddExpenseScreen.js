import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PaymentMethodPicker from '../../components/shared/PaymentMethodPicker';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

const CATEGORIES = [
  { id: 'food', icon: '🍕', label: 'Food' },
  { id: 'travel', icon: '🚌', label: 'Travel' },
  { id: 'bills', icon: '⚡', label: 'Bills' },
  { id: 'fun', icon: '🎬', label: 'Fun' },
  { id: 'shop', icon: '🛒', label: 'Shopping' },
  { id: 'health', icon: '🏥', label: 'Health' },
  { id: 'edu', icon: '📚', label: 'Education' },
  { id: 'fashion', icon: '👗', label: 'Fashion' },
  { id: 'trip', icon: '✈️', label: 'Trip' },
  { id: 'rent', icon: '🏠', label: 'Rent' },
  { id: 'medical', icon: '💊', label: 'Medical' },
  { id: 'gifts', icon: '🎁', label: 'Gifts' },
  { id: 'drinks', icon: '🍺', label: 'Drinks' },
  { id: 'fuel', icon: '⛽', label: 'Fuel' },
  { id: 'recharge', icon: '📱', label: 'Recharge' },
  { id: 'other', icon: '➕', label: 'Other' },
];

export default function AddExpenseScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('0');
  const [activeCategory, setActiveCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('22/03/2026');
  const [payMethod, setPayMethod] = useState('upi');

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientDarkGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>➕ Add Expense</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          {/* Amount Block */}
          <View style={styles.amtBlock}>
            <Text style={styles.amtLbl}>Enter Amount</Text>
            <TextInput
              style={styles.amtInput}
              value={`₹ ${amount}`}
              onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              selectTextOnFocus
            />
          </View>

          {/* Category Grid */}
          <View style={styles.card}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catOpt, activeCategory === cat.id && styles.catOptActive]}
                  onPress={() => setActiveCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={[styles.catLabel, activeCategory === cat.id && styles.catLabelActive]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="What was this for? (e.g. Domino's Pizza)"
              placeholderTextColor={COLORS.text3}
            />
            <Text style={[styles.label, { marginTop: 12 }]}>Date</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholderTextColor={COLORS.text3} />
            <Text style={[styles.label, { marginTop: 12 }]}>Paid via</Text>
            <PaymentMethodPicker
              value={payMethod}
              onChange={setPayMethod}
              options={[
                { id: 'upi', icon: '📱', label: 'UPI' },
                { id: 'cash', icon: '💵', label: 'Cash' },
                { id: 'card', icon: '💳', label: 'Card' },
              ]}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>✅ Save Expense</Text>
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
  amtBlock: {
    backgroundColor: COLORS.text, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 14,
  },
  amtLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.55)', marginBottom: 6 },
  amtInput: {
    fontFamily: FONTS.nunito.black, fontSize: 40, color: '#fff',
    letterSpacing: -2, textAlign: 'center', minWidth: 120,
  },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: 16, marginBottom: 12, ...SHADOWS.card },
  label: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm2, color: COLORS.text2, marginBottom: 8 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catOpt: {
    width: '22%', alignItems: 'center', gap: 4, padding: 10,
    borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#F9FAFB',
  },
  catOptActive: { backgroundColor: COLORS.primaryUltraLight, borderColor: COLORS.primary },
  catIcon: { fontSize: 20, lineHeight: 24 },
  catLabel: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.xs, color: COLORS.text2, textAlign: 'center' },
  catLabelActive: { color: COLORS.primary },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 9,
    fontSize: SIZES.md, fontFamily: FONTS.dmSans.regular, color: COLORS.text,
  },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: 12, alignItems: 'center', marginTop: 14 },
  submitBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
});
