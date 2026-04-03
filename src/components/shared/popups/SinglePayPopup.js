import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../../theme/typography';

export default function SinglePayPopup({ visible, data, onClose }) {
  if (!data) return null;
  const isPaid = data.status === 'paid';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isPaid ? '✅ ' : '⏳ '}{data.label}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeX}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Amount Block */}
          <LinearGradient
            colors={isPaid ? ['#065F46', '#1a7a5e'] : ['#92400E', '#F59E0B']}
            start={{ x: 0.13, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.amtBlock}
          >
            <Text style={styles.amtLabel}>Amount</Text>
            <Text style={styles.amtVal}>{data.amount}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{isPaid ? '✅ Paid' : '⏳ Pending'}</Text>
            </View>
          </LinearGradient>
          {/* Details */}
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Label</Text>
              <Text style={styles.detailValue}>{data.label}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{data.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Method</Text>
              <Text style={styles.detailValue}>{data.method}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Note</Text>
              <Text style={[styles.detailValue, { maxWidth: '65%', textAlign: 'right' }]}>{data.note}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
    paddingBottom: 24,
  },
  handleRow: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle: { width: 40, height: 4, borderRadius: 99, backgroundColor: '#E5E7EB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: FONTS.nunito.black,
    fontSize: SIZES.lg2,
    color: COLORS.text,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: { fontSize: SIZES.sm2, color: COLORS.text2 },
  amtBlock: {
    margin: 18,
    borderRadius: RADIUS.xl,
    padding: 18,
    alignItems: 'center',
  },
  amtLabel: {
    fontFamily: FONTS.dmSans.regular,
    fontSize: SIZES.base,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  amtVal: {
    fontFamily: FONTS.nunito.black,
    fontSize: SIZES.huge,
    color: '#fff',
    letterSpacing: -1,
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statusText: {
    fontFamily: FONTS.nunito.bold,
    fontSize: SIZES.sm2,
    color: '#fff',
  },
  detailsBox: {
    marginHorizontal: 18,
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontFamily: FONTS.dmSans.semiBold,
    fontSize: SIZES.base,
    color: COLORS.text2,
  },
  detailValue: {
    fontFamily: FONTS.nunito.bold,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
});
