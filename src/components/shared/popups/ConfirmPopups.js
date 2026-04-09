// import React from "react";
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
// import { COLORS } from "../../../theme/colors";
// import { FONTS, SIZES, RADIUS } from "../../../theme/typography";

// // ─── Shared Center Modal Base ─────────────────────────────────────────────────
// function CenterModal({
//     visible,
//     onClose,
//     icon,
//     title,
//     desc,
//     confirmLabel,
//     confirmColor,
//     onConfirm,
// }) {
//     return (
//         <Modal
//             visible={visible}
//             transparent
//             animationType="fade"
//             onRequestClose={onClose}
//         >
//             <View style={styles.overlay}>
//                 <View style={styles.box}>
//                     <Text style={styles.icon}>{icon}</Text>
//                     <Text style={styles.title}>{title}</Text>
//                     <Text style={styles.desc}>{desc}</Text>
//                     <View style={styles.btnRow}>
//                         <TouchableOpacity
//                             onPress={onClose}
//                             style={styles.cancelBtn}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={styles.cancelText}>Cancel</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             onPress={() => {
//                                 onConfirm?.();
//                                 onClose();
//                             }}
//                             style={[
//                                 styles.confirmBtn,
//                                 { backgroundColor: confirmColor },
//                             ]}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={styles.confirmText}>
//                                 {confirmLabel}
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </Modal>
//     );
// }

// // ─── DeleteConfirmPopup ───────────────────────────────────────────────────────
// export function DeleteConfirmPopup({ visible, onClose, type, onConfirm }) {
//     const configs = {
//         dev: {
//             icon: "🗑️",
//             title: "Remove Developer?",
//             desc: "This will remove them from your team. Payment history will be kept.",
//         },
//         client: {
//             icon: "🗑️",
//             title: "Remove Client?",
//             desc: "This will remove the client from your list.",
//         },
//         project: {
//             icon: "🗑️",
//             title: "Delete Project?",
//             desc: "All project data and payment records will be permanently deleted.",
//         },
//     };
//     const cfg = configs[type] || configs.project;
//     return (
//         <CenterModal
//             visible={visible}
//             onClose={onClose}
//             icon={cfg.icon}
//             title={cfg.title}
//             desc={cfg.desc}
//             confirmLabel="Delete"
//             confirmColor={COLORS.danger}
//             onConfirm={onConfirm}
//         />
//     );
// }

// // ─── PauseDevPopup ────────────────────────────────────────────────────────────
// export function PauseDevPopup({ visible, onClose, devName }) {
//     return (
//         <CenterModal
//             visible={visible}
//             onClose={onClose}
//             icon="⏸️"
//             title="Pause Developer?"
//             desc={`This will mark ${devName || "the developer"} as inactive on this project. You can resume later.`}
//             confirmLabel="⏸ Pause"
//             confirmColor="#F59E0B"
//         />
//     );
// }

// // ─── ResumeDevPopup ───────────────────────────────────────────────────────────
// export function ResumeDevPopup({ visible, onClose, devName }) {
//     return (
//         <CenterModal
//             visible={visible}
//             onClose={onClose}
//             icon="▶️"
//             title="Resume Developer?"
//             desc={`This will mark ${devName || "the developer"} as active on this project again.`}
//             confirmLabel="▶ Resume"
//             confirmColor={COLORS.primary}
//         />
//     );
// }

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         alignItems: "center",
//         justifyContent: "center",
//         paddingHorizontal: 20,
//     },
//     box: {
//         backgroundColor: "#fff",
//         borderRadius: 20,
//         padding: 24,
//         width: "100%",
//         maxWidth: 320,
//         alignItems: "center",
//     },
//     icon: { fontSize: 40, marginBottom: 12 },
//     title: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.xl,
//         color: COLORS.text,
//         marginBottom: 8,
//         textAlign: "center",
//     },
//     desc: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.md,
//         color: COLORS.text2,
//         textAlign: "center",
//         marginBottom: 20,
//         lineHeight: 20,
//     },
//     btnRow: { flexDirection: "row", gap: 10, width: "100%" },
//     cancelBtn: {
//         flex: 1,
//         paddingVertical: 12,
//         borderRadius: RADIUS.lg,
//         borderWidth: 1.5,
//         borderColor: COLORS.border,
//         alignItems: "center",
//     },
//     cancelText: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.md,
//         color: COLORS.text2,
//     },
//     confirmBtn: {
//         flex: 1,
//         paddingVertical: 12,
//         borderRadius: RADIUS.lg,
//         alignItems: "center",
//     },
//     confirmText: {
//         fontFamily: FONTS.nunito.extraBold,
//         fontSize: SIZES.md,
//         color: "#fff",
//     },
// });

