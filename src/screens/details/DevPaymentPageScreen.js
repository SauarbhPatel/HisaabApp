// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import SinglePayPopup from "../../components/shared/popups/SinglePayPopup";
// import { COLORS, SHADOWS } from "../../theme/colors";
// import { FONTS, SIZES, RADIUS } from "../../theme/typography";
// import { DEVELOPERS, PROJECTS } from "../../data/mockData";

// export default function DevPaymentPageScreen({ navigation, route }) {
//     const insets = useSafeAreaInsets();
//     const { devId, projectId } = route.params || {};
//     const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[1];
//     const devInProject =
//         project.developers?.find((d) => d.id === devId) ||
//         project.developers?.[0];
//     const devGlobal = DEVELOPERS.find((d) => d.id === devId) || DEVELOPERS[0];
//     const dev = devInProject || devGlobal;

//     const [payPopup, setPayPopup] = useState(null);

//     const payHistory = devInProject?.payHistory || devGlobal?.payHistory || [];
//     const agreed = devInProject?.agreed || 7000;
//     const paid = devInProject?.paid || 4000;
//     const remaining = devInProject?.remaining || 3000;
//     const payPct = agreed > 0 ? Math.round((paid / agreed) * 100) : 0;

//     return (
//         <View style={styles.container}>
//             <LinearGradient
//                 colors={COLORS.gradientAmber}
//                 start={{ x: 0.13, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={[styles.header, { paddingTop: insets.top + 6 }]}
//             >
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={styles.backBtn}
//                 >
//                     <Text style={styles.backText}>← Back</Text>
//                 </TouchableOpacity>
//                 <View style={styles.headerContent}>
//                     <View
//                         style={[
//                             styles.devAv,
//                             { backgroundColor: dev.color || "#ba7517" },
//                         ]}
//                     >
//                         <Text style={styles.devAvText}>
//                             {dev.initials || "ZF"}
//                         </Text>
//                     </View>
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.devName}>
//                             {dev.name || "Zafran"}
//                         </Text>
//                         <Text style={styles.devRole}>
//                             {dev.role || "Frontend Developer"} · {project.name}
//                         </Text>
//                     </View>
//                 </View>
//                 <View style={styles.balanceSummary}>
//                     {[
//                         {
//                             val: `₹${agreed.toLocaleString("en-IN")}`,
//                             lbl: "Total Agreed",
//                         },
//                         {
//                             val: `₹${paid.toLocaleString("en-IN")}`,
//                             lbl: "Paid",
//                             col: "#A7F3D0",
//                         },
//                         {
//                             val: `₹${remaining.toLocaleString("en-IN")}`,
//                             lbl: "Remaining",
//                             col: "#FCA5A5",
//                         },
//                     ].map((s, i) => (
//                         <React.Fragment key={s.lbl}>
//                             {i > 0 && <View style={styles.vDivider} />}
//                             <View style={styles.balItem}>
//                                 <Text
//                                     style={[
//                                         styles.balVal,
//                                         s.col ? { color: s.col } : {},
//                                     ]}
//                                 >
//                                     {s.val}
//                                 </Text>
//                                 <Text style={styles.balLbl}>{s.lbl}</Text>
//                             </View>
//                         </React.Fragment>
//                     ))}
//                 </View>
//                 <View style={styles.progressTrack}>
//                     <View
//                         style={[styles.progressFill, { width: `${payPct}%` }]}
//                     />
//                 </View>
//             </LinearGradient>

//             <ScrollView
//                 style={styles.scroll}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <View style={styles.body}>
//                     <Text style={styles.historyLabel}>Payment History</Text>
//                     {payHistory.length === 0 && (
//                         <View style={styles.emptyCard}>
//                             <Text style={styles.emptyText}>
//                                 No payments recorded yet
//                             </Text>
//                         </View>
//                     )}
//                     {payHistory.map((p, i) => (
//                         <View key={i} style={styles.payCard}>
//                             <View
//                                 style={[
//                                     styles.payIcon,
//                                     {
//                                         backgroundColor:
//                                             p.status === "paid"
//                                                 ? "#D1FAE5"
//                                                 : "#FEF3C7",
//                                     },
//                                 ]}
//                             >
//                                 <Text style={{ fontSize: 16 }}>
//                                     {p.status === "paid" ? "✅" : "⏳"}
//                                 </Text>
//                             </View>
//                             <View style={{ flex: 1 }}>
//                                 <Text style={styles.payLabel}>{p.label}</Text>
//                                 <Text style={styles.payMeta}>
//                                     {p.date} ·{" "}
//                                     {p.method === "UPI"
//                                         ? "📱 UPI"
//                                         : p.method === "Cash"
//                                           ? "💵 Cash"
//                                           : p.method}
//                                 </Text>
//                             </View>
//                             <Text
//                                 style={[
//                                     styles.payAmt,
//                                     {
//                                         color:
//                                             p.status === "paid"
//                                                 ? COLORS.primary
//                                                 : COLORS.accent,
//                                     },
//                                 ]}
//                             >
//                                 ₹{p.amount.toLocaleString("en-IN")}
//                             </Text>
//                         </View>
//                     ))}
//                     <View style={{ height: 100 }} />
//                 </View>
//             </ScrollView>

