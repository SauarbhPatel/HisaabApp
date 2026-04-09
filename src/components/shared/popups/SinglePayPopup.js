// import React from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS } from '../../../theme/colors';
// import { FONTS, SIZES, RADIUS } from '../../../theme/typography';

// export default function SinglePayPopup({ visible, data, onClose }) {
//   if (!data) return null;
//   const isPaid = data.status === 'paid';

//   return (
//     <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
//       <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
//       <View style={styles.sheet}>
//         {/* Handle */}
//         <View style={styles.handleRow}>
//           <View style={styles.handle} />
//         </View>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>
//             {isPaid ? '✅ ' : '⏳ '}{data.label}
//           </Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
//             <Text style={styles.closeX}>✕</Text>
//           </TouchableOpacity>
//         </View>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           {/* Amount Block */}
//           <LinearGradient
//             colors={isPaid ? ['#065F46', '#1a7a5e'] : ['#92400E', '#F59E0B']}
//             start={{ x: 0.13, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.amtBlock}
//           >
//             <Text style={styles.amtLabel}>Amount</Text>
//             <Text style={styles.amtVal}>{data.amount}</Text>
//             <View style={styles.statusBadge}>
//               <Text style={styles.statusText}>{isPaid ? '✅ Paid' : '⏳ Pending'}</Text>
//             </View>
//           </LinearGradient>
//           {/* Details */}
//           <View style={styles.detailsBox}>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Label</Text>
//               <Text style={styles.detailValue}>{data.label}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Date</Text>
//               <Text style={styles.detailValue}>{data.date}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Method</Text>
//               <Text style={styles.detailValue}>{data.method}</Text>
//             </View>
//             <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
//               <Text style={styles.detailLabel}>Note</Text>
//               <Text style={[styles.detailValue, { maxWidth: '65%', textAlign: 'right' }]}>{data.note}</Text>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   sheet: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '75%',
//     paddingBottom: 24,
//   },
//   handleRow: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
//   handle: { width: 40, height: 4, borderRadius: 99, backgroundColor: '#E5E7EB' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 18,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   headerTitle: {
//     fontFamily: FONTS.nunito.black,
//     fontSize: SIZES.lg2,
//     color: COLORS.text,
//   },
//   closeBtn: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#F3F4F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeX: { fontSize: SIZES.sm2, color: COLORS.text2 },
//   amtBlock: {
//     margin: 18,
//     borderRadius: RADIUS.xl,
//     padding: 18,
//     alignItems: 'center',
//   },
//   amtLabel: {
//     fontFamily: FONTS.dmSans.regular,
//     fontSize: SIZES.base,
//     color: 'rgba(255,255,255,0.7)',
//     marginBottom: 6,
//   },
//   amtVal: {
//     fontFamily: FONTS.nunito.black,
//     fontSize: SIZES.huge,
//     color: '#fff',
//     letterSpacing: -1,
//   },
//   statusBadge: {
//     marginTop: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   statusText: {
//     fontFamily: FONTS.nunito.bold,
//     fontSize: SIZES.sm2,
//     color: '#fff',
//   },
//   detailsBox: {
//     marginHorizontal: 18,
//     backgroundColor: '#F9FAFB',
//     borderRadius: RADIUS.xl,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   detailLabel: {
//     fontFamily: FONTS.dmSans.semiBold,
//     fontSize: SIZES.base,
//     color: COLORS.text2,
//   },
//   detailValue: {
//     fontFamily: FONTS.nunito.bold,
//     fontSize: SIZES.md,
//     color: COLORS.text,
//   },
// });

import React from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../../theme/typography";

