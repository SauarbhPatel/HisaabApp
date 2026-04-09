// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import { FONTS, SIZES, RADIUS } from '../../theme/typography';
// import { GROUPS } from '../../data/mockData';

// export default function GroupDetailScreen({ navigation, route }) {
//   const insets = useSafeAreaInsets();
//   const { groupId } = route.params || {};
//   const group = GROUPS.find((g) => g.id === groupId) || GROUPS[0];

//   const expensesByMonth = {};
//   (group.expenses || []).forEach((exp) => {
//     const month = exp.month || 'March 2026';
//     if (!expensesByMonth[month]) expensesByMonth[month] = [];
//     expensesByMonth[month].push(exp);
//   });

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={COLORS.gradientPurple}
//         start={{ x: 0.13, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={[styles.header, { paddingTop: insets.top + 6 }]}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//         <View style={styles.headerContent}>
//           <View style={[styles.groupIcon, { backgroundColor: group.iconBg }]}>
//             <Text style={{ fontSize: 26 }}>{group.icon}</Text>
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.groupName}>{group.name}</Text>
//             <Text style={styles.groupSub}>{group.memberCount} members · {group.expenseCount} expenses this month</Text>
//           </View>
//         </View>

//         {/* Balance box */}
//         <View style={styles.balanceBox}>
//           <View style={styles.balItem}>
//             <Text style={[styles.balVal, { color: '#FCA5A5' }]}>
//               ₹{Math.abs(group.balance).toLocaleString('en-IN')}
//             </Text>
//             <Text style={styles.balLbl}>You Owe</Text>
//           </View>
//           <View style={styles.vDivider} />
//           <View style={styles.balItem}>
//             <Text style={styles.balVal}>₹{group.totalExpenses.toLocaleString('en-IN')}</Text>
//             <Text style={styles.balLbl}>Total Expenses</Text>
//           </View>
//           <View style={styles.vDivider} />
//           <View style={styles.balItem}>
//             <Text style={styles.balVal}>{group.memberCount}</Text>
//             <Text style={styles.balLbl}>Members</Text>
//           </View>
//         </View>

//         {/* Member avatars */}
//         <View style={styles.membersRow}>
//           {(group.members || []).slice(0, 4).map((m) => (
//             <View key={m.id} style={[styles.memberAv, { backgroundColor: m.color }]}>
//               <Text style={styles.memberAvText}>{m.initials}</Text>
//             </View>
//           ))}
//           {group.members.length > 0 && (
//             <Text style={styles.memberNames}>
//               {group.members.map((m) => m.name.split(' ')[0]).join(', ')}
//             </Text>
//           )}
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
//         <View style={styles.body}>
//           {/* Who owes what */}
//           {group.members.length > 0 && (
//             <>
//               <Text style={styles.sectionLabel}>Who owes what</Text>
//               <View style={styles.card}>
//                 {group.members.map((m, i) => (
//                   <View key={m.id} style={[styles.memberRow, i === group.members.length - 1 && { borderBottomWidth: 0 }]}>
//                     <View style={[styles.memberAvSm, { backgroundColor: m.color }]}>
//                       <Text style={styles.memberAvSmText}>{m.initials}</Text>
//                     </View>
//                     <Text style={styles.memberRowName}>{m.name}</Text>
//                     {m.balanceType === 'settled' ? (
//                       <View style={styles.settledBadge}><Text style={styles.settledText}>Settled ✅</Text></View>
//                     ) : (
//                       <Text style={[styles.memberRowBal, {
//                         color: m.balanceType === 'owe' ? COLORS.danger : COLORS.primary
//                       }]}>
//                         {m.balanceType === 'owe' ? `Owes ₹${m.balance}` : `Gets ₹${m.balance}`}
//                       </Text>
//                     )}
//                   </View>
//                 ))}
//               </View>
//             </>
//           )}

//           {/* Expenses by month */}
//           {Object.entries(expensesByMonth).map(([month, exps]) => (
//             <View key={month}>
//               <Text style={styles.sectionLabel}>{month}</Text>
//               {exps.map((exp, i) => (
//                 <View key={i} style={styles.expCard}>
//                   <View style={[styles.expIcon, { backgroundColor: exp.iconBg }]}>
//                     <Text style={{ fontSize: 18 }}>{exp.icon}</Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.expTitle}>{exp.title}</Text>
//                     <Text style={styles.expMeta}>{exp.meta}</Text>
//                   </View>
//                   <View style={{ alignItems: 'flex-end' }}>
//                     {exp.amount === 0 ? (
//                       <Text style={[styles.expAmt, { color: COLORS.primary }]}>{exp.amountLabel}</Text>
//                     ) : (
//                       <>
//                         <Text style={[styles.expAmt, { color: exp.amount > 0 ? COLORS.primary : COLORS.danger }]}>
//                           {exp.amount > 0 ? '+' : ''}₹{Math.abs(exp.amount).toLocaleString('en-IN')}
//                         </Text>
//                         <Text style={styles.expAmtLbl}>{exp.amountLabel}</Text>
//                       </>
//                     )}
//                   </View>
//                 </View>
//               ))}
//             </View>
//           ))}

//           {group.expenses.length === 0 && (
//             <View style={styles.emptyCard}>
//               <Text style={styles.emptyText}>No expenses recorded yet</Text>
//             </View>
//           )}
//           <View style={{ height: 100 }} />
//         </View>
//       </ScrollView>

//       {/* Sticky bottom */}
//       <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 12 }]}>
//         <TouchableOpacity
//           style={styles.addExpBtn}
//           onPress={() => navigation.navigate('GroupAddExpense', { groupId: group.id })}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.addExpText}>➕ Add Expense</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.settleBtn}
//           onPress={() => navigation.navigate('Settle', { groupId: group.id })}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.settleBtnText}>💸 Settle Up</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.bg },
//   header: { paddingHorizontal: 18, paddingBottom: 20 },
//   backBtn: { marginBottom: 10 },
//   backText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: 'rgba(255,255,255,0.9)' },
//   headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
//   groupIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
//   groupName: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl3, color: '#fff' },
//   groupSub: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.base, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
//   balanceBox: {
//     flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.18)',
//     borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, marginTop: 14,
//   },
//   balItem: { flex: 1, alignItems: 'center' },
//   vDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
//   balVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl, color: '#fff' },
//   balLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
//   membersRow: { flexDirection: 'row', gap: 6, marginTop: 12, alignItems: 'center' },
//   memberAv: {
//     width: 30, height: 30, borderRadius: 15,
//     borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   memberAvText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2, color: '#fff' },
//   memberNames: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: 'rgba(255,255,255,0.7)', marginLeft: 4 },
//   scroll: { flex: 1 },
//   body: { paddingHorizontal: 14, paddingTop: 14 },
//   sectionLabel: {
//     fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2,
//     color: COLORS.text3, textTransform: 'uppercase',
//     letterSpacing: 0.5, marginBottom: 8, marginTop: 4,
//   },
//   card: { backgroundColor: COLORS.card, borderRadius: 14, padding: 12, marginBottom: 14, ...SHADOWS.card },
//   memberRow: {
//     flexDirection: 'row', alignItems: 'center', gap: 10,
//     paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border,
//   },
//   memberAvSm: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
//   memberAvSmText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base, color: '#fff' },
//   memberRowName: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.md, color: COLORS.text, flex: 1 },
//   memberRowBal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md },
//   settledBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
//   settledText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2, color: '#065F46' },
//   expCard: {
//     backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
//     marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12,
//     ...SHADOWS.card,
//   },
//   expIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
//   expTitle: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.text },
//   expMeta: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm2, color: COLORS.text2, marginTop: 2 },
//   expAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2 },
//   expAmtLbl: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.sm, color: COLORS.text3, marginTop: 2 },
//   emptyCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 20, alignItems: 'center', ...SHADOWS.card },
//   emptyText: { fontFamily: FONTS.dmSans.regular, fontSize: SIZES.md, color: COLORS.text2 },
//   stickyBottom: {
//     backgroundColor: '#fff', borderTopWidth: 1.5, borderTopColor: COLORS.border,
//     padding: 12, flexDirection: 'row', gap: 10,
//   },
//   addExpBtn: {
//     flex: 1, padding: 13, borderRadius: 14,
//     backgroundColor: COLORS.primary, alignItems: 'center',
//     flexDirection: 'row', justifyContent: 'center', gap: 6,
//   },
//   addExpText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: '#fff' },
//   settleBtn: {
//     flex: 1, padding: 13, borderRadius: 14,
//     backgroundColor: '#EDE9FE', alignItems: 'center',
//     flexDirection: 'row', justifyContent: 'center', gap: 6,
//   },
//   settleBtnText: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md2, color: COLORS.accent2 },
// });

