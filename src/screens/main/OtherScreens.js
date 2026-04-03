// ReportsScreen.js
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Card, ProgressBar } from '../../components/ui';
import { FilterBar, SectionHeader } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import { notifications } from '../../data/mockData';
import { colors, fonts, radius, shadows } from '../../theme';

const SPENDING = [
  { label:'🍕 Food & Drinks', value:3200, percent:68, color: colors.primary },
  { label:'⚡ Bills',         value:2400, percent:51, color: colors.accent2 },
  { label:'🚌 Travel',        value:1850, percent:39, color: colors.accent },
  { label:'🎬 Entertainment', value:960,  percent:20, color: colors.danger },
];

export function ReportsScreen() {
  const { useCase } = useAppContext();
  const [filter, setFilter] = useState('This Month');
  const isFreelance = useCase === 'freelance';
  const heroColors = isFreelance ? ['#1e3a5f', '#2563eb'] : ['#1e3a5f', colors.accent2];

  const INCOME = [
    { label:'School ERP (March)',   amount:10000 },
    { label:'Flatshare Karo (Dev)', amount:7000 },
    { label:'School ERP (Feb)',     amount:2500 },
    { label:'QR Park Plus',         amount:5000 },
    { label:'QR Park Update',       amount:500 },
  ];

  return (
    <ScrollView style={{ flex:1, backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={heroColors} start={{x:0,y:0}} end={{x:1,y:1}} style={{ paddingHorizontal:18, paddingTop:18, paddingBottom:20 }}>
        <AppText variant="h2" color="#fff" style={{ marginBottom:12 }}>📊 Reports</AppText>
        <View style={{ flexDirection:'row', gap:10 }}>
          <View style={{ flex:1, backgroundColor:'rgba(255,255,255,0.15)', borderRadius:12, padding:10 }}>
            <AppText style={{ fontFamily:fonts.black, fontSize:20, color:'#fff' }}>₹8,940</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.8)" style={{ marginTop:2 }}>Total Spent · March</AppText>
          </View>
          <View style={{ flex:1, backgroundColor:'rgba(255,255,255,0.15)', borderRadius:12, padding:10 }}>
            <AppText style={{ fontFamily:fonts.black, fontSize:20, color:'#fff' }}>₹34,000</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.8)" style={{ marginTop:2 }}>Project Income</AppText>
          </View>
        </View>
      </LinearGradient>

      <View style={{ padding:14 }}>
        <FilterBar options={['This Month','Last 3 Months','This Year','Custom']} active={filter} onSelect={setFilter} style={{ marginBottom:14 }} />

        {/* Spending breakdown */}
        {useCase !== 'freelance' && (
          <Card>
            <SectionHeader title="Spending Breakdown" />
            <View style={{ flexDirection:'row', alignItems:'center', gap:16 }}>
              <View style={{ width:100, height:100, borderRadius:50, borderWidth:16, borderColor: colors.primary, alignItems:'center', justifyContent:'center' }}>
                <AppText variant="label" color={colors.text} style={{ textAlign:'center', fontSize:12 }}>₹8.9k</AppText>
                <AppText variant="caption" color={colors.text2} style={{ textAlign:'center' }}>SPENT</AppText>
              </View>
              <View style={{ flex:1 }}>
                {[{l:'Food & Drinks',v:'₹3,200',c:colors.primary},{l:'Bills',v:'₹2,400',c:colors.accent2},{l:'Travel',v:'₹1,850',c:colors.accent},{l:'Others',v:'₹1,490',c:'#D1D5DB'}].map(leg=>(
                  <View key={leg.l} style={{ flexDirection:'row', alignItems:'center', gap:6, marginBottom:7 }}>
                    <View style={{ width:8, height:8, borderRadius:2, backgroundColor:leg.c }} />
                    <AppText variant="bodySm" color={colors.text2} style={{ flex:1 }}>{leg.l}</AppText>
                    <AppText variant="label" color={colors.text}>{leg.v}</AppText>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        )}

        {/* Project Income */}
        {useCase !== 'split' && (
          <LinearGradient colors={['#1e3a5f','#2563eb']} start={{x:0,y:0}} end={{x:1,y:1}} style={{ borderRadius:16, padding:14, marginBottom:12 }}>
            <AppText variant="sectionHeader" color="rgba(255,255,255,0.7)" style={{ marginBottom:10 }}>Project Income — March</AppText>
            {INCOME.map((r,i)=>(
              <View key={i} style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:8 }}>
                <AppText variant="bodySm" color="rgba(255,255,255,0.85)">{r.label}</AppText>
                <AppText variant="label" color="#fff">₹{r.amount.toLocaleString()}</AppText>
              </View>
            ))}
            <View style={{ flexDirection:'row', justifyContent:'space-between', borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.2)', paddingTop:8 }}>
              <AppText variant="label" color="#fff">Total Received</AppText>
              <AppText variant="h3" color="#fff">₹25,000</AppText>
            </View>
          </LinearGradient>
        )}

        {/* Category Bars */}
        {useCase !== 'freelance' && (
          <Card>
            <SectionHeader title="Spending by Category" />
            {SPENDING.map(s => (
              <View key={s.label} style={{ marginBottom:14 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:5 }}>
                  <AppText variant="label" color={colors.text}>{s.label}</AppText>
                  <AppText variant="label" color={colors.text}>₹{s.value.toLocaleString()}</AppText>
                </View>
                <ProgressBar progress={s.percent} color={s.color} height={8} />
              </View>
            ))}
          </Card>
        )}

        {/* Profit Analysis */}
        {useCase !== 'split' && (
          <Card>
            <SectionHeader title="💸 Profit Analysis" />
            {[
              { l:'Total Income', v:'₹34,000', c: colors.primary },
              { l:'Developer Payments', v:'−₹8,500', c: colors.danger },
              { l:'Net Profit', v:'₹25,500', c: colors.primary, bold:true },
            ].map(r=>(
              <View key={r.l} style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:8, borderBottomWidth:1, borderBottomColor: colors.border }}>
                <AppText variant={r.bold ? 'label' : 'bodySm'} color={colors.text}>{r.l}</AppText>
                <AppText variant={r.bold ? 'h4' : 'label'} color={r.c}>{r.v}</AppText>
              </View>
            ))}
          </Card>
        )}

        {/* Friends Summary */}
        {useCase !== 'freelance' && (
          <Card>
            <SectionHeader title="👥 Friends Summary" />
            {[{l:'Total friends owe you',v:'₹5,440',c:colors.primary},{l:'You owe friends',v:'₹3,200',c:colors.danger},{l:'Net balance',v:'+₹2,240',c:colors.primary}].map(r=>(
              <View key={r.l} style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:8, borderBottomWidth:1, borderBottomColor: colors.border }}>
                <AppText variant="bodySm" color={colors.text2}>{r.l}</AppText>
                <AppText variant="label" color={r.c}>{r.v}</AppText>
              </View>
            ))}
          </Card>
        )}
      </View>
      <View style={{ height:24 }} />
    </ScrollView>
  );
}

