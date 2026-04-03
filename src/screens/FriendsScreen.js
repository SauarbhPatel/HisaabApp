import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText, Button } from '../components/ui';
import { SearchBar, FilterBar, SectionHeader } from '../components/common';
import FriendCard  from '../features/friends/FriendCard';
import SettleModal from '../features/friends/SettleModal';
import { friends } from '../data/mockData';
import { colors }  from '../theme';

const FILTERS = ['All', 'You Owe', 'Owed to You', 'Settled'];

export default function FriendsScreen() {
  const [filter,   setFilter]   = useState('All');
  const [selected, setSelected] = useState(null);
  const [showSettle, setShowSettle] = useState(false);

  const owedToYou = friends.filter(f => f.owes).reduce((s, f) => s + f.balance, 0);
  const youOwe    = friends.filter(f => !f.owes).reduce((s, f) => s + Math.abs(f.balance), 0);

  const filtered = friends.filter(f => {
    if (filter === 'All') return true;
    if (filter === 'You Owe')       return !f.owes;
    if (filter === 'Owed to You')   return f.owes;
    if (filter === 'Settled')       return f.balance === 0;
    return true;
  });

  const handleSettle = (friend) => {
    setSelected(friend);
    setShowSettle(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Hero */}
      <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <AppText variant="h2" color="#fff" style={{ marginBottom: 12 }}>Friends & Balances</AppText>
        <View style={styles.statsRow}>
          {[
            { value: `₹${owedToYou.toLocaleString()}`, label: 'Owed to You', valueColor: '#A7F3D0' },
            { value: `₹${youOwe.toLocaleString()}`,    label: 'You Owe',     valueColor: '#FCA5A5' },
            { value: String(friends.length),           label: 'Friends',     valueColor: '#fff'    },
          ].map(s => (
            <View key={s.label} style={styles.stat}>
              <AppText variant="h3" color={s.valueColor}>{s.value}</AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.75)" style={{ marginTop: 2 }}>{s.label}</AppText>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.searchRow}>
            <SearchBar placeholder="Search friends..." style={{ flex: 1, marginBottom: 0 }} />
            <Button title="+" variant="primary" size="md" style={styles.addBtn} />
          </View>

          <FilterBar options={FILTERS} active={filter} onSelect={setFilter} style={{ marginVertical: 10 }} />

          <SectionHeader title="Balances" />

          {filtered.map(friend => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onPress={() => handleSettle(friend)}
              onSettle={handleSettle}
            />
          ))}

          <Button
            title="🤝 Add a Friend"
            variant="outline"
            size="lg"
            style={styles.addFriendBtn}
          />
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      <SettleModal
        visible={showSettle}
        onClose={() => setShowSettle(false)}
        friend={selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero:        { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 20 },
  statsRow:    { flexDirection: 'row', gap: 8 },
  stat:        { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10, alignItems: 'center' },
  body:        { padding: 14 },
  searchRow:   { flexDirection: 'row', gap: 10, alignItems: 'center' },
  addBtn:      { width: 44, height: 44, borderRadius: 12 },
  addFriendBtn:{ borderStyle: 'dashed', marginTop: 4 },
});