//             {/* Sticky bottom */}
//             <View
//                 style={[
//                     styles.stickyBottom,
//                     { paddingBottom: insets.bottom + 12 },
//                 ]}
//             >
//                 <TouchableOpacity
//                     style={styles.payNowBtn}
//                     onPress={() =>
//                         navigation.navigate("DevPay", {
//                             devId: dev.id || devId,
//                             projectId,
//                         })
//                     }
//                 >
//                     <Text style={styles.payNowText}>
//                         💸 Pay ₹{remaining.toLocaleString("en-IN")} Now
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.callBtn}>
//                     <Text style={styles.callBtnText}>📞 Call</Text>
//                 </TouchableOpacity>
//             </View>

//             <SinglePayPopup
//                 visible={!!payPopup}
//                 data={payPopup}
//                 onClose={() => setPayPopup(null)}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
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
//     devAv: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: "rgba(255,255,255,0.25)",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     devAvText: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.xl3,
//         color: "#fff",
//     },
//     devName: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.xl3,
//         color: "#fff",
//     },
//     devRole: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.base,
//         color: "rgba(255,255,255,0.8)",
//         marginTop: 1,
//     },
//     balanceSummary: {
//         flexDirection: "row",
//         backgroundColor: "rgba(0,0,0,0.15)",
//         borderRadius: 14,
//         padding: 12,
//         marginTop: 14,
//     },
//     vDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
//     balItem: { flex: 1, alignItems: "center" },
//     balVal: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.xl,
//         color: "#fff",
//     },
//     balLbl: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm,
//         color: "rgba(255,255,255,0.7)",
//         marginTop: 2,
//     },
//     progressTrack: {
//         height: 6,
//         backgroundColor: "rgba(255,255,255,0.2)",
//         borderRadius: 99,
//         overflow: "hidden",
//         marginTop: 10,
//     },
//     progressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 99 },
//     scroll: { flex: 1 },
//     body: { padding: 14 },
//     historyLabel: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.sm2,
//         color: COLORS.text3,
//         textTransform: "uppercase",
//         letterSpacing: 0.5,
//         marginBottom: 8,
//     },
//     emptyCard: {
//         backgroundColor: COLORS.card,
//         borderRadius: 14,
//         padding: 20,
//         alignItems: "center",
//         ...SHADOWS.card,
//     },
//     emptyText: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.md,
//         color: COLORS.text2,
//     },
//     payCard: {
//         backgroundColor: COLORS.card,
//         borderRadius: 14,
//         padding: 14,
//         marginBottom: 10,
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 12,
//         ...SHADOWS.card,
//     },
//     payIcon: {
//         width: 38,
//         height: 38,
//         borderRadius: 19,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     payLabel: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md,
//         color: COLORS.text,
//     },
//     payMeta: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm2,
//         color: COLORS.text2,
//         marginTop: 2,
//     },
//     payAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2 },
//     stickyBottom: {
//         backgroundColor: "#fff",
//         borderTopWidth: 1.5,
//         borderTopColor: COLORS.border,
//         padding: 12,
//         flexDirection: "row",
//         gap: 10,
//     },
//     payNowBtn: {
//         flex: 1,
//         padding: 13,
//         borderRadius: 14,
//         backgroundColor: COLORS.primary,
//         alignItems: "center",
//     },
//     payNowText: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md,
//         color: "#fff",
//     },
//     callBtn: {
//         padding: 13,
//         paddingHorizontal: 16,
//         borderRadius: 14,
//         backgroundColor: "#F3F4F6",
//         alignItems: "center",
//     },
//     callBtnText: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md,
//         color: COLORS.text2,
//     },
// });