// ── NotificationsScreen ───────────────────────────────────────
export function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n =>  n.read);

  const NotifCard = ({ n }) => (
    <View style={[
      styles.notifCard,
      n.borderColor ? { borderLeftWidth:4, borderLeftColor: n.borderColor } : null,
      n.read ? { opacity:0.82 } : null,
    ]}>
      <View style={[styles.notifIcon, { backgroundColor: n.iconBg }]}>
        <AppText style={{ fontSize:18 }}>{n.icon}</AppText>
      </View>
      <View style={{ flex:1 }}>
        <AppText variant="label" color={colors.text}>{n.title}</AppText>
        <AppText variant="bodySm" color={colors.text2} style={{ marginTop:3, lineHeight:18 }}>{n.body}</AppText>
        {n.actions?.length > 0 && (
          <View style={{ flexDirection:'row', gap:8, marginTop:10 }}>
            {n.actions.map((a,i)=>(
              <TouchableOpacity key={i} style={[styles.notifActionBtn, { backgroundColor:a.bg, flex: n.actions.length===1 ? undefined : 1 }]}>
                <AppText variant="labelSm" color={a.color}>{a.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <AppText variant="caption" color={colors.text3} style={{ flexShrink:0 }}>{n.time}</AppText>
    </View>
  );

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.notifHero, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom:8 }}>
          <AppText style={{ fontFamily:fonts.bold, fontSize:13, color:'rgba(255,255,255,0.9)' }}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color="#fff">🔔 Notifications</AppText>
        <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{ marginTop:2 }}>{unread.length} unread alerts</AppText>
      </LinearGradient>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding:14 }}>
          {unread.length > 0 && <>
            <SectionHeader title="Unread" />
            {unread.map(n => <NotifCard key={n.id} n={n} />)}
          </>}
          <SectionHeader title="Earlier" style={{ marginTop:6 }} />
          {read.map(n => <NotifCard key={n.id} n={n} />)}
        </View>
        <View style={{ height:24 }} />
      </ScrollView>
    </View>
  );
}