// import React, { useState, useCallback } from "react";
// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
//     ActivityIndicator,
//     RefreshControl,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { COLORS, SHADOWS } from "../../theme/colors";
// import { FONTS, SIZES, RADIUS } from "../../theme/typography";
// import { DeleteConfirmPopup } from "../../components/shared/popups/ConfirmPopups";
// import {
//     fetchGroup,
//     settleMember,
//     deleteGroupExpense,
//     deleteGroup,
//     CATEGORY_ICONS,
//     CATEGORY_BG,
//     getMemberColor,
//     getMemberInitials,
//     isoToShort,
//     isoToMonthYear,
// } from "../../api/groups";

// export default function GroupDetailScreen({ navigation, route }) {
//     const insets = useSafeAreaInsets();
//     const { groupId, onRefresh: parentRefresh } = route.params || {};

//     const [group, setGroup] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [error, setError] = useState("");

//     // ── Settle member state ───────────────────────────────────────────────────
//     const [settleModal, setSettleModal] = useState(null); // { memberId, memberName, balance }
//     const [settleLoading, setSettleLoading] = useState(false);

//     // ── Delete expense state ──────────────────────────────────────────────────
//     const [delExpModal, setDelExpModal] = useState(null); // expenseId
//     const [delExpLoading, setDelExpLoading] = useState(false);

//     // ── Delete group state ────────────────────────────────────────────────────
//     const [delGroupModal, setDelGroupModal] = useState(false);
//     const [delGroupLoading, setDelGroupLoading] = useState(false);

//     const load = useCallback(
//         async (showRefresh = false) => {
//             if (showRefresh) setRefreshing(true);
//             else setLoading(true);
//             setError("");
//             const res = await fetchGroup(groupId);
//             if (res.ok) setGroup(res.data.group);
//             else setError(res.message);
//             setLoading(false);
//             setRefreshing(false);
//         },
//         [groupId],
//     );

//     React.useEffect(() => {
//         load();
//     }, [load]);

//     // ── Settle member ────────────────────────────────────────────────────────
//     const handleSettle = async () => {
//         if (!settleModal) return;
//         setSettleLoading(true);
//         const res = await settleMember(groupId, settleModal.memberId);
//         setSettleLoading(false);
//         setSettleModal(null);
//         if (res.ok) {
//             load();
//             if (parentRefresh) parentRefresh();
//         }
//     };

//     // ── Delete expense ───────────────────────────────────────────────────────
//     const handleDeleteExpense = async () => {
//         if (!delExpModal) return;
//         setDelExpLoading(true);
//         const res = await deleteGroupExpense(groupId, delExpModal);
//         setDelExpLoading(false);
//         setDelExpModal(null);
//         if (res.ok) load();
//     };

//     // ── Delete group ─────────────────────────────────────────────────────────
//     const handleDeleteGroup = async () => {
//         setDelGroupLoading(true);
//         const res = await deleteGroup(groupId);
//         setDelGroupLoading(false);
//         setDelGroupModal(false);
//         if (res.ok) {
//             if (parentRefresh) parentRefresh();
//             navigation.goBack();
//         }
//     };

//     // ── Loading ──────────────────────────────────────────────────────────────
//     if (loading)
//         return (
//             <View
//                 style={[
//                     s.container,
//                     { alignItems: "center", justifyContent: "center" },
//                 ]}
//             >
//                 <ActivityIndicator size="large" color={COLORS.accent2} />
//             </View>
//         );

//     if (error || !group)
//         return (
//             <View
//                 style={[
//                     s.container,
//                     {
//                         alignItems: "center",
//                         justifyContent: "center",
//                         padding: 24,
//                     },
//                 ]}
//             >
//                 <Text style={{ fontSize: 36 }}>⚠️</Text>
//                 <Text style={s.errTxt}>{error || "Group not found"}</Text>
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={s.errBack}
//                 >
//                     <Text style={s.errBackTxt}>← Go Back</Text>
//                 </TouchableOpacity>
//             </View>
//         );

//     const myBalance = group.myBalance || 0;
//     const members = group.members || [];
//     const expenses = group.expenses || [];
//     const totalExp = group.totalExpenses || 0;
//     const myBalAbs = Math.abs(myBalance);
//     const myBalColor =
//         myBalance < -0.005 ? "#FCA5A5" : myBalance > 0.005 ? "#A7F3D0" : "#fff";
//     const myBalLbl =
//         myBalance < -0.005
//             ? "You Owe"
//             : myBalance > 0.005
//               ? "Owed to You"
//               : "Settled ✅";

//     // Group expenses by month
//     const byMonth = {};
//     expenses.forEach((exp) => {
//         const key = isoToMonthYear(exp.date) || "Other";
//         if (!byMonth[key]) byMonth[key] = [];
//         byMonth[key].push(exp);
//     });

//     return (
//         <View style={s.container}>
//             {/* ── Header ── */}
//             <LinearGradient
//                 colors={["#1e3a5f", COLORS.accent2]}
//                 start={{ x: 0.13, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={[s.header, { paddingTop: insets.top + 6 }]}
//             >
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={s.backBtn}
//                 >
//                     <Text style={s.backText}>← Back</Text>
//                 </TouchableOpacity>

//                 <View style={s.headerContent}>
//                     <View style={s.groupIconWrap}>
//                         <Text style={{ fontSize: 26 }}>
//                             {group.icon || "👥"}
//                         </Text>
//                     </View>
//                     <View style={{ flex: 1 }}>
//                         <Text style={s.groupName}>{group.name}</Text>
//                         <Text style={s.groupSub}>
//                             {members.length} members · {expenses.length}{" "}
//                             expenses
//                         </Text>
//                     </View>
//                 </View>

