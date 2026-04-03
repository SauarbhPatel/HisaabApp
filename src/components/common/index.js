import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '../ui';
import { colors, radius, shadows, fonts } from '../../theme';

// ── SearchBar ────────────────────────────────────────────────
export function SearchBar({ placeholder = 'Search...', value, onChangeText, style }) {
  return (
    <View style={[{ flexDirection:'row', alignItems:'center', backgroundColor: colors.card, borderRadius: radius.md, borderWidth:1.5, borderColor: colors.border, paddingHorizontal:14, paddingVertical:10, gap:8, marginBottom:10 }, style]}>
      <Text style={{ fontSize:14 }}>🔍</Text>
      <TextInput style={{ flex:1, fontFamily: fonts.regular, fontSize:13, color: colors.text, padding:0 }} placeholder={placeholder} placeholderTextColor={colors.text3} value={value} onChangeText={onChangeText} />
    </View>
  );
}

// ── FilterBar ────────────────────────────────────────────────
export function FilterBar({ options, active, onSelect, style }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style} contentContainerStyle={{ flexDirection:'row', gap:8, paddingBottom:2 }}>
      {options.map(opt => {
        const isActive = active === opt;
        return (
          <TouchableOpacity key={opt} onPress={() => onSelect(opt)} activeOpacity={0.75}
            style={{ paddingHorizontal:14, paddingVertical:6, borderRadius:radius.full, borderWidth:1.5, borderColor: isActive ? colors.primary : colors.border, backgroundColor: isActive ? colors.primary : colors.card }}>
            <Text style={{ fontFamily: fonts.bold, fontSize:12, color: isActive ? '#fff' : colors.text2 }}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ── SectionHeader ────────────────────────────────────────────
export function SectionHeader({ title, actionLabel, onAction, style }) {
  return (
    <View style={[{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 }, style]}>
      <AppText variant="sectionHeader" color={colors.text2}>{title}</AppText>
      {actionLabel ? <AppText variant="labelSm" color={colors.primary} onPress={onAction}>{actionLabel}</AppText> : null}
    </View>
  );
}

// ── StatusPill ───────────────────────────────────────────────
const STATUS_CFG = {
  active:    { bg:'#DBEAFE', color:'#1D4ED8', label:'🔵 Active' },
  completed: { bg:'#D1FAE5', color:'#065F46', label:'✅ Completed' },
  pending:   { bg:'#FEF3C7', color:'#92400E', label:'⏳ In Progress' },
  partial:   { bg:'#FEE2E2', color:'#991B1B', label:'⚠️ Partial Pay' },
};
export function StatusPill({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
  return <View style={{ paddingHorizontal:10, paddingVertical:4, borderRadius:radius.full, backgroundColor:c.bg, alignSelf:'flex-start' }}><Text style={{ fontFamily:fonts.bold, fontSize:10, color:c.color }}>{c.label}</Text></View>;
}

// ── BalanceBadge ──────────────────────────────────────────────
const BAL_CFG = {
  owe:     { bg:'#FEE2E2', color:'#EF4444' },
  lent:    { bg:'#e1f5ee', color:'#1a7a5e' },
  settled: { bg:'#F3F4F6', color:'#6B7280' },
};
export function BalanceBadge({ type, label }) {
  const c = BAL_CFG[type] || BAL_CFG.settled;
  return <View style={{ paddingHorizontal:10, paddingVertical:4, borderRadius:8, backgroundColor:c.bg }}><Text style={{ fontFamily:fonts.bold, fontSize:11, color:c.color }}>{label}</Text></View>;
}

// ── PaymentMethodPicker ───────────────────────────────────────
const PAY_METHODS = [
  { key:'upi',  icon:'📱', label:'UPI / PhonePe / GPay' },
  { key:'cash', icon:'💵', label:'Cash' },
  { key:'bank', icon:'🏦', label:'Bank Transfer' },
];
export function PaymentMethodPicker({ value, onChange }) {
  return (
    <View style={{ gap:6 }}>
      {PAY_METHODS.map(m => {
        const sel = value === m.key;
        return (
          <TouchableOpacity key={m.key} onPress={() => onChange(m.key)} activeOpacity={0.8}
            style={{ flexDirection:'row', alignItems:'center', gap:10, padding:10, borderWidth:1.5, borderColor: sel ? colors.primary : colors.border, borderRadius:radius.md, backgroundColor: sel ? colors.primaryUltraLight : colors.card }}>
            <Text style={{ fontSize:20 }}>{m.icon}</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize:13, color: sel ? colors.primary : colors.text }}>{m.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── FullModal ─────────────────────────────────────────────────
export function FullModal({ visible, onClose, title, subtitle, gradientColors, children, footer }) {
  const insets = useSafeAreaInsets();
  const grad = gradientColors || [colors.primary, colors.primaryLight];
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex:1, backgroundColor: colors.bg }}>
        <LinearGradient colors={grad} start={{x:0,y:0}} end={{x:1,y:1}} style={{ paddingHorizontal:18, paddingTop:18, paddingBottom:18 }}>
          <TouchableOpacity onPress={onClose} style={{ marginBottom:8 }}>
            <Text style={{ fontFamily:fonts.bold, fontSize:13, color:'rgba(255,255,255,0.9)' }}>← Back</Text>
          </TouchableOpacity>
          <AppText variant="h2" color="#fff">{title}</AppText>
          {subtitle ? <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{marginTop:2}}>{subtitle}</AppText> : null}
        </LinearGradient>
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:14, paddingBottom:32}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer && <View style={{backgroundColor:colors.white, borderTopWidth:1.5, borderTopColor:colors.border, paddingHorizontal:14, paddingTop:12, paddingBottom: insets.bottom + 8, flexDirection:'row', gap:10 }}>{footer}</View>}
      </SafeAreaView>
    </Modal>
  );
}