import React from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../../theme/typography";

function CenterModal({
    visible,
    onClose,
    icon,
    title,
    desc,
    confirmLabel,
    confirmColor,
    onConfirm,
    loading = false,
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={s.overlay}>
                <View style={s.box}>
                    <Text style={s.icon}>{icon}</Text>
                    <Text style={s.title}>{title}</Text>
                    <Text style={s.desc}>{desc}</Text>
                    <View style={s.btnRow}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={s.cancelBtn}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <Text style={s.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onConfirm}
                            style={[
                                s.confirmBtn,
                                { backgroundColor: confirmColor },
                                loading && s.btnDim,
                            ]}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={s.confirmText}>
                                    {confirmLabel}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export function DeleteConfirmPopup({
    visible,
    onClose,
    type,
    name,
    onConfirm,
    loading,
}) {
    const configs = {
        dev: {
            icon: "🗑️",
            title: "Remove Developer?",
            desc: name
                ? `Remove "${name}" from your team? Payment history will be kept.`
                : "This will remove them from your team. Payment history will be kept.",
        },
        client: {
            icon: "🗑️",
            title: "Remove Client?",
            desc: name
                ? `Remove "${name}" from your clients?`
                : "This will remove the client from your list.",
        },
        project: {
            icon: "🗑️",
            title: "Delete Project?",
            desc: name
                ? `Archive "${name}"? It will be hidden from your project list.`
                : "This project will be archived.",
        },
        payment: {
            icon: "🗑️",
            title: "Delete Payment?",
            desc: "This payment record will be permanently removed and received amount updated.",
        },
    };
    const cfg = configs[type] || configs.project;
    return (
        <CenterModal
            visible={visible}
            onClose={onClose}
            icon={cfg.icon}
            title={cfg.title}
            desc={cfg.desc}
            confirmLabel="Delete"
            confirmColor={COLORS.danger}
            onConfirm={onConfirm}
            loading={loading}
        />
    );
}

export function PauseDevPopup({
    visible,
    onClose,
    devName,
    onConfirm,
    loading,
}) {
    return (
        <CenterModal
            visible={visible}
            onClose={onClose}
            icon="⏸️"
            title="Pause Developer?"
            desc={`This will mark ${devName || "the developer"} as inactive on this project. You can resume later.`}
            confirmLabel="⏸ Pause"
            confirmColor="#F59E0B"
            onConfirm={onConfirm}
            loading={loading}
        />
    );
}

export function ResumeDevPopup({
    visible,
    onClose,
    devName,
    onConfirm,
    loading,
}) {
    return (
        <CenterModal
            visible={visible}
            onClose={onClose}
            icon="▶️"
            title="Resume Developer?"
            desc={`This will mark ${devName || "the developer"} as active on this project again.`}
            confirmLabel="▶ Resume"
            confirmColor={COLORS.primary}
            onConfirm={onConfirm}
            loading={loading}
        />
    );
}

export function RemoveDevPopup({
    visible,
    onClose,
    devName,
    onConfirm,
    loading,
}) {
    return (
        <CenterModal
            visible={visible}
            onClose={onClose}
            icon="🗑️"
            title="Remove Developer?"
            desc={`Remove ${devName || "this developer"} from this project? This cannot be undone.`}
            confirmLabel="Remove"
            confirmColor={COLORS.danger}
            onConfirm={onConfirm}
            loading={loading}
        />
    );
}

const s = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    box: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        width: "100%",
        maxWidth: 320,
        alignItems: "center",
    },
    icon: { fontSize: 40, marginBottom: 12 },
    title: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: COLORS.text,
        marginBottom: 8,
        textAlign: "center",
    },
    desc: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 20,
    },
    btnRow: { flexDirection: "row", gap: 10, width: "100%" },
    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: RADIUS.lg,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        alignItems: "center",
    },
    cancelText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: RADIUS.lg,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
    },
    confirmText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: "#fff",
    },
    btnDim: { opacity: 0.7 },
});