//                 {/* Balance box */}
//                 <View style={s.balanceBox}>
//                     <View style={s.balItem}>
//                         <Text style={[s.balVal, { color: myBalColor }]}>
//                             {myBalAbs > 0
//                                 ? `₹${myBalAbs.toLocaleString("en-IN")}`
//                                 : "₹0"}
//                         </Text>
//                         <Text style={s.balLbl}>{myBalLbl}</Text>
//                     </View>
//                     <View style={s.vDiv} />
//                     <View style={s.balItem}>
//                         <Text style={s.balVal}>
//                             ₹{totalExp.toLocaleString("en-IN")}
//                         </Text>
//                         <Text style={s.balLbl}>Total Expenses</Text>
//                     </View>
//                     <View style={s.vDiv} />
//                     <View style={s.balItem}>
//                         <Text style={s.balVal}>{members.length}</Text>
//                         <Text style={s.balLbl}>Members</Text>
//                     </View>
//                 </View>

//                 {/* Member avatar row */}
//                 <View style={s.membersRow}>
//                     {members.slice(0, 5).map((m, i) => {
//                         const nm = m.user?.name || m.name || "?";
//                         return (
//                             <View
//                                 key={m._id || i}
//                                 style={[
//                                     s.memberAv,
//                                     {
//                                         backgroundColor: getMemberColor(nm),
//                                         marginLeft: i > 0 ? -8 : 0,
//                                     },
//                                 ]}
//                             >
//                                 <Text style={s.memberAvTxt}>
//                                     {getMemberInitials(nm)}
//                                 </Text>
//                             </View>
//                         );
//                     })}
//                     <Text style={s.memberNames} numberOfLines={1}>
//                         {members
//                             .slice(0, 3)
//                             .map(
//                                 (m) =>
//                                     (m.user?.name || m.name || "?").split(
//                                         " ",
//                                     )[0],
//                             )
//                             .join(", ")}
//                         {members.length > 3 ? ` +${members.length - 3}` : ""}
//                     </Text>
//                 </View>
//             </LinearGradient>

//             <ScrollView
//                 style={s.scroll}
//                 showsVerticalScrollIndicator={false}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={() => load(true)}
//                         tintColor={COLORS.accent2}
//                     />
//                 }
//             >
//                 <View style={s.body}>
//                     {/* ── Who owes what ── */}
//                     <Text style={s.secLabel}>Who owes what</Text>
//                     <View style={s.card}>
//                         {members.map((m, i) => {
//                             const nm = m.user?.name || m.name || "Unknown";
//                             const bal = m.balance || 0;
//                             const isLast = i === members.length - 1;
//                             const settled = Math.abs(bal) < 0.005;
//                             const owesMoney = bal < -0.005;

//                             return (
//                                 <View
//                                     key={m._id || i}
//                                     style={[
//                                         s.memberRow,
//                                         isLast && { borderBottomWidth: 0 },
//                                     ]}
//                                 >
//                                     <View
//                                         style={[
//                                             s.memberAvSm,
//                                             {
//                                                 backgroundColor:
//                                                     getMemberColor(nm),
//                                             },
//                                         ]}
//                                     >
//                                         <Text style={s.memberAvSmTxt}>
//                                             {getMemberInitials(nm)}
//                                         </Text>
//                                     </View>
//                                     <View style={{ flex: 1 }}>
//                                         <Text style={s.memberRowName}>
//                                             {nm}
//                                         </Text>
//                                         {m.role === "admin" && (
//                                             <Text style={s.adminBadge}>
//                                                 Admin
//                                             </Text>
//                                         )}
//                                     </View>
//                                     {settled ? (
//                                         <View style={s.settledBadge}>
//                                             <Text style={s.settledTxt}>
//                                                 Settled ✅
//                                             </Text>
//                                         </View>
//                                     ) : (
//                                         <View
//                                             style={{
//                                                 alignItems: "flex-end",
//                                                 gap: 4,
//                                             }}
//                                         >
//                                             <Text
//                                                 style={[
//                                                     s.memberBal,
//                                                     {
//                                                         color: owesMoney
//                                                             ? COLORS.danger
//                                                             : COLORS.primary,
//                                                     },
//                                                 ]}
//                                             >
//                                                 {owesMoney
//                                                     ? `Owes ₹${Math.abs(bal).toLocaleString("en-IN")}`
//                                                     : `Gets ₹${bal.toLocaleString("en-IN")}`}
//                                             </Text>
//                                             {!settled && (
//                                                 <TouchableOpacity
//                                                     onPress={() =>
//                                                         setSettleModal({
//                                                             memberId: m._id,
//                                                             memberName: nm,
//                                                             balance: bal,
//                                                         })
//                                                     }
//                                                     style={s.settleSmBtn}
//                                                     activeOpacity={0.8}
//                                                 >
//                                                     <Text
//                                                         style={s.settleSmBtnTxt}
//                                                     >
//                                                         Settle
//                                                     </Text>
//                                                 </TouchableOpacity>
//                                             )}
//                                         </View>
//                                     )}
//                                 </View>
//                             );
//                         })}
//                     </View>

//                     {/* ── Expenses by month ── */}
//                     {Object.keys(byMonth).length === 0 ? (
//                         <View
//                             style={[
//                                 s.card,
//                                 { alignItems: "center", padding: 24, gap: 6 },
//                             ]}
//                         >
//                             <Text style={{ fontSize: 32 }}>🧾</Text>
//                             <Text
//                                 style={{
//                                     fontFamily: FONTS.nunito.bold,
//                                     fontSize: SIZES.md2,
//                                     color: COLORS.text,
//                                 }}
//                             >
//                                 No expenses yet
//                             </Text>
//                             <Text
//                                 style={{
//                                     fontFamily: FONTS.dmSans.regular,
//                                     fontSize: SIZES.base,
//                                     color: COLORS.text2,
//                                     textAlign: "center",
//                                 }}
//                             >
//                                 Tap "Add Expense" below to record the first
//                                 shared expense.
//                             </Text>
//                         </View>
//                     ) : (
//                         Object.entries(byMonth).map(([month, exps]) => (
//                             <View key={month}>
//                                 <Text style={s.secLabel}>{month}</Text>
//                                 {exps.map((exp, i) => {
//                                     const icon =
//                                         exp.icon ||
//                                         CATEGORY_ICONS[exp.category] ||
//                                         "➕";
//                                     const iconBg =
//                                         CATEGORY_BG[exp.category] || "#F3F4F6";
//                                     const paidBy =
//                                         exp.paidBy?.name || "Unknown";
//                                     const split = exp.splits?.find(
//                                         (sp) => sp.settled === false,
//                                     );

//                                     return (
//                                         <TouchableOpacity
//                                             key={exp._id}
//                                             style={s.expCard}
//                                             onLongPress={() =>
//                                                 setDelExpModal(exp._id)
//                                             }
//                                             delayLongPress={500}
//                                             activeOpacity={0.85}
//                                         >
//                                             <View
//                                                 style={[
//                                                     s.expIcon,
//                                                     { backgroundColor: iconBg },
//                                                 ]}
//                                             >
//                                                 <Text style={{ fontSize: 18 }}>
//                                                     {icon}
//                                                 </Text>
//                                             </View>
//                                             <View style={{ flex: 1 }}>
//                                                 <Text style={s.expTitle}>
//                                                     {exp.description}
//                                                 </Text>
//                                                 <Text style={s.expMeta}>
//                                                     {isoToShort(exp.date)} ·{" "}
//                                                     {paidBy} paid
//                                                 </Text>
//                                             </View>
//                                             <View
//                                                 style={{
//                                                     alignItems: "flex-end",
//                                                 }}
//                                             >
//                                                 <Text style={s.expAmt}>
//                                                     ₹
//                                                     {exp.amount.toLocaleString(
//                                                         "en-IN",
//                                                     )}
//                                                 </Text>
//                                                 <Text style={s.expAmtLbl}>
//                                                     Your share
//                                                 </Text>
//                                             </View>
//                                         </TouchableOpacity>
//                                     );
//                                 })}
//                             </View>
//                         ))
//                     )}

