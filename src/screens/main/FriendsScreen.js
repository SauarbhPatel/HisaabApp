import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TopBar from '../../components/shared/TopBar';
import { FilterChipRow } from '../../components/shared/FilterChip';
import SearchBar from '../../components/shared/SearchBar';
import { COLORS, SHADOWS } from '../../theme/colors';
import { FONTS, SIZES, RADIUS } from '../../theme/typography';
import { FRIENDS } from '../../data/mockData';

const FILTERS = ['All', 'You Owe', 'Owed to You', 'Settled'];

export default function FriendsScreen({ navigation }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={COLORS.gradientGreen} start={{ x: 0.13, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <Text style={styles.headerTitle}>Friends & Balances</Text>
          <View style={styles.statsRow}>
            {[
              { val: '₹5,440', lbl: 'Owed to You', col: '#A7F3D0' },
              { val: '₹3,200', lbl: 'You Owe', col: '#FCA5A5' },
              { val: '4', lbl: 'Friends', col: '#fff' },
            ].map((s) => (
              <View key={s.lbl} style={styles.statBox}>
                <Text style={[styles.statVal, { color: s.col }]}>{s.val}</Text>
                <Text style={styles.statLbl}>{s.lbl}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Search + Add */}
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder="Search friends..."
              value={search}
              onChangeText={setSearch}
              style={{ marginHorizontal: 0, marginBottom: 0 }}
            />
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddFriend')}
            activeOpacity={0.85}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <FilterChipRow chips={FILTERS} activeChip={filter} onSelect={setFilter} style={{ marginTop: 4 }} />

        <View style={styles.body}>
          <Text style={styles.sectionHeader}>Balances</Text>
          {FRIENDS.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              style={styles.friendCard}
              onPress={() => navigation.navigate('FriendDetail', { friendId: friend.id })}
              activeOpacity={0.85}
            >
              <View style={styles.fcTop}>
                <View style={[styles.avatar, { backgroundColor: friend.color }]}>
                  <Text style={styles.avatarText}>{friend.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fcName}>{friend.name}</Text>
                  <Text style={styles.fcStatus}>{friend.status}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.fcAmt, { color: friend.amount >= 0 ? COLORS.primary : COLORS.danger }]}>
                    {friend.amount >= 0 ? '+' : ''}₹{Math.abs(friend.amount).toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.fcExpCount}>{friend.expenseCount} expenses</Text>
                </View>
              </View>
              <View style={styles.fcActions}>
                <TouchableOpacity
                  style={[styles.fcBtn, { backgroundColor: COLORS.primaryUltraLight }]}
                  onPress={() => navigation.navigate('Settle', { friendId: friend.id })}
                >
                  <Text style={[styles.fcBtnText, { color: COLORS.primary }]}>
                    {friend.amount < 0 ? 'Settle Up' : 'Remind'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.fcBtn, { backgroundColor: '#D1FAE5' }]}>
                  <Text style={[styles.fcBtnText, { color: '#065F46' }]}>💬 WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.fcBtn, { backgroundColor: COLORS.primaryUltraLight }]}>
                  <Text style={[styles.fcBtnText, { color: COLORS.primary }]}>📞 Call</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {/* Add friend dashed */}
          <TouchableOpacity
            style={styles.addFriendDashed}
            onPress={() => navigation.navigate('AddFriend')}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 18 }}>🤝</Text>
            <Text style={styles.addFriendText}> Add a Friend</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 18, paddingBottom: 18 },
  headerTitle: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, padding: 10, alignItems: 'center',
  },
  statVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
  statLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingTop: 12 },
  addBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  addBtnText: { fontSize: 24, color: '#fff', lineHeight: 28 },
  body: { paddingHorizontal: 14 },
  sectionHeader: {
    fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2,
    color: COLORS.text2, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 10,
  },
  friendCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    marginBottom: 10, ...SHADOWS.card,
  },
  fcTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.lg2, color: '#fff' },
  fcName: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
  fcStatus: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 1 },
  fcAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
  fcExpCount: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text3, marginTop: 2 },
  fcActions: { flexDirection: 'row', gap: 8 },
  fcBtn: { flex: 1, padding: 7, borderRadius: 9, alignItems: 'center' },
  fcBtnText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
  addFriendDashed: {
    borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: 'dashed',
    borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primaryUltraLight,
  },
  addFriendText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md, color: COLORS.primary },
});