import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SinglePayPopup from "../../components/shared/popups/SinglePayPopup";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchDevPaymentHistoryOnProject,
    isoToShort,
} from "../../api/projects";
import { getDevInitials, getDevColor } from "../../api/developers";

const METHOD_ICONS = { upi: "📱", cash: "💵", bank: "🏦", other: "💰" };

export default function DevPaymentPageScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { projectId, devSlotId, devName = "Developer" } = route.params || {};

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [payPopup, setPayPopup] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        const res = await fetchDevPaymentHistoryOnProject(projectId, devSlotId);
        if (res.ok) setData(res.data);
        else setError(res.message);
        setLoading(false);
    }, [projectId, devSlotId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading)
        return (
            <View
                style={[
                    s.container,
                    { alignItems: "center", justifyContent: "center" },
                ]}
            >
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );

    if (error || !data)
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
                <Text style={{ fontSize: 32 }}>⚠️</Text>
                <Text
                    style={{
                        fontFamily: FONTS.nunito.bold,
                        fontSize: SIZES.lg2,
                        color: COLORS.text,
                        marginTop: 8,
                        textAlign: "center",
                    }}
                >
                    {error || "Could not load payment history"}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={s.backBtnCard}
                >
                    <Text style={s.backBtnCardTxt}>← Go Back</Text>
                </TouchableOpacity>
            </View>
        );

    const { slot, developer: dev, project, payments } = data;
    const name = dev?.name || devName;
    const role = slot?.role || dev?.role || "Developer";
    const agreed = slot?.agreedAmount || 0;
    const paid = slot?.paidAmount || 0;
    const remain = slot?.remaining ?? Math.max(0, agreed - paid);
    const payPct =
        slot?.payPercent ??
        (agreed > 0 ? Math.round((paid / agreed) * 100) : 0);
    const color = getDevColor(name);
    const initials = getDevInitials(name);

    // Separate paid vs pending
    const paidPayments = (payments || []).filter((p) => true); // all logged payments are "paid"
    const stillDue = remain > 0;

    return (
        <View style={s.container}>
            {/* Amber gradient header */}
            <LinearGradient
                colors={COLORS.gradientAmber}
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

                {/* Dev row */}
                <View style={s.devRow}>
                    <View style={[s.devAv, { backgroundColor: color }]}>
                        <Text style={s.devAvTxt}>{initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.devName}>{name}</Text>
                        <Text style={s.devRole}>
                            {role} · {project?.name || ""}
                        </Text>
                    </View>
                </View>

                {/* Balance summary */}
                <View style={s.balCard}>
                    <View style={s.balItem}>
                        <Text style={s.balVal}>
                            ₹{agreed.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.balLbl}>Total Agreed</Text>
                    </View>
                    <View style={s.balDivider} />
                    <View style={s.balItem}>
                        <Text style={[s.balVal, { color: "#A7F3D0" }]}>
                            ₹{paid.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.balLbl}>Paid</Text>
                    </View>
                    <View style={s.balDivider} />
                    <View style={s.balItem}>
                        <Text
                            style={[
                                s.balVal,
                                { color: remain > 0 ? "#FCA5A5" : "#A7F3D0" },
                            ]}
                        >
                            ₹{remain.toLocaleString("en-IN")}
                        </Text>
                        <Text style={s.balLbl}>Remaining</Text>
                    </View>
                </View>

                {/* Progress bar */}
                <View style={s.track}>
                    <View
                        style={[s.fill, { width: `${Math.min(payPct, 100)}%` }]}
                    />
                </View>
                <Text style={s.pctTxt}>{payPct}% paid</Text>
            </LinearGradient>

            {/* Scrollable payment list */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={loadData}
                        tintColor={COLORS.accent}
                    />
                }
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 14, paddingBottom: 100 }}
            >
                <Text style={s.sectionHdr}>Payment History</Text>

                {paidPayments.length === 0 && !stillDue && (
                    <View
                        style={[s.card, { alignItems: "center", padding: 24 }]}
                    >
                        <Text style={{ fontSize: 32 }}>💸</Text>
                        <Text
                            style={{
                                fontFamily: FONTS.nunito.bold,
                                fontSize: SIZES.lg2,
                                color: COLORS.text,
                                marginTop: 8,
                            }}
                        >
                            No payments yet
                        </Text>
                    </View>
                )}

                {paidPayments.map((p, i) => (
                    <TouchableOpacity
                        key={p._id || i}
                        style={s.card}
                        onPress={() =>
                            setPayPopup({
                                label: `Payment ${i + 1}`,
                                date: isoToShort(p.date),
                                method: `${METHOD_ICONS[p.method] || "💰"} ${p.method}`,
                                amount: `₹${p.amount.toLocaleString("en-IN")}`,
                                status: "paid",
                                note: p.note || "",
                            })
                        }
                        activeOpacity={0.8}
                    >
                        <View style={s.payRow}>
                            <View style={s.payDot}>
                                <Text style={{ fontSize: 16 }}>✅</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.payLabel}>
                                    Payment {i + 1}
                                    {p.note ? ` — ${p.note}` : ""}
                                </Text>
                                <Text style={s.payMeta}>
                                    {isoToShort(p.date)} ·{" "}
                                    {METHOD_ICONS[p.method] || "💰"} {p.method}
                                </Text>
                            </View>
                            <Text style={[s.payAmt, { color: COLORS.primary }]}>
                                ₹{p.amount.toLocaleString("en-IN")}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Pending row if there's still balance */}
                {stillDue && (
                    <View
                        style={[
                            s.card,
                            {
                                // borderWidth: 1.5,
                                // borderColor: "#F59E0B",
                                // borderStyle: "dashed",
                            },
                        ]}
                    >
                        <View style={s.payRow}>
                            <View
                                style={[
                                    s.payDot,
                                    { backgroundColor: "#FEF3C7" },
                                ]}
                            >
                                <Text style={{ fontSize: 16 }}>⏳</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.payLabel}>
                                    Remaining Payment
                                </Text>
                                <Text style={s.payMeta}>Due on completion</Text>
                            </View>
                            <Text style={[s.payAmt, { color: COLORS.accent }]}>
                                ₹{remain.toLocaleString("en-IN")}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Sticky bottom Pay button */}
            <View
                style={[s.stickyBottom, { paddingBottom: insets.bottom + 12 }]}
            >
                {stillDue ? (
                    <>
                        <TouchableOpacity
                            style={s.payBtn}
                            onPress={() =>
                                navigation.navigate("DevPay", {
                                    projectId,
                                    devSlotId,
                                    devName: name,
                                    agreedAmount: agreed,
                                    paidAmount: paid,
                                    onPaid: loadData,
                                })
                            }
                            activeOpacity={0.85}
                        >
                            <Text style={s.payBtnTxt}>
                                💸 Pay ₹{remain.toLocaleString("en-IN")} Now
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={s.callBtn}
                            activeOpacity={0.85}
                        >
                            <Text style={s.callBtnTxt}>📞 Call</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={[s.payBtn, { backgroundColor: "#D1FAE5" }]}>
                        <Text style={[s.payBtnTxt, { color: "#065F46" }]}>
                            ✅ Fully Paid — No Balance
                        </Text>
                    </View>
                )}
            </View>

            <SinglePayPopup
                visible={!!payPopup}
                data={payPopup}
                onClose={() => setPayPopup(null)}
            />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 16 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    devRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 6,
        marginBottom: 14,
    },
    devAv: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    devAvTxt: { fontFamily: FONTS.nunito.black, fontSize: 20, color: "#fff" },
    devName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    devRole: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
        marginTop: 1,
    },
    balCard: {
        backgroundColor: "rgba(0,0,0,0.15)",
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        marginBottom: 12,
    },
    balItem: { flex: 1, alignItems: "center" },
    balDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
    balVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.lg2,
        color: "#fff",
    },
    balLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: "rgba(255,255,255,0.7)",
        marginTop: 2,
    },
    track: {
        height: 6,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 99,
        overflow: "hidden",
    },
    fill: { height: "100%", backgroundColor: "#fff", borderRadius: 99 },
    pctTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.75)",
        marginTop: 4,
        textAlign: "right",
    },
    sectionHdr: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        ...SHADOWS.card,
    },
    payRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    payDot: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#D1FAE5",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    payLabel: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    payMeta: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 2,
    },
    payAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg2 },
    stickyBottom: {
        backgroundColor: "#fff",
        borderTopWidth: 1.5,
        borderTopColor: COLORS.border,
        padding: 14,
        flexDirection: "row",
        gap: 10,
    },
    payBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.xl,
        padding: 13,
        alignItems: "center",
        justifyContent: "center",
    },
    payBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    callBtn: {
        backgroundColor: "#F3F4F6",
        borderRadius: RADIUS.xl,
        paddingHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    callBtnTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md2,
        color: COLORS.text2,
    },
    backBtnCard: {
        marginTop: 16,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    backBtnCardTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "#fff",
    },
});
