import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PaymentMethodPicker from '../../components/shared/PaymentMethodPicker';
import { SuggestionChipRow } from '../../components/shared/SuggestionChip';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';

// ─── Shared helpers ────────────────────────────────────────────────────────────
function ModalHeader({ colors, title, subtitle, onBack, insets }) {
  return (
    <LinearGradient colors={colors} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
      style={[shared.header, { paddingTop: insets.top + 6 }]}>
      <TouchableOpacity onPress={onBack} style={shared.backBtn}>
        <Text style={shared.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={shared.headerTitle}>{title}</Text>
      {subtitle && <Text style={shared.headerSub}>{subtitle}</Text>}
    </LinearGradient>
  );
}
function FormField({ label, children }) {
  return <View style={shared.formRow}><Text style={shared.label}>{label}</Text>{children}</View>;
}
function Input({ value, onChangeText, placeholder, keyboardType, defaultValue }) {
  return (
    <TextInput style={shared.input} value={value} onChangeText={onChangeText}
      placeholder={placeholder} placeholderTextColor={COLORS.text3}
      keyboardType={keyboardType} defaultValue={defaultValue} />
  );
}
function SubmitBtn({ label, onPress, color }) {
  return (
    <TouchableOpacity style={[shared.submitBtn, color && { backgroundColor: color }]} onPress={onPress} activeOpacity={0.85}>
      <Text style={shared.submitBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── SettleScreen ─────────────────────────────────────────────────────────────
export function SettleScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [payMethod, setPayMethod] = useState('upi');
  return (
    <View style={shared.container}>
      <ModalHeader colors={COLORS.gradientGreen} title="💰 Settle Up" onBack={() => navigation.goBack()} insets={insets} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={shared.body}>
          <View style={shared.card}>
            <FormField label="Paying To">
              {['Priya Kapoor — ₹210 pending', 'Sneha Kulkarni — ₹2,990 pending'].map((opt) => (
                <TouchableOpacity key={opt} style={shared.selectOpt}><Text style={shared.selectOptText}>{opt}</Text></TouchableOpacity>
              ))}
            </FormField>
            <FormField label="Amount"><Input defaultValue="₹210" placeholder="Amount" /></FormField>
            <FormField label="Payment Method"><PaymentMethodPicker value={payMethod} onChange={setPayMethod} /></FormField>
            <SubmitBtn label="✅ Confirm Settlement" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── GiveMoneyScreen ──────────────────────────────────────────────────────────
export function GiveMoneyScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('22/03/2026');
  return (
    <View style={shared.container}>
      <LinearGradient colors={['#991B1B', COLORS.danger]} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[shared.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backBtn}><Text style={shared.backText}>← Back</Text></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <View style={styles.dirIcon}><Text style={{ fontSize: 20 }}>↑</Text></View>
          <View>
            <Text style={shared.headerTitle}>You Gave Money</Text>
            <Text style={shared.headerSub}>to Priya Kapoor</Text>
          </View>
        </View>
      </LinearGradient>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={shared.body}>
          <View style={styles.amtBlock}>
            <Text style={styles.amtLbl}>Enter Amount</Text>
            <TextInput style={styles.amtInput} value={`₹ ${amount}`}
              onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ''))} keyboardType="numeric" selectTextOnFocus />
          </View>
          <View style={shared.card}>
            <FormField label="Note"><Input value={note} onChangeText={setNote} placeholder="e.g. Lunch split, Cab fare..." /></FormField>
            <FormField label="Date"><Input value={date} onChangeText={setDate} /></FormField>
            <SubmitBtn label="✅ Save — You Gave" onPress={() => navigation.goBack()} color={COLORS.danger} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── GetMoneyScreen ───────────────────────────────────────────────────────────
export function GetMoneyScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('22/03/2026');
  return (
    <View style={shared.container}>
      <LinearGradient colors={['#065F46', COLORS.primary]} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }}
        style={[shared.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backBtn}><Text style={shared.backText}>← Back</Text></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <View style={styles.dirIcon}><Text style={{ fontSize: 20 }}>↓</Text></View>
          <View>
            <Text style={shared.headerTitle}>You Received Money</Text>
            <Text style={shared.headerSub}>from Priya Kapoor</Text>
          </View>
        </View>
      </LinearGradient>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={shared.body}>
          <View style={styles.amtBlock}>
            <Text style={styles.amtLbl}>Enter Amount</Text>
            <TextInput style={styles.amtInput} value={`₹ ${amount}`}
              onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ''))} keyboardType="numeric" selectTextOnFocus />
          </View>
          <View style={shared.card}>
            <FormField label="Note"><Input value={note} onChangeText={setNote} placeholder="e.g. She paid me back, Split return..." /></FormField>
            <FormField label="Date"><Input value={date} onChangeText={setDate} /></FormField>
            <SubmitBtn label="✅ Save — You Received" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── EditProjectScreen ────────────────────────────────────────────────────────