// ── ProfileScreen ─────────────────────────────────────────────
export function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notifs,  setNotifs]  = useState(true);
  const [budget,  setBudget]  = useState(true);

  const SettingRow = ({ icon, title, sub, right, onPress }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
        <AppText style={{ fontSize:18 }}>{icon}</AppText>
        <View>
          <AppText variant="label" color={colors.text}>{title}</AppText>
          {sub && <AppText variant="caption" color={colors.text2} style={{ marginTop:1 }}>{sub}</AppText>}
        </View>
      </View>
      {right !== undefined ? right : <AppText style={{ fontSize:18, color: colors.text3 }}>›</AppText>}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex:1, backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{x:0,y:0}} end={{x:1,y:1}} style={[{ paddingHorizontal:18, paddingBottom:24 }, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom:10, alignSelf:'flex-start' }}>
          <AppText style={{ fontFamily:fonts.bold, fontSize:13, color:'rgba(255,255,255,0.9)' }}>← Back</AppText>
        </TouchableOpacity>
        <View style={{ alignItems:'center' }}>
          <View style={{ width:64, height:64, borderRadius:32, backgroundColor:'rgba(255,255,255,0.25)', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
            <AppText style={{ fontFamily:fonts.black, fontSize:26, color:'#fff' }}>RK</AppText>
          </View>
          <AppText variant="h2" color="#fff">Rahul Kumar</AppText>
          <AppText variant="bodySm" color="rgba(255,255,255,0.8)" style={{ marginTop:3 }}>rahul.kumar@gmail.com · Freelancer</AppText>
          <View style={{ flexDirection:'row', gap:10, marginTop:14 }}>
            {['7 Projects','4 Devs','3 Clients'].map(b=>(
              <View key={b} style={{ backgroundColor:'rgba(255,255,255,0.2)', borderRadius:10, paddingHorizontal:14, paddingVertical:6 }}>
                <AppText variant="labelSm" color="#fff">{b}</AppText>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={{ padding:14 }}>
        <View style={styles.settingsGroup}>
          <SettingRow icon="👤" title="Edit Profile"    sub="Name, photo, phone" />
          <SettingRow icon="💳" title="Payment Methods" sub="UPI, Bank, Cards" />
          <SettingRow icon="👨‍💻" title="My Developers"   sub="4 developers · Tap to manage" />
          <SettingRow icon="🏢" title="My Clients"      sub="Maksoft, Flatshare, School" />
        </View>
        <View style={styles.settingsGroup}>
          <SettingRow icon="🔔" title="Notifications" sub="Reminders & alerts" right={<Switch value={notifs} onValueChange={setNotifs} trackColor={{false:'#E5E7EB',true:colors.primaryLight}} thumbColor={notifs?colors.primary:'#f4f3f4'} />} />
          <SettingRow icon="💰" title="Budget Alerts"  sub="Alert at 80% of budget" right={<Switch value={budget} onValueChange={setBudget} trackColor={{false:'#E5E7EB',true:colors.primaryLight}} thumbColor={budget?colors.primary:'#f4f3f4'} />} />
        </View>
        <View style={styles.settingsGroup}>
          <SettingRow icon="📊" title="Export Reports"     sub="PDF, CSV, Excel" />
          <SettingRow icon="🧾" title="Invoice Templates"  sub="Create & send invoices" />
          <SettingRow icon="🔒" title="Privacy & Security" sub="PIN, biometrics" />
        </View>
        <TouchableOpacity style={{ alignItems:'center', padding:14 }}>
          <AppText variant="label" color={colors.danger}>🚪 Log Out</AppText>
        </TouchableOpacity>
        <AppText variant="caption" color={colors.text3} style={{ textAlign:'center', marginBottom:8 }}>Hisaab v1.0.0</AppText>
      </View>
      <View style={{ height:24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Notif
  notifHero:       { paddingHorizontal:18, paddingBottom:18 },
  notifCard:       { backgroundColor: colors.card, borderRadius:radius.lg, padding:14, marginBottom:10, flexDirection:'row', gap:12, alignItems:'flex-start', ...shadows.sm },
  notifIcon:       { width:38, height:38, borderRadius:19, alignItems:'center', justifyContent:'center', flexShrink:0 },
  notifActionBtn:  { paddingVertical:6, paddingHorizontal:10, borderRadius:8, alignItems:'center' },
  // Profile
  settingsGroup:   { backgroundColor: colors.card, borderRadius:16, overflow:'hidden', marginBottom:14, ...shadows.sm },
  settingRow:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:13, paddingHorizontal:16, borderBottomWidth:1, borderBottomColor: colors.border },
});