//                     {/* ── Danger zone ── */}
//                     <TouchableOpacity
//                         onPress={() => setDelGroupModal(true)}
//                         style={s.deleteGroupBtn}
//                         activeOpacity={0.8}
//                     >
//                         <Text style={s.deleteGroupTxt}>🗑 Archive Group</Text>
//                     </TouchableOpacity>

//                     <View style={{ height: 110 }} />
//                 </View>
//             </ScrollView>

//             {/* ── Sticky bottom ── */}
//             <View
//                 style={[s.stickyBottom, { paddingBottom: insets.bottom + 12 }]}
//             >
//                 <TouchableOpacity
//                     style={s.addExpBtn}
//                     onPress={() =>
//                         navigation.navigate("GroupAddExpense", {
//                             groupId: group._id,
//                             groupName: group.name,
//                             members,
//                             onAdded: () => load(),
//                         })
//                     }
//                     activeOpacity={0.85}
//                 >
//                     <Text style={s.addExpTxt}>➕ Add Expense</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={s.settleAllBtn} activeOpacity={0.85}>
//                     <Text style={s.settleAllTxt}>💸 Settle Up</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* ══ MODALS ══ */}

//             {/* Settle member */}
//             <DeleteConfirmPopup
//                 visible={!!settleModal}
//                 onClose={() => setSettleModal(null)}
//                 type="payment"
//                 name={settleModal?.memberName}
//                 onConfirm={handleSettle}
//                 loading={settleLoading}
//             />

//             {/* Delete expense */}
//             <DeleteConfirmPopup
//                 visible={!!delExpModal}
//                 onClose={() => setDelExpModal(null)}
//                 type="payment"
//                 onConfirm={handleDeleteExpense}
//                 loading={delExpLoading}
//             />

//             {/* Archive group */}
//             <DeleteConfirmPopup
//                 visible={delGroupModal}
//                 onClose={() => setDelGroupModal(false)}
//                 type="project"
//                 name={group.name}
//                 onConfirm={handleDeleteGroup}
//                 loading={delGroupLoading}
//             />
//         </View>
//     );
// }

// const s = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },
//     header: { paddingHorizontal: 18, paddingBottom: 20 },
//     backBtn: { marginBottom: 10 },
//     backText: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.md,
//         color: "rgba(255,255,255,0.9)",
//     },
//     headerContent: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 12,
//         marginTop: 6,
//     },
//     groupIconWrap: {
//         width: 52,
//         height: 52,
//         borderRadius: 16,
//         backgroundColor: "rgba(255,255,255,0.2)",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     groupName: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.xl3,
//         color: "#fff",
//     },
//     groupSub: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.base,
//         color: "rgba(255,255,255,0.7)",
//         marginTop: 2,
//     },
//     balanceBox: {
//         flexDirection: "row",
//         backgroundColor: "rgba(0,0,0,0.18)",
//         borderRadius: 14,
//         paddingVertical: 12,
//         paddingHorizontal: 14,
//         marginTop: 14,
//     },
//     balItem: { flex: 1, alignItems: "center" },
//     vDiv: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" },
//     balVal: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.xl,
//         color: "#fff",
//     },
//     balLbl: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm,
//         color: "rgba(255,255,255,0.65)",
//         marginTop: 2,
//     },
//     membersRow: {
//         flexDirection: "row",
//         gap: 0,
//         marginTop: 12,
//         alignItems: "center",
//     },
//     memberAv: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         borderWidth: 2,
//         borderColor: "rgba(255,255,255,0.4)",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     memberAvTxt: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.sm,
//         color: "#fff",
//     },
//     memberNames: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm2,
//         color: "rgba(255,255,255,0.7)",
//         marginLeft: 10,
//         flex: 1,
//     },
//     scroll: { flex: 1 },
//     body: { paddingHorizontal: 14, paddingTop: 14 },
//     secLabel: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.sm2,
//         color: COLORS.text3,
//         textTransform: "uppercase",
//         letterSpacing: 0.5,
//         marginBottom: 8,
//         marginTop: 4,
//     },
//     card: {
//         backgroundColor: COLORS.card,
//         borderRadius: 14,
//         padding: 12,
//         marginBottom: 14,
//         ...SHADOWS.card,
//     },
//     memberRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 10,
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: COLORS.border,
//     },
//     memberAvSm: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     memberAvSmTxt: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.base,
//         color: "#fff",
//     },
//     memberRowName: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.md,
//         color: COLORS.text,
//     },
//     adminBadge: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.sm,
//         color: COLORS.accent2,
//     },
//     memberBal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.md },
//     settleSmBtn: {
//         backgroundColor: COLORS.primaryUltraLight,
//         paddingHorizontal: 8,
//         paddingVertical: 3,
//         borderRadius: 8,
//     },
//     settleSmBtnTxt: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.sm2,
//         color: COLORS.primary,
//     },
//     settledBadge: {
//         backgroundColor: "#D1FAE5",
//         paddingHorizontal: 8,
//         paddingVertical: 3,
//         borderRadius: 8,
//     },
//     settledTxt: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.sm2,
//         color: "#065F46",
//     },
//     expCard: {
//         backgroundColor: COLORS.card,
//         borderRadius: 14,
//         padding: 14,
//         marginBottom: 10,
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 12,
//         ...SHADOWS.card,
//     },
//     expIcon: {
//         width: 38,
//         height: 38,
//         borderRadius: 19,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     expTitle: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md2,
//         color: COLORS.text,
//     },
//     expMeta: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm2,
//         color: COLORS.text2,
//         marginTop: 2,
//     },
//     expAmt: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.md2,
//         color: COLORS.text,
//     },
//     expAmtLbl: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm,
//         color: COLORS.text3,
//         marginTop: 2,
//     },
//     deleteGroupBtn: {
//         borderWidth: 1,
//         borderColor: COLORS.danger,
//         borderRadius: 12,
//         padding: 12,
//         alignItems: "center",
//         marginTop: 8,
//         backgroundColor: "#FEF2F2",
//     },
//     deleteGroupTxt: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.md,
//         color: COLORS.danger,
//     },
//     stickyBottom: {
//         backgroundColor: "#fff",
//         borderTopWidth: 1.5,
//         borderTopColor: COLORS.border,
//         padding: 12,
//         flexDirection: "row",
//         gap: 10,
//     },
//     addExpBtn: {
//         flex: 1,
//         padding: 13,
//         borderRadius: 14,
//         backgroundColor: COLORS.primary,
//         alignItems: "center",
//         flexDirection: "row",
//         justifyContent: "center",
//         gap: 6,
//     },
//     addExpTxt: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md2,
//         color: "#fff",
//     },
//     settleAllBtn: {
//         flex: 1,
//         padding: 13,
//         borderRadius: 14,
//         backgroundColor: "#EDE9FE",
//         alignItems: "center",
//         flexDirection: "row",
//         justifyContent: "center",
//         gap: 6,
//     },
//     settleAllTxt: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md2,
//         color: COLORS.accent2,
//     },
//     errTxt: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.lg2,
//         color: COLORS.text,
//         marginTop: 8,
//         textAlign: "center",
//     },
//     errBack: {
//         marginTop: 16,
//         backgroundColor: COLORS.primary,
//         borderRadius: 10,
//         paddingVertical: 10,
//         paddingHorizontal: 24,
//     },
//     errBackTxt: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.md,
//         color: "#fff",
//     },
// });