export function EditProjectScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const TYPE_CHIPS = ['💻 Development', '🎨 UI/UX', '🚀 Deployment', '🔧 Maintenance', '📱 Mobile App'];
  const [type, setType] = useState('Development');
  return (
    <View style={shared.container}>
      <ModalHeader colors={COLORS.gradientGreen} title="✏️ Edit Project" onBack={() => navigation.goBack()} insets={insets} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={shared.body}>
          <View style={shared.card}>
            <FormField label="Project Name"><Input defaultValue="Flatshare Karo (Development)" /></FormField>
            <FormField label="Client / Company"><Input defaultValue="Flatshare Karo" /></FormField>
            <View style={shared.twoCol}>
              <View style={{ flex: 1 }}><FormField label="Start Date"><Input defaultValue="15/01/2026" /></FormField></View>
              <View style={{ flex: 1 }}><FormField label="End Date"><Input placeholder="Optional" /></FormField></View>
            </View>
            <FormField label="Project Price (₹)"><Input defaultValue="10,000" keyboardType="numeric" /></FormField>
            <FormField label="Project Type">
              <Input value={type} onChangeText={setType} placeholder="e.g. Development, UI/UX..." />
              <SuggestionChipRow chips={TYPE_CHIPS} onSelect={(v) => setType(v.replace(/^[^\s]+\s/, ''))} small />
            </FormField>
            <SubmitBtn label="💾 Save Changes" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── StatusScreen ─────────────────────────────────────────────────────────────
export function StatusScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('inprogress');
  const STATUS_OPTIONS = [
    { id: 'inactive', icon: '⏸️', label: 'In-Active', sub: 'Project is on hold or not started', bg: '#F3F4F6' },
    { id: 'inprogress', icon: '🔵', label: 'In-Progress', sub: 'Currently being worked on', bg: '#DBEAFE' },
    { id: 'onstay', icon: '⏳', label: 'On-Stay', sub: 'Paused, waiting for client/input', bg: '#FEF3C7' },
    { id: 'completed', icon: '✅', label: 'Completed', sub: 'Project delivered & done', bg: '#D1FAE5' },
    { id: 'cancelled', icon: '❌', label: 'Cancelled', sub: 'Project was cancelled', bg: '#FEE2E2' },
  ];
  const SELECTED_COLORS = { inactive: '#9CA3AF', inprogress: '#2563eb', onstay: '#F59E0B', completed: COLORS.primary, cancelled: COLORS.danger };
  return (
    <View style={shared.container}>
      <ModalHeader colors={COLORS.gradientGreen} title="🔄 Change Status" onBack={() => navigation.goBack()} insets={insets} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={shared.body}>
          <View style={shared.card}>
            <Text style={shared.sectionHeader}>Select Project Status</Text>
            <View style={{ gap: 10 }}>
              {STATUS_OPTIONS.map((opt) => (
                <TouchableOpacity key={opt.id} onPress={() => setSelected(opt.id)}
                  style={[styles.statusOpt, { borderColor: selected === opt.id ? SELECTED_COLORS[opt.id] : COLORS.border, borderWidth: selected === opt.id ? 2 : 1.5, backgroundColor: selected === opt.id ? opt.bg : '#F9FAFB' }]}
                  activeOpacity={0.8}>
                  <View style={[styles.statusIcon, { backgroundColor: opt.bg }]}><Text style={{ fontSize: 18 }}>{opt.icon}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statusLabel}>{opt.label}</Text>
                    <Text style={styles.statusSub}>{opt.sub}</Text>
                  </View>
                  {selected === opt.id && <Text style={{ fontSize: 16 }}>✅</Text>}
                </TouchableOpacity>
              ))}
            </View>
            <SubmitBtn label="✅ Update Status" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── EditDevScreen ────────────────────────────────────────────────────────────
export function EditDevScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState('Frontend Developer');
  const ROLE_CHIPS = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'UI/UX Designer', 'DevOps Engineer', 'Mobile Developer'];
  return (
    <View style={shared.container}>
      <ModalHeader colors={COLORS.gradientAmber} title="✏️ Edit Developer" onBack={() => navigation.goBack()} insets={insets} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={shared.body}>
          <View style={shared.card}>
            <FormField label="Full Name"><Input defaultValue="Zafran" /></FormField>
            <View style={shared.twoCol}>
              <View style={{ flex: 1 }}><FormField label="Phone"><Input defaultValue="+91 98XXX XXXXX" keyboardType="phone-pad" /></FormField></View>
              <View style={{ flex: 1 }}><FormField label="UPI ID"><Input defaultValue="zafran@upi" /></FormField></View>
            </View>
            <FormField label="Role / Skill">
              <Input value={role} onChangeText={setRole} />
              <SuggestionChipRow chips={ROLE_CHIPS} onSelect={setRole} small />
            </FormField>
            <SubmitBtn label="💾 Save Changes" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── DevStatusScreen ──────────────────────────────────────────────────────────
export function DevStatusScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('active');
  return (
    <View style={shared.container}>
      <ModalHeader colors={COLORS.gradientAmber} title="🔄 Developer Status" onBack={() => navigation.goBack()} insets={insets} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={shared.body}>
          <View style={shared.card}>
            <Text style={shared.sectionHeader}>Select Status</Text>
            <View style={{ gap: 10 }}>
              {[
                { id: 'active', icon: '✅', label: 'Active', sub: 'Currently working on projects', bg: '#D1FAE5', bc: COLORS.primary },
                { id: 'inactive', icon: '⏸️', label: 'In-Active', sub: 'Paused contract / not working', bg: '#F3F4F6', bc: '#9CA3AF' },
              ].map((opt) => (
                <TouchableOpacity key={opt.id} onPress={() => setSelected(opt.id)}
                  style={[styles.statusOpt, { borderColor: selected === opt.id ? opt.bc : COLORS.border, borderWidth: selected === opt.id ? 2 : 1.5, backgroundColor: selected === opt.id ? opt.bg : '#F9FAFB' }]}
                  activeOpacity={0.8}>
                  <View style={[styles.statusIcon, { backgroundColor: opt.bg }]}><Text style={{ fontSize: 18 }}>{opt.icon}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statusLabel}>{opt.label}</Text>
                    <Text style={styles.statusSub}>{opt.sub}</Text>
                  </View>
                  {selected === opt.id && <Text style={{ fontSize: 16 }}>✅</Text>}
                </TouchableOpacity>
              ))}
            </View>
            <SubmitBtn label="✅ Update Status" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── EditClientScreen ─────────────────────────────────────────────────────────
export function EditClientScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [industry, setIndustry] = useState('Technology');
  const INDUSTRY_CHIPS = ['Technology', 'Education', 'Real Estate', 'Retail', 'Finance'];
  return (
    <View style={shared.container}>
      <ModalHeader colors={COLORS.gradientBlue} title="✏️ Edit Client" onBack={() => navigation.goBack()} insets={insets} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={shared.body}>
          <View style={shared.card}>
            <FormField label="Company Name"><Input defaultValue="Flatshare Karo" /></FormField>
            <View style={shared.twoCol}>
              <View style={{ flex: 1 }}><FormField label="Contact Person"><Input defaultValue="Prashant K." /></FormField></View>
              <View style={{ flex: 1 }}><FormField label="Phone"><Input defaultValue="+91 97XXX XXXXX" keyboardType="phone-pad" /></FormField></View>
            </View>
            <FormField label="Industry">
              <Input value={industry} onChangeText={setIndustry} />
              <SuggestionChipRow chips={INDUSTRY_CHIPS} onSelect={setIndustry} small />
            </FormField>
            <SubmitBtn label="💾 Save Changes" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── ClientStatusScreen ───────────────────────────────────────────────────────
export function ClientStatusScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('active');
  return (
    <View style={shared.container}>
      <ModalHeader colors={COLORS.gradientBlue} title="🔄 Client Status" onBack={() => navigation.goBack()} insets={insets} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={shared.body}>
          <View style={shared.card}>
            <Text style={shared.sectionHeader}>Select Status</Text>
            <View style={{ gap: 10 }}>
              {[
                { id: 'active', icon: '✅', label: 'Active', sub: 'Ongoing business relationship', bg: '#D1FAE5', bc: COLORS.primary },
                { id: 'inactive', icon: '⏸️', label: 'In-Active', sub: 'No current projects or dealings', bg: '#F3F4F6', bc: '#9CA3AF' },
              ].map((opt) => (
                <TouchableOpacity key={opt.id} onPress={() => setSelected(opt.id)}
                  style={[styles.statusOpt, { borderColor: selected === opt.id ? opt.bc : COLORS.border, borderWidth: selected === opt.id ? 2 : 1.5, backgroundColor: selected === opt.id ? opt.bg : '#F9FAFB' }]}
                  activeOpacity={0.8}>
                  <View style={[styles.statusIcon, { backgroundColor: opt.bg }]}><Text style={{ fontSize: 18 }}>{opt.icon}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statusLabel}>{opt.label}</Text>
                    <Text style={styles.statusSub}>{opt.sub}</Text>
                  </View>
                  {selected === opt.id && <Text style={{ fontSize: 16 }}>✅</Text>}
                </TouchableOpacity>
              ))}
            </View>
            <SubmitBtn label="✅ Update Status" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── AddDevToProjectScreen ────────────────────────────────────────────────────
export function AddDevToProjectScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [devName, setDevName] = useState('');
  const [devRole, setDevRole] = useState('');
  const [pay, setPay] = useState('');
  const DEV_CHIPS = ['Zafran', 'Amit Sharma', 'Neha Verma', 'Sneha Kulkarni', '➕ New Developer'];
  const ROLE_CHIPS = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'UI/UX Designer', 'DevOps'];
  return (
    <View style={shared.container}>
      <ModalHeader colors={COLORS.gradientGreen} title="➕ Add Developer to Project" subtitle="Flatshare Karo (Development)" onBack={() => navigation.goBack()} insets={insets} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={shared.body}>
          <View style={shared.card}>
            <FormField label="Developer Name">
              <Input value={devName} onChangeText={setDevName} placeholder="e.g. Zafran, Amit..." />
              <SuggestionChipRow chips={DEV_CHIPS} onSelect={setDevName} small />
            </FormField>
            <FormField label="Role">
              <Input value={devRole} onChangeText={setDevRole} placeholder="e.g. Frontend, Backend..." />
              <SuggestionChipRow chips={ROLE_CHIPS} onSelect={setDevRole} small />
            </FormField>
            <FormField label="Payment Agreed (₹)">
              <Input value={pay} onChangeText={setPay} placeholder="e.g. 5,000" keyboardType="numeric" />
            </FormField>
            <SubmitBtn label="✅ Add to Project" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────
const shared = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 18, paddingBottom: 18 },
  backBtn: { marginBottom: 10 },
  backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
  headerTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
  headerSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  body: { padding: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.card, padding: 16, marginBottom: 12, ...SHADOWS.card },
  sectionHeader: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: COLORS.text2, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  formRow: { marginBottom: 12 },
  label: { fontFamily: FONTS.dmSans.semiBold, fontSize: SIZES.sm2, color: COLORS.text2, marginBottom: 4 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 9, fontSize: SIZES.md, fontFamily: FONTS.dmSans.regular, color: COLORS.text },
  selectOpt: { padding: 10, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#F9FAFB', marginBottom: 6 },
  selectOptText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: 12, alignItems: 'center', marginTop: 6 },
  submitBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
  twoCol: { flexDirection: 'row', gap: 8 },
});

const styles = StyleSheet.create({
  amtBlock: { backgroundColor: COLORS.text, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  amtLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.55)', marginBottom: 8 },
  amtInput: { fontFamily: FONTS.nunito.black, fontSize: 42, color: '#fff', letterSpacing: -2, textAlign: 'center', minWidth: 140 },
  dirIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  statusOpt: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12 },
  statusIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statusLabel: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.text },
  statusSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2 },
});