// ─── SinglePayPopup ──────────────────────────────────────────────────────────
// Props:
//   visible, data, onClose
//   onDelete?  → show a red Delete button
//   onEdit?    → show a blue Edit button
export default function SinglePayPopup({
    visible,
    data,
    onClose,
    onDelete,
    onEdit,
}) {
    if (!data) return null;
    const isPaid = data.status === "paid";
    const hasActions = onDelete || onEdit;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={s.overlay}
                activeOpacity={1}
                onPress={onClose}
            />
            <View style={s.sheet}>
                {/* Handle */}
                <View style={s.handleRow}>
                    <View style={s.handle} />
                </View>

                {/* Header */}
                <View style={s.header}>
                    <Text style={s.headerTitle}>
                        {isPaid ? "✅ " : "⏳ "}
                        {data.label}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={s.closeBtn}>
                        <Text style={s.closeX}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Amount Block */}
                    <LinearGradient
                        colors={
                            isPaid
                                ? ["#065F46", "#1a7a5e"]
                                : ["#92400E", "#F59E0B"]
                        }
                        start={{ x: 0.13, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.amtBlock}
                    >
                        <Text style={s.amtLabel}>Amount</Text>
                        <Text style={s.amtVal}>{data.amount}</Text>
                        <View style={s.statusBadge}>
                            <Text style={s.statusText}>
                                {isPaid ? "✅ Paid" : "⏳ Pending"}
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* Details */}
                    <View style={s.detailsBox}>
                        {[
                            { lbl: "Label", val: data.label },
                            { lbl: "Date", val: data.date },
                            { lbl: "Method", val: data.method },
                        ].map((row, i) => (
                            <View key={row.lbl} style={s.detailRow}>
                                <Text style={s.detailLabel}>{row.lbl}</Text>
                                <Text style={s.detailValue}>
                                    {row.val || "—"}
                                </Text>
                            </View>
                        ))}
                        <View style={[s.detailRow, { borderBottomWidth: 0 }]}>
                            <Text style={s.detailLabel}>Note</Text>
                            <Text
                                style={[
                                    s.detailValue,
                                    { maxWidth: "65%", textAlign: "right" },
                                ]}
                            >
                                {data.note || "—"}
                            </Text>
                        </View>
                    </View>

                    {/* Action buttons — only shown when handlers are passed */}
                    {hasActions && (
                        <View style={s.actionRow}>
                            {onEdit && (
                                <TouchableOpacity
                                    style={s.editBtn}
                                    onPress={() => {
                                        onClose();
                                        onEdit();
                                    }}
                                    activeOpacity={0.85}
                                >
                                    <Text style={s.editBtnTxt}>
                                        ✏️ Edit Payment
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {onDelete && (
                                <TouchableOpacity
                                    style={s.deleteBtn}
                                    onPress={() => {
                                        onClose();
                                        onDelete();
                                    }}
                                    activeOpacity={0.85}
                                >
                                    <Text style={s.deleteBtnTxt}>
                                        🗑 Delete
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
}

const s = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
        paddingBottom: 28,
    },
    handleRow: { alignItems: "center", paddingTop: 12, paddingBottom: 4 },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 99,
        backgroundColor: "#E5E7EB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.lg2,
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    closeBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    closeX: { fontSize: SIZES.sm2, color: COLORS.text2 },
    amtBlock: {
        margin: 18,
        borderRadius: RADIUS.xl,
        padding: 18,
        alignItems: "center",
    },
    amtLabel: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.7)",
        marginBottom: 6,
    },
    amtVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.huge,
        color: "#fff",
        letterSpacing: -1,
    },
    statusBadge: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    statusText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: "#fff",
    },
    detailsBox: {
        marginHorizontal: 18,
        backgroundColor: "#F9FAFB",
        borderRadius: RADIUS.xl,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    actionRow: {
        flexDirection: "row",
        gap: 10,
        marginHorizontal: 18,
        marginTop: 16,
    },
    editBtn: {
        flex: 1,
        backgroundColor: "#DBEAFE",
        borderRadius: RADIUS.lg,
        paddingVertical: 12,
        alignItems: "center",
    },
    editBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: "#1D4ED8",
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: "#FEE2E2",
        borderRadius: RADIUS.lg,
        paddingVertical: 12,
        alignItems: "center",
    },
    deleteBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.danger,
    },
});
