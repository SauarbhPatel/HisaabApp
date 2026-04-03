import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button } from '../components/ui';
import { SearchBar, FilterBar, SectionHeader } from '../components/common';
import ProjectCard        from '../features/projects/ProjectCard';
import ProjectDetailModal from '../features/projects/ProjectDetailModal';
import PayDevModal        from '../features/projects/PayDevModal';
import AddProjectModal    from '../features/projects/AddProjectModal';
import { projects }       from '../data/mockData';
import { colors }         from '../theme';

const FILTERS = ['All', 'Active', 'Completed', 'Pending Pay', 'Maksoft', 'Flatshare'];

const MONTH_GROUPS = [
  { label: '📅 January 2026',  total: '₹18,000 received', ids: ['qr1', 'flat1'] },
  { label: '📅 February 2026', total: '₹5,000 received',  ids: ['flat2'] },
  { label: '📅 March 2026',    total: '₹10k received',    ids: ['school1', 'school2'] },
];

function HeroStats() {
  return (
    <View style={styles.stats}>
      {[
        { value: '₹34k', label: 'Received' },
        { value: '₹10k', label: 'Pending'  },
        { value: '3',    label: 'Active'   },
      ].map(s => (
        <View key={s.label} style={styles.stat}>
          <AppText variant="h3" color="#fff">{s.value}</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>{s.label}</AppText>
        </View>
      ))}
    </View>
  );
}

export default function ProjectsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetail,      setShowDetail]      = useState(false);
  const [showPayDev,      setShowPayDev]      = useState(false);
  const [showAdd,         setShowAdd]         = useState(false);
  const [payCtx,          setPayCtx]          = useState({ dev: null, project: null });

  const handlePayDev = (dev, project) => {
    setPayCtx({ dev, project });
    setShowPayDev(true);
  };

  const filteredProjects = (ids) =>
    projects.filter(p => {
      if (!ids.includes(p.id)) return false;
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Active')      return p.status === 'active';
      if (activeFilter === 'Completed')   return p.status === 'completed';
      if (activeFilter === 'Pending Pay') return p.pending > 0;
      return p.client.toLowerCase().includes(activeFilter.toLowerCase());
    });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Hero */}
      <LinearGradient colors={['#1e3a5f', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 14 }]}>
        <View style={styles.heroRow}>
          {navigation?.canGoBack?.() && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
              <AppText style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontFamily: 'Nunito_700Bold' }}>←</AppText>
            </TouchableOpacity>
          )}
          <AppText variant="h2" color="#fff">💼 Freelance Projects</AppText>
        </View>
        <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>
          Track income, clients & developer payments
        </AppText>
        <HeroStats />
        <View style={styles.incomeBanner}>
          <AppText style={{ fontSize: 14 }}>💰</AppText>
          <AppText variant="bodySm" color="#A7F3D0" style={{ flex: 1 }}>
            Total project value Mar: ₹44,000 · Profit after dev pay: ₹25,500
          </AppText>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {/* Toolbar */}
          <View style={styles.toolbar}>
            <SectionHeader title="2026 Projects" />
            <Button title="+ New" variant="blue" size="sm" onPress={() => setShowAdd(true)} />
          </View>

          <SearchBar placeholder="Search projects, clients..." style={{ marginBottom: 12 }} />
          <FilterBar options={FILTERS} active={activeFilter} onSelect={setActiveFilter} style={{ marginBottom: 14 }} />

          {MONTH_GROUPS.map(group => {
            const items = filteredProjects(group.ids);
            if (!items.length) return null;
            return (
              <View key={group.label}>
                <View style={styles.monthRow}>
                  <AppText variant="sectionHeader" color={colors.textSecondary}>{group.label}</AppText>
                  <AppText variant="labelSm"       color={colors.primary}>{group.total}</AppText>
                </View>
                {items.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPress={() => { setSelectedProject(project); setShowDetail(true); }}
                    onPayDev={handlePayDev}
                  />
                ))}
              </View>
            );
          })}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      <ProjectDetailModal
        project={selectedProject}
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        onPayDev={handlePayDev}
      />
      <PayDevModal
        visible={showPayDev}
        onClose={() => setShowPayDev(false)}
        project={payCtx.project}
        dev={payCtx.dev}
      />
      <AddProjectModal visible={showAdd} onClose={() => setShowAdd(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  hero:        { paddingHorizontal: 18, paddingBottom: 20 },
  heroRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  stats:       { flexDirection: 'row', gap: 8, marginTop: 14 },
  stat:        { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10, alignItems: 'center' },
  incomeBanner:{ backgroundColor: 'rgba(16,185,129,0.2)', borderRadius: 10, padding: 10, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  body:        { padding: 14 },
  toolbar:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 10 },
});
