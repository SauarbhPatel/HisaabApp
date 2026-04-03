import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuggestionChipRow } from '../../components/shared/SuggestionChip';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

const TYPE_CHIPS = ['💻 Development', '🎨 UI/UX Design', '🚀 Deployment', '🔧 Maintenance', '📱 Mobile App', '🌐 Web App', '🔗 API'];
const CLIENT_CHIPS = ['Maksoft Technologies', 'Flatshare Karo', 'School ERP Client', '➕ New Client'];
const DEV_NAME_CHIPS = ['Zafran', 'Amit Sharma', 'Neha Verma', 'Sneha Kulkarni', '➕ New Developer'];
const DEV_ROLE_CHIPS = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'UI/UX Designer', 'DevOps', 'QA Tester'];

function FormRow({ label, children }) {
  return (
    <View style={styles.formRow}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function StyledInput({ value, onChangeText, placeholder, keyboardType }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.text3}
      keyboardType={keyboardType}
    />
  );
}

export default function AddProjectScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [client, setClient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [devSlots, setDevSlots] = useState([{ id: 0, name: '', role: '', pay: '' }]);

  const addDevSlot = () => setDevSlots(s => [...s, { id: Date.now(), name: '', role: '', pay: '' }]);
  const removeDevSlot = (id) => {
    if (devSlots.length > 1) setDevSlots(s => s.filter(d => d.id !== id));
  };
  const updateSlot = (id, field, val) =>
    setDevSlots(s => s.map(d => d.id === id ? { ...d, [field]: val } : d));

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientBlue} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={step === 1 ? () => navigation.goBack() : () => setStep(1)} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>{step === 1 ? '➕ New Project' : '👨‍💻 Add Developers'}</Text>
          <View style={styles.stepBadge}><Text style={styles.stepText}>Step {step} of 2</Text></View>
        </View>
        <View style={styles.progressDots}>
          <View style={styles.progressFilled} />
          <View style={[styles.progressDot, step === 2 && styles.progressFilled]} />
        </View>
        <View style={styles.stepLabels}>
          <Text style={styles.stepLabelText}>Project Details{step > 1 ? ' ✓' : ''}</Text>
          <Text style={styles.stepLabelText}>Add Developers</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          {step === 1 && (
            <View style={styles.card}>
              <FormRow label="Project Name">
                <StyledInput value={name} onChangeText={setName} placeholder="e.g. School ERP v2" />
              </FormRow>
              <FormRow label="Project Type">
                <StyledInput value={type} onChangeText={setType} placeholder="e.g. Development, UI/UX..." />
                <SuggestionChipRow chips={TYPE_CHIPS} onSelect={(v) => setType(v.replace(/^[^\s]+\s/, ''))} small />
              </FormRow>
              <FormRow label="Client / Company">
                <StyledInput value={client} onChangeText={setClient} placeholder="e.g. Maksoft, Flatshare..." />
                <SuggestionChipRow chips={CLIENT_CHIPS} onSelect={setClient} small />
              </FormRow>
              <View style={styles.twoCol}>
                <View style={{ flex: 1 }}>
                  <FormRow label="Start Date">
                    <StyledInput value={startDate} onChangeText={setStartDate} placeholder="01/04/2026" />
                  </FormRow>
                </View>
                <View style={{ flex: 1 }}>
                  <FormRow label="End Date">
                    <StyledInput value={endDate} onChangeText={setEndDate} placeholder="Optional" />
                  </FormRow>
                </View>
              </View>
              <FormRow label="Project Price (₹)">
                <StyledInput value={price} onChangeText={setPrice} placeholder="e.g. 15,000" keyboardType="numeric" />
              </FormRow>
            </View>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.hint}>You can add developers now or skip and add them later from the project detail screen.</Text>
              {devSlots.map((slot, i) => (
                <View key={slot.id} style={styles.devSlot}>
                  {devSlots.length > 1 && (
                    <TouchableOpacity onPress={() => removeDevSlot(slot.id)} style={styles.removeSlotBtn}>
                      <Text style={styles.removeSlotText}>✕</Text>
                    </TouchableOpacity>
                  )}
                  <FormRow label="Developer Name">
                    <StyledInput value={slot.name} onChangeText={(v) => updateSlot(slot.id, 'name', v)} placeholder="e.g. Zafran, Amit..." />
                    <SuggestionChipRow chips={DEV_NAME_CHIPS} onSelect={(v) => updateSlot(slot.id, 'name', v)} small />
                  </FormRow>
                  <FormRow label="Role">
                    <StyledInput value={slot.role} onChangeText={(v) => updateSlot(slot.id, 'role', v)} placeholder="e.g. Frontend, Backend..." />
                    <SuggestionChipRow chips={DEV_ROLE_CHIPS} onSelect={(v) => updateSlot(slot.id, 'role', v)} small />
                  </FormRow>
                  <FormRow label="Payment (₹)">
                    <StyledInput value={slot.pay} onChangeText={(v) => updateSlot(slot.id, 'pay', v)} placeholder="Agreed amount" keyboardType="numeric" />
                  </FormRow>
                </View>
              ))}
              <TouchableOpacity onPress={addDevSlot} style={styles.addMoreBtn}>
                <Text style={styles.addMoreText}>➕ Add another Developer / Team</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 12 }]}>
        {step === 1 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>Next: Add Developers →</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.step2Btns}>
            <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <Text style={styles.skipBtnText}>Skip for Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <Text style={styles.createBtnText}>✅ Create Project</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 18 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  headerTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
  stepBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  stepText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: '#fff' },
  progressDots: { flexDirection: 'row', gap: 6, marginTop: 12 },
  progressDot: { flex: 1, height: 4, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.3)' },
  progressFilled: { flex: 1, height: 4, borderRadius: 99, backgroundColor: '#fff' },
  stepLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  stepLabelText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.7)' },
  scroll: { flex: 1 },
  body: { padding: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: 16, ...SHADOWS.card },
  formRow: { marginBottom: 12 },
  label: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm2, color: COLORS.text2, marginBottom: 4 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 9,
    fontSize: SIZES.md, fontFamily: FONTS.dmSans.regular, color: COLORS.text,
  },
  twoCol: { flexDirection: 'row', gap: 8 },
  hint: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: COLORS.text2, marginBottom: 14 },
  devSlot: {
    backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12,
    marginBottom: 8, borderWidth: 1.5, borderColor: COLORS.border, position: 'relative',
  },
  removeSlotBtn: {
    position: 'absolute', top: 8, right: 8, width: 24, height: 24,
    borderRadius: 12, backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  removeSlotText: { fontSize: SIZES.base, color: COLORS.danger },
  addMoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 10, borderWidth: 1.5, borderStyle: 'dashed',
    borderColor: COLORS.primary, borderRadius: 10, marginTop: 4,
  },
  addMoreText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base, color: COLORS.primary },
  stickyBottom: {
    backgroundColor: '#fff', borderTopWidth: 1.5, borderTopColor: COLORS.border, padding: 12,
  },
  nextBtn: { backgroundColor: COLORS.primary, padding: 13, borderRadius: 14, alignItems: 'center' },
  nextBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
  step2Btns: { flexDirection: 'row', gap: 10 },
  skipBtn: { flex: 1, padding: 13, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', backgroundColor: '#fff' },
  skipBtnText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: COLORS.text2 },
  createBtn: { flex: 2, padding: 13, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center' },
  createBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
});