import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Modal,
    TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import { DeleteConfirmPopup } from "../../components/shared/popups/ConfirmPopups";
import {
    fetchGroup,
    settleMember,
    deleteGroupExpense,
    deleteGroup,
    updateGroup,
    addMember,
    removeMember,
    CATEGORY_ICONS,
    CATEGORY_BG,
    getMemberColor,
    getMemberInitials,
    isoToShort,
    isoToMonthYear,
} from "../../api/groups";

// ─── Mini Input ───────────────────────────────────────────────────────────────
function SheetInput({ value, onChangeText, placeholder, keyboardType }) {
    return (
        <TextInput
            style={sh.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.text3}
            keyboardType={keyboardType}
            autoCapitalize="none"
        />
    );
}

// ─── Bottom Sheet wrapper ─────────────────────────────────────────────────────
function BottomSheet({ visible, onClose, children }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={sh.sheetOverlay}
                activeOpacity={1}
                onPress={onClose}
            />
            <View style={sh.sheet}>{children}</View>
        </Modal>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  EDIT GROUP SHEET
// ══════════════════════════════════════════════════════════════════════════════
function EditGroupSheet({ visible, onClose, group, onSaved }) {
    const [name, setName] = useState(group?.name || "");
    const [icon, setIcon] = useState(group?.icon || "👥");
    const [type, setType] = useState(group?.type || "other");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // sync when group changes
    React.useEffect(() => {
        if (group) {
            setName(group.name);
            setIcon(group.icon || "👥");
            setType(group.type || "other");
        }
        setError("");
    }, [group, visible]);

    const ICONS = ["🏠", "✈️", "🎉", "💼", "🍺", "🏖️", "👥", "🎓"];
    const TYPES = [
        { id: "home", label: "🏠 Home" },
        { id: "trip", label: "✈️ Trip" },
        { id: "work", label: "💼 Work" },
        { id: "other", label: "🎉 Other" },
    ];

    const handleSave = async () => {
        setError("");
        if (!name.trim()) {
            setError("Group name is required.");
            return;
        }
        setLoading(true);
        const res = await updateGroup(group._id, {
            name: name.trim(),
            icon,
            type,
        });
        setLoading(false);
        if (res.ok) {
            onSaved();
            onClose();
        } else setError(res.message);
    };

    return (
        <BottomSheet visible={visible} onClose={onClose}>
            {/* Handle */}
            <View style={sh.handleRow}>
                <View style={sh.handle} />
            </View>
            <Text style={sh.sheetTitle}>✏️ Edit Group</Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ paddingHorizontal: 18 }}
            >
                {!!error && (
                    <View style={sh.errBox}>
                        <Text style={sh.errTxt}>⚠️ {error}</Text>
                    </View>
                )}

                {/* Name */}
                <Text style={sh.fieldLabel}>Group Name</Text>
                <SheetInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Flat Koramangala"
                />

                {/* Icon picker */}
                <Text style={sh.fieldLabel}>Icon</Text>
                <View style={sh.iconRow}>
                    {ICONS.map((ic) => (
                        <TouchableOpacity
                            key={ic}
                            onPress={() => setIcon(ic)}
                            style={[
                                sh.iconOpt,
                                icon === ic && sh.iconOptActive,
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text style={{ fontSize: 20 }}>{ic}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Type picker */}
                <Text style={sh.fieldLabel}>Type</Text>
                <View style={sh.typeRow}>
                    {TYPES.map((t) => (
                        <TouchableOpacity
                            key={t.id}
                            onPress={() => setType(t.id)}
                            style={[
                                sh.typeOpt,
                                type === t.id && sh.typeOptActive,
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    sh.typeOptTxt,
                                    type === t.id && { color: COLORS.primary },
                                ]}
                            >
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>

            <View style={sh.sheetBottom}>
                <TouchableOpacity
                    onPress={onClose}
                    style={sh.cancelBtn}
                    activeOpacity={0.8}
                >
                    <Text style={sh.cancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[sh.saveBtn, loading && { opacity: 0.65 }]}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={sh.saveTxt}>💾 Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ADD MEMBER SHEET
// ══════════════════════════════════════════════════════════════════════════════
function AddMemberSheet({ visible, onClose, groupId, onAdded }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const reset = () => {
        setName("");
        setPhone("");
        setError("");
    };

    React.useEffect(() => {
        if (visible) reset();
    }, [visible]);

    const handleAdd = async () => {
        setError("");
        if (!name.trim()) {
            setError("Member name is required.");
            return;
        }
        setLoading(true);
        const res = await addMember(groupId, {
            name: name.trim(),
            phone: phone.trim() || undefined,
        });
        setLoading(false);
        if (res.ok) {
            onAdded();
            onClose();
            reset();
        } else setError(res.message);
    };

    return (
        <BottomSheet visible={visible} onClose={onClose}>
            <View style={sh.handleRow}>
                <View style={sh.handle} />
            </View>
            <Text style={sh.sheetTitle}>🤝 Add Member</Text>

            <View style={{ paddingHorizontal: 18 }}>
                {!!error && (
                    <View style={sh.errBox}>
                        <Text style={sh.errTxt}>⚠️ {error}</Text>
                    </View>
                )}

                <Text style={sh.fieldLabel}>Full Name *</Text>
                <SheetInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Priya Kapoor"
                />

                <Text style={sh.fieldLabel}>Phone (optional)</Text>
                <SheetInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 XXXXX XXXXX"
                    keyboardType="phone-pad"
                />

                <View style={sh.infoBox}>
                    <Text style={sh.infoTxt}>
                        💡 If this person is on Hisaab, they will be able to see
                        this group once they log in.
                    </Text>
                </View>
            </View>

            <View style={sh.sheetBottom}>
                <TouchableOpacity
                    onPress={onClose}
                    style={sh.cancelBtn}
                    activeOpacity={0.8}
                >
                    <Text style={sh.cancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleAdd}
                    style={[sh.saveBtn, loading && { opacity: 0.65 }]}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={sh.saveTxt}>✅ Add Member</Text>
                    )}
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  SETTLE MEMBER SHEET
// ══════════════════════════════════════════════════════════════════════════════
function SettleMemberSheet({ visible, onClose, member, groupId, onSettled }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (visible) setError("");
    }, [visible]);

    if (!member) return null;

    const name = member.user?.name || member.name || "Member";
    const balance = member.balance || 0;
    const absbal = Math.abs(balance);
    const owesMoney = balance < -0.005; // negative = owes money

    const handleSettle = async () => {
        setLoading(true);
        const res = await settleMember(groupId, member._id);
        setLoading(false);
        if (res.ok) {
            onSettled();
            onClose();
        } else setError(res.message);
    };

    return (
        <BottomSheet visible={visible} onClose={onClose}>
            <View style={sh.handleRow}>
                <View style={sh.handle} />
            </View>
            <Text style={sh.sheetTitle}>💸 Settle Up</Text>

            <View style={{ paddingHorizontal: 18 }}>
                {!!error && (
                    <View style={sh.errBox}>
                        <Text style={sh.errTxt}>⚠️ {error}</Text>
                    </View>
                )}

                {/* Member card */}
                <View style={sh.settleCard}>
                    <View
                        style={[
                            sh.settleAv,
                            { backgroundColor: getMemberColor(name) },
                        ]}
                    >
                        <Text style={sh.settleAvTxt}>
                            {getMemberInitials(name)}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={sh.settleName}>{name}</Text>
                        <Text
                            style={[
                                sh.settleBalLbl,
                                {
                                    color: owesMoney
                                        ? COLORS.danger
                                        : COLORS.primary,
                                },
                            ]}
                        >
                            {owesMoney ? "Owes" : "Is owed"}
                        </Text>
                    </View>
                    <Text
                        style={[
                            sh.settleAmt,
                            {
                                color: owesMoney
                                    ? COLORS.danger
                                    : COLORS.primary,
                            },
                        ]}
                    >
                        ₹{absbal.toLocaleString("en-IN")}
                    </Text>
                </View>

                {/* What will happen */}
                <View style={sh.settlePreview}>
                    <Text style={sh.settlePreviewTitle}>
                        What happens when you settle:
                    </Text>
                    <View style={sh.settlePreviewRow}>
                        <Text style={sh.settlePreviewDot}>•</Text>
                        <Text style={sh.settlePreviewTxt}>
                            {owesMoney
                                ? `${name}'s balance will go from −₹${absbal.toLocaleString("en-IN")} → ₹0`
                                : `${name}'s balance will go from +₹${absbal.toLocaleString("en-IN")} → ₹0`}
                        </Text>
                    </View>
                    <View style={sh.settlePreviewRow}>
                        <Text style={sh.settlePreviewDot}>•</Text>
                        <Text style={sh.settlePreviewTxt}>
                            All their expense splits will be marked as settled.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={sh.sheetBottom}>
                <TouchableOpacity
                    onPress={onClose}
                    style={sh.cancelBtn}
                    activeOpacity={0.8}
                >
                    <Text style={sh.cancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSettle}
                    style={[
                        sh.saveBtn,
                        { backgroundColor: COLORS.accent2 },
                        loading && { opacity: 0.65 },
                    ]}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={sh.saveTxt}>✅ Mark as Settled</Text>
                    )}
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  REMOVE MEMBER CONFIRMATION SHEET
// ══════════════════════════════════════════════════════════════════════════════
function RemoveMemberSheet({ visible, onClose, member, groupId, onRemoved }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (visible) setError("");
    }, [visible]);

    if (!member) return null;
    const name = member.user?.name || member.name || "Member";

    const handleRemove = async () => {
        setLoading(true);
        const res = await removeMember(groupId, member._id);
        setLoading(false);
        if (res.ok) {
            onRemoved();
            onClose();
        } else setError(res.message);
    };

    return (
        <BottomSheet visible={visible} onClose={onClose}>
            <View style={sh.handleRow}>
                <View style={sh.handle} />
            </View>

            <View
                style={{
                    paddingHorizontal: 18,
                    alignItems: "center",
                    paddingBottom: 8,
                }}
            >
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🗑️</Text>
                <Text style={sh.sheetTitle}>Remove Member?</Text>
                <Text
                    style={{
                        fontFamily: FONTS.dmSans.regular,
                        fontSize: SIZES.md,
                        color: COLORS.text2,
                        textAlign: "center",
                        marginBottom: 16,
                        lineHeight: 22,
                    }}
                >
                    Remove{" "}
                    <Text
                        style={{
                            fontFamily: FONTS.nunito.bold,
                            color: COLORS.text,
                        }}
                    >
                        {name}
                    </Text>{" "}
                    from this group?{"\n"}
                    This is blocked if they have an unsettled balance.
                </Text>
                {!!error && (
                    <View style={[sh.errBox, { width: "100%" }]}>
                        <Text style={sh.errTxt}>⚠️ {error}</Text>
                    </View>
                )}
            </View>

            <View style={sh.sheetBottom}>
                <TouchableOpacity
                    onPress={onClose}
                    style={sh.cancelBtn}
                    activeOpacity={0.8}
                >
                    <Text style={sh.cancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleRemove}
                    style={[
                        sh.saveBtn,
                        { backgroundColor: COLORS.danger },
                        loading && { opacity: 0.65 },
                    ]}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={sh.saveTxt}>Remove</Text>
                    )}
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════
export default function GroupDetailScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { groupId, onRefresh: parentRefresh } = route.params || {};

    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // ── Sheet visibility ──────────────────────────────────────────────────────
    const [editSheet, setEditSheet] = useState(false);
    const [addMemberSheet, setAddMemberSheet] = useState(false);
    const [settleSheet, setSettleSheet] = useState(null); // member object
    const [removeMemberSheet, setRemoveMemberSheet] = useState(null); // member object

    // ── Delete expense / archive group ────────────────────────────────────────
    const [delExpModal, setDelExpModal] = useState(null); // expenseId
    const [delExpLoading, setDelExpLoading] = useState(false);
    const [delGroupModal, setDelGroupModal] = useState(false);
    const [delGroupLoading, setDelGroupLoading] = useState(false);

    const load = useCallback(
        async (showRefresh = false) => {
            if (showRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");
            const res = await fetchGroup(groupId);
            if (res.ok) setGroup(res.data.group);
            else setError(res.message);
            setLoading(false);
            setRefreshing(false);
        },
        [groupId],
    );

    React.useEffect(() => {
        load();
    }, [load]);

    const refresh = () => {
        load();
        if (parentRefresh) parentRefresh();
    };

    // ── Delete expense ────────────────────────────────────────────────────────
    const handleDeleteExpense = async () => {
        if (!delExpModal) return;
        setDelExpLoading(true);
        const res = await deleteGroupExpense(groupId, delExpModal);
        setDelExpLoading(false);
        setDelExpModal(null);
        if (res.ok) load();
    };

    // ── Archive group ─────────────────────────────────────────────────────────
    const handleDeleteGroup = async () => {
        setDelGroupLoading(true);
        const res = await deleteGroup(groupId);
        setDelGroupLoading(false);
        setDelGroupModal(false);
        if (res.ok) {
            if (parentRefresh) parentRefresh();
            navigation.goBack();
        }
    };

    // ─── Loading / Error ──────────────────────────────────────────────────────
    if (loading)
        return (
            <View
                style={[
                    s.container,
                    { alignItems: "center", justifyContent: "center" },
                ]}
            >
                <ActivityIndicator size="large" color={COLORS.accent2} />
            </View>
        );

    if (error || !group)
        return (
            <View
                style={[
                    s.container,
                    {
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 24,
                    },
                ]}
            >
                <Text style={{ fontSize: 36 }}>⚠️</Text>
                <Text style={s.errTxt}>{error || "Group not found"}</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={s.errBack}
                >
                    <Text style={s.errBackTxt}>← Go Back</Text>
                </TouchableOpacity>
            </View>
        );

    const members = group.members || [];
    const expenses = group.expenses || [];
    const totalExp = group.totalExpenses || 0;
    const myBal = group.myBalance || 0;
    const myBalAbs = Math.abs(myBal);
    const myBalColor =
        myBal < -0.005 ? "#FCA5A5" : myBal > 0.005 ? "#A7F3D0" : "#fff";
    const myBalLbl =
        myBal < -0.005
            ? "You Owe"
            : myBal > 0.005
              ? "Owed to You"
              : "Settled ✅";

    // Group expenses by month
    const byMonth = {};
    expenses.forEach((exp) => {
        const key = isoToMonthYear(exp.date) || "Other";
        if (!byMonth[key]) byMonth[key] = [];
        byMonth[key].push(exp);
    });

    return (
        <View style={s.container}>
            {/* ── Header ── */}
            <LinearGradient
                colors={["#1e3a5f", COLORS.accent2]}
                start={{ x: 0.13, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[s.header, { paddingTop: insets.top + 6 }]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={s.backBtn}
                >
                    <Text style={s.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={s.headerContent}>
                    <View style={s.groupIconWrap}>
                        <Text style={{ fontSize: 26 }}>
                            {group.icon || "👥"}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.groupName}>{group.name}</Text>
                        <Text style={s.groupSub}>
                            {members.length} members · {expenses.length}{" "}
                            expenses
                        </Text>
                    </View>
                    {/* Edit button */}
                    <TouchableOpacity
                        onPress={() => setEditSheet(true)}
                        style={s.editIconBtn}
                        activeOpacity={0.8}
                    >
                        <Text style={{ fontSize: 16 }}>✏️</Text>
                    </TouchableOpacity>
                </View>

                {/* Balance box */}
                <View style={s.balanceBox}>
                    <View style={s.balItem}>
                        <Text style={[s.balVal, { color: myBalColor }]}>
                            {myBalAbs > 0
                                ? `₹${myBalAbs.toLocaleString("en-IN")}`
                                : "₹0"}
                        </Text>
                        <Text style={s.balLbl}>{myBalLbl}</Text>
                    </View>
                    <View style={s.vDiv} />
                    <View style={s.balItem}>
                        <Text style={s.balVal}>
                            ₹{totalExp.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.balLbl}>Total Expenses</Text>
                    </View>
                    <View style={s.vDiv} />
                    <View style={s.balItem}>
                        <Text style={s.balVal}>{members.length}</Text>
                        <Text style={s.balLbl}>Members</Text>
                    </View>
                </View>

                {/* Member avatars */}
                <View style={s.membersRow}>
                    {members.slice(0, 5).map((m, i) => {
                        const nm = m.user?.name || m.name || "?";
                        return (
                            <View
                                key={m._id || i}
                                style={[
                                    s.memberAv,
                                    {
                                        backgroundColor: getMemberColor(nm),
                                        marginLeft: i > 0 ? -8 : 0,
                                    },
                                ]}
                            >
                                <Text style={s.memberAvTxt}>
                                    {getMemberInitials(nm)}
                                </Text>
                            </View>
                        );
                    })}
                    <Text style={s.memberNames} numberOfLines={1}>
                        {members
                            .slice(0, 3)
                            .map(
                                (m) =>
                                    (m.user?.name || m.name || "?").split(
                                        " ",
                                    )[0],
                            )
                            .join(", ")}
                        {members.length > 3 ? ` +${members.length - 3}` : ""}
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={s.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => load(true)}
                        tintColor={COLORS.accent2}
                    />
                }
            >
                <View style={s.body}>
                    {/* ── Members section ── */}
                    <View style={s.sectionHeader}>
                        <Text style={s.secLabel}>👥 Members</Text>
                        <TouchableOpacity
                            onPress={() => setAddMemberSheet(true)}
                            style={s.addMemberBtn}
                            activeOpacity={0.8}
                        >
                            <Text style={s.addMemberBtnTxt}>+ Add</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={s.card}>
                        {members.map((m, i) => {
                            const nm = m.user?.name || m.name || "Unknown";
                            const bal = m.balance || 0;
                            const isLast = i === members.length - 1;
                            const settled = Math.abs(bal) < 0.005;
                            const owesMoney = bal < -0.005;

                            return (
                                <View
                                    key={m._id || i}
                                    style={[
                                        s.memberRow,
                                        isLast && { borderBottomWidth: 0 },
                                    ]}
                                >
                                    {/* Avatar */}
                                    <View
                                        style={[
                                            s.memberAvSm,
                                            {
                                                backgroundColor:
                                                    getMemberColor(nm),
                                            },
                                        ]}
                                    >
                                        <Text style={s.memberAvSmTxt}>
                                            {getMemberInitials(nm)}
                                        </Text>
                                    </View>

                                    {/* Name + role */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.memberRowName}>
                                            {nm}
                                        </Text>
                                        {m.role === "admin" && (
                                            <View style={s.adminPill}>
                                                <Text style={s.adminPillTxt}>
                                                    Admin
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Balance + actions */}
                                    <View
                                        style={{
                                            alignItems: "flex-end",
                                            gap: 5,
                                        }}
                                    >
                                        {settled ? (
                                            <View style={s.settledBadge}>
                                                <Text style={s.settledTxt}>
                                                    Settled ✅
                                                </Text>
                                            </View>
                                        ) : (
                                            <Text
                                                style={[
                                                    s.memberBal,
                                                    {
                                                        color: owesMoney
                                                            ? COLORS.danger
                                                            : COLORS.primary,
                                                    },
                                                ]}
                                            >
                                                {owesMoney
                                                    ? `Owes ₹${Math.abs(bal).toLocaleString("en-IN")}`
                                                    : `Gets ₹${bal.toLocaleString("en-IN")}`}
                                            </Text>
                                        )}

                                        {/* Action buttons row */}
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: 5,
                                            }}
                                        >
                                            {!settled && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setSettleSheet(m)
                                                    }
                                                    style={s.memberActionBtn}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text
                                                        style={
                                                            s.memberActionBtnTxt
                                                        }
                                                    >
                                                        💸 Settle
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setRemoveMemberSheet(m)
                                                }
                                                style={[
                                                    s.memberActionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#FEE2E2",
                                                    },
                                                ]}
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.memberActionBtnTxt,
                                                        {
                                                            color: COLORS.danger,
                                                        },
                                                    ]}
                                                >
                                                    🗑
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* ── Expenses by month ── */}
                    <Text style={[s.secLabel, { marginTop: 6 }]}>
                        🧾 Expenses
                    </Text>

                    {Object.keys(byMonth).length === 0 ? (
                        <View
                            style={[
                                s.card,
                                { alignItems: "center", padding: 24, gap: 6 },
                            ]}
                        >
                            <Text style={{ fontSize: 32 }}>🧾</Text>
                            <Text
                                style={{
                                    fontFamily: FONTS.nunito.bold,
                                    fontSize: SIZES.md2,
                                    color: COLORS.text,
                                }}
                            >
                                No expenses yet
                            </Text>
                            <Text
                                style={{
                                    fontFamily: FONTS.dmSans.regular,
                                    fontSize: SIZES.base,
                                    color: COLORS.text2,
                                    textAlign: "center",
                                }}
                            >
                                Tap "Add Expense" below to record the first
                                shared expense.
                            </Text>
                        </View>
                    ) : (
                        Object.entries(byMonth).map(([month, exps]) => (
                            <View key={month}>
                                <Text style={s.monthLabel}>{month}</Text>
                                {exps.map((exp) => {
                                    const icon =
                                        exp.icon ||
                                        CATEGORY_ICONS[exp.category] ||
                                        "➕";
                                    const iconBg =
                                        CATEGORY_BG[exp.category] || "#F3F4F6";
                                    const paidBy =
                                        exp.paidBy?.name || "Unknown";
                                    return (
                                        <TouchableOpacity
                                            key={exp._id}
                                            style={s.expCard}
                                            onLongPress={() =>
                                                setDelExpModal(exp._id)
                                            }
                                            delayLongPress={500}
                                            activeOpacity={0.85}
                                        >
                                            <View
                                                style={[
                                                    s.expIcon,
                                                    { backgroundColor: iconBg },
                                                ]}
                                            >
                                                <Text style={{ fontSize: 18 }}>
                                                    {icon}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={s.expTitle}>
                                                    {exp.description}
                                                </Text>
                                                <Text style={s.expMeta}>
                                                    {isoToShort(exp.date)} ·{" "}
                                                    {paidBy} paid
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    alignItems: "flex-end",
                                                }}
                                            >
                                                <Text style={s.expAmt}>
                                                    ₹
                                                    {exp.amount.toLocaleString(
                                                        "en-IN",
                                                    )}
                                                </Text>
                                                <Text style={s.expSplit}>
                                                    {exp.splitType}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))
                    )}

                    {/* ── Archive group ── */}
                    <TouchableOpacity
                        onPress={() => setDelGroupModal(true)}
                        style={s.archiveBtn}
                        activeOpacity={0.8}
                    >
                        <Text style={s.archiveBtnTxt}>🗑 Archive Group</Text>
                    </TouchableOpacity>

                    <View style={{ height: 110 }} />
                </View>
            </ScrollView>

            {/* ── Sticky bottom ── */}
            <View
                style={[s.stickyBottom, { paddingBottom: insets.bottom + 12 }]}
            >
                <TouchableOpacity
                    style={s.addExpBtn}
                    onPress={() =>
                        navigation.navigate("GroupAddExpense", {
                            groupId: group._id,
                            groupName: group.name,
                            members,
                            onAdded: () => load(),
                        })
                    }
                    activeOpacity={0.85}
                >
                    <Text style={s.addExpTxt}>➕ Add Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s.settleAllBtn}
                    onPress={() => setAddMemberSheet(true)}
                    activeOpacity={0.85}
                >
                    <Text style={s.settleAllTxt}>🤝 Add Member</Text>
                </TouchableOpacity>
            </View>

            {/* ══ BOTTOM SHEETS ══ */}

            <EditGroupSheet
                visible={editSheet}
                onClose={() => setEditSheet(false)}
                group={group}
                onSaved={refresh}
            />

            <AddMemberSheet
                visible={addMemberSheet}
                onClose={() => setAddMemberSheet(false)}
                groupId={groupId}
                onAdded={refresh}
            />

            <SettleMemberSheet
                visible={!!settleSheet}
                onClose={() => setSettleSheet(null)}
                member={settleSheet}
                groupId={groupId}
                onSettled={refresh}
            />

            <RemoveMemberSheet
                visible={!!removeMemberSheet}
                onClose={() => setRemoveMemberSheet(null)}
                member={removeMemberSheet}
                groupId={groupId}
                onRemoved={refresh}
            />

            {/* ══ CONFIRM POPUPS ══ */}

            {/* Delete expense */}
            <DeleteConfirmPopup
                visible={!!delExpModal}
                onClose={() => setDelExpModal(null)}
                type="payment"
                onConfirm={handleDeleteExpense}
                loading={delExpLoading}
            />

            {/* Archive group */}
            <DeleteConfirmPopup
                visible={delGroupModal}
                onClose={() => setDelGroupModal(false)}
                type="project"
                name={group.name}
                onConfirm={handleDeleteGroup}
                loading={delGroupLoading}
            />
        </View>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  STYLES
// ══════════════════════════════════════════════════════════════════════════════
const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 20 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 6,
    },
    groupIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    groupName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    groupSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.7)",
        marginTop: 2,
    },
    editIconBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    balanceBox: {
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.18)",
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginTop: 14,
    },
    balItem: { flex: 1, alignItems: "center" },
    vDiv: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" },
    balVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    balLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: "rgba(255,255,255,0.65)",
        marginTop: 2,
    },
    membersRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },
    memberAv: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.4)",
        alignItems: "center",
        justifyContent: "center",
    },
    memberAvTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm,
        color: "#fff",
    },
    memberNames: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.7)",
        marginLeft: 10,
        flex: 1,
    },
    scroll: { flex: 1 },
    body: { paddingHorizontal: 14, paddingTop: 14 },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    secLabel: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    addMemberBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
    },
    addMemberBtnTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,
        ...SHADOWS.card,
    },
    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    memberAvSm: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },
    memberAvSmTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    memberRowName: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    adminPill: {
        alignSelf: "flex-start",
        backgroundColor: "#EDE9FE",
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 1,
        marginTop: 2,
    },
    adminPillTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm,
        color: COLORS.accent2,
    },
    memberBal: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base },
    memberActionBtn: {
        backgroundColor: COLORS.primaryUltraLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    memberActionBtnTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.primary,
    },
    settledBadge: {
        backgroundColor: "#D1FAE5",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    settledTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: "#065F46",
    },
    monthLabel: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 4,
    },
    expCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        ...SHADOWS.card,
    },
    expIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },
    expTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    expMeta: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 2,
    },
    expAmt: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    expSplit: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text3,
        marginTop: 2,
    },
    archiveBtn: {
        borderWidth: 1,
        borderColor: COLORS.danger,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        marginTop: 8,
        backgroundColor: "#FEF2F2",
    },
    archiveBtnTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.danger,
    },
    stickyBottom: {
        backgroundColor: "#fff",
        borderTopWidth: 1.5,
        borderTopColor: COLORS.border,
        padding: 12,
        flexDirection: "row",
        gap: 10,
    },
    addExpBtn: {
        flex: 1,
        padding: 13,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: "center",
    },
    addExpTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    settleAllBtn: {
        flex: 1,
        padding: 13,
        borderRadius: 14,
        backgroundColor: "#EDE9FE",
        alignItems: "center",
    },
    settleAllTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.accent2,
    },
    errTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
        marginTop: 8,
        textAlign: "center",
    },
    errBack: {
        marginTop: 16,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    errBackTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "#fff",
    },
});

