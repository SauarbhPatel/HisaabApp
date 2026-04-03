import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { AppText, Button } from '../components/ui';
import { SectionHeader } from '../components/common';
import GroupCard from '../features/groups/GroupCard';
import { groups } from '../data/mockData';
import { colors, radius, shadows } from '../theme';

export default function GroupsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="h2" color={colors.text}>Your Groups</AppText>
          <Button title="+ New Group" variant="primary" size="sm" />
        </View>

        <View style={styles.body}>
          {groups.map(group => (
            <GroupCard key={group.id} group={group} onPress={() => {}} />
          ))}

          <TouchableOpacity style={styles.createBtn}>
            <AppText variant="label" color={colors.primary}>+ Create New Group</AppText>
          </TouchableOpacity>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 10 },
  body:      { paddingHorizontal: 14 },
  createBtn: {
    borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed',
    borderRadius: radius.lg, padding: 14, alignItems: 'center',
    backgroundColor: colors.primaryUltraLight, marginTop: 4,
  },
});