// ── Bottom Sheet shared styles ─────────────────────────────────────────────────
const sh = StyleSheet.create({
    sheetOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 32,
        maxHeight: "85%",
    },
    handleRow: { alignItems: "center", paddingTop: 12, paddingBottom: 4 },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 99,
        backgroundColor: "#E5E7EB",
    },
    sheetTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: COLORS.text,
        paddingHorizontal: 18,
        marginBottom: 18,
    },
    fieldLabel: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginBottom: 6,
        marginTop: 14,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    iconRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    iconOpt: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        borderWidth: 2,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    iconOptActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    typeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    typeOpt: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#F9FAFB",
    },
    typeOptActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    typeOptTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    infoBox: {
        backgroundColor: "#EFF6FF",
        borderRadius: 10,
        padding: 12,
        marginTop: 14,
    },
    infoTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "#1D4ED8",
        lineHeight: 18,
    },
    settleCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#F9FAFB",
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    settleAv: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    settleAvTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: 18,
        color: "#fff",
    },
    settleName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    settleBalLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        marginTop: 2,
    },
    settleAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.xl2 },
    settlePreview: {
        backgroundColor: COLORS.primaryUltraLight,
        borderRadius: 12,
        padding: 14,
        gap: 8,
    },
    settlePreviewTitle: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.primary,
        marginBottom: 4,
    },
    settlePreviewRow: {
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-start",
    },
    settlePreviewDot: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md,
        color: COLORS.primary,
    },
    settlePreviewTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        flex: 1,
        lineHeight: 18,
    },
    sheetBottom: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 18,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        alignItems: "center",
    },
    cancelTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    saveBtn: {
        flex: 2,
        paddingVertical: 13,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
    },
    saveTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: "#fff",
    },
    errBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        marginBottom: 8,
    },
    errTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },
});
