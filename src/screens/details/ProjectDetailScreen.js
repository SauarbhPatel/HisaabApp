
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
import {
    DeleteConfirmPopup,
    PauseDevPopup,
    ResumeDevPopup,
    RemoveDevPopup,
} from "../../components/shared/popups/ConfirmPopups";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    fetchProject,
    deleteProject,
    deleteClientPayment,
    updateDevSlotStatus,
    STATUS_CONFIG,
    progressColor,
    isoToShort,
} from "../../api/projects";
import { getDevInitials, getDevColor } from "../../api/developers";

const METHOD_ICONS = {
    upi: "📱",
    cash: "💵",
    bank: "🏦",
    cheque: "🧾",
    other: "💰",
};

export default function ProjectDetailScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { projectId, onRefresh: parentRefresh } = route.params || {};

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ── payment popup (for client payments) ──────────────────────────────────
    const [payPopup, setPayPopup] = useState(null); // { data, payment }

    // ── delete project ────────────────────────────────────────────────────────
    const [deletePopup, setDeletePopup] = useState(false);
    const [deletingProject, setDeletingProject] = useState(false);

    // ── delete payment ────────────────────────────────────────────────────────
    const [deletePayPopup, setDeletePayPopup] = useState(null); // paymentId
    const [deletingPay, setDeletingPay] = useState(false);

    // ── dev slot modals ───────────────────────────────────────────────────────
    // Each holds { slotId, devName } or null
    const [pauseModal, setPauseModal] = useState(null);
    const [resumeModal, setResumeModal] = useState(null);
    const [removeModal, setRemoveModal] = useState(null);
    const [devActionLoading, setDevActionLoading] = useState(false);

    const loadProject = useCallback(async () => {
        setLoading(true);
        setError("");
        const res = await fetchProject(projectId);
        if (res.ok) setProject(res.data.project);
        else setError(res.message);
        setLoading(false);
    }, [projectId]);

    useEffect(() => {
        loadProject();
    }, [loadProject]);

    // ── delete project ────────────────────────────────────────────────────────
    const handleDeleteProject = async () => {
        setDeletingProject(true);
        const res = await deleteProject(projectId);
        setDeletingProject(false);
        if (res.ok) {
            setDeletePopup(false);
            if (parentRefresh) parentRefresh();
            navigation.goBack();
        } else {
            setDeletePopup(false);
        }
    };

    // ── delete payment ────────────────────────────────────────────────────────
    const handleDeletePayment = async () => {
        if (!deletePayPopup) return;
        setDeletingPay(true);
        const res = await deleteClientPayment(projectId, deletePayPopup);
        setDeletingPay(false);
        setDeletePayPopup(null);
        if (res.ok) loadProject();
    };

    // ── dev slot action ───────────────────────────────────────────────────────
    const executeDevStatus = async (slotId, newStatus) => {
        setDevActionLoading(true);
        const res = await updateDevSlotStatus(projectId, slotId, newStatus);
        setDevActionLoading(false);
        setPauseModal(null);
        setResumeModal(null);
        setRemoveModal(null);
        if (res.ok) loadProject();
    };

    // ─── Loading / Error states ───────────────────────────────────────────────
    if (loading)
        return (
            <View
                style={[
                    s.container,
                    { alignItems: "center", justifyContent: "center" },
                ]}
            >
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );

    if (error || !project)
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
                <Text style={s.errTxt}>{error || "Project not found"}</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={s.retryBtn}
                >
                    <Text style={s.retryTxt}>← Go Back</Text>
                </TouchableOpacity>
            </View>
        );

    const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.inprogress;
    const received = project.receivedAmount || 0;
    const total = project.totalPrice || 0;
    const pending = project.pendingAmount ?? Math.max(0, total - received);
    const pct =
        project.paymentPercent ??
        (total > 0 ? Math.round((received / total) * 100) : 0);
    const pColor = progressColor(pct);
    const activeDev = (project.developers || []).filter(
        (d) => d.status !== "removed",
    );

    return (
        <View style={s.container}>
            {/* ── Header ── */}
            <LinearGradient
                colors={COLORS.gradientBlue}
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
                    <View style={{ flex: 1 }}>
                        <Text style={s.headerClient}>{project.client}</Text>
                        <Text style={s.headerName}>{project.name}</Text>
                    </View>
                    <View style={s.headerBtns}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("EditProject", {
                                    projectId: project._id,
                                    project,
                                    onSaved: loadProject,
                                })
                            }
                            style={s.iconBtn}
                        >
                            <Text>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Status", {
                                    projectId: project._id,
                                    currentStatus: project.status,
                                    onChanged: loadProject,
                                })
                            }
                            style={s.iconBtn}
                        >
                            <Text>🔄</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={s.headerPills}>
                    <View style={[s.pill, { backgroundColor: statusCfg.bg }]}>
                        <Text style={[s.pillTxt, { color: statusCfg.text }]}>
                            {statusCfg.label}
                        </Text>
                    </View>
                    <View style={s.pill2}>
                        <Text style={s.pill2Txt}>
                            📅 {isoToShort(project.startDate)}
                        </Text>
                    </View>
                    {project.type ? (
                        <View style={s.pill2}>
                            <Text style={s.pill2Txt}>{project.type}</Text>
                        </View>
                    ) : null}
                </View>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={loadProject}
                        tintColor="#2563eb"
                    />
                }
            >
                <View style={s.body}>
                    {/* ── Payment Summary ── */}
                    <View style={s.card}>
                        <View style={s.cardTitleRow}>
                            <Text style={s.sectionHdr}>💰 Payment Summary</Text>
                            <Text style={s.clientLbl}>
                                Client: {project.client}
                            </Text>
                        </View>
                        <View style={s.finRow}>
                            {[
                                {
                                    lbl: "Total",
                                    val: `₹${total.toLocaleString("en-IN")}`,
                                    color: COLORS.text,
                                },
                                {
                                    lbl: "Received",
                                    val: `₹${received.toLocaleString("en-IN")}`,
                                    color: COLORS.primary,
                                },
                                {
                                    lbl: "Pending",
                                    val: `₹${pending.toLocaleString("en-IN")}`,
                                    color:
                                        pending > 0
                                            ? COLORS.danger
                                            : COLORS.text2,
                                },
                            ].map((f) => (
                                <View key={f.lbl} style={s.finItem}>
                                    <Text
                                        style={[s.finVal, { color: f.color }]}
                                    >
                                        {f.val}
                                    </Text>
                                    <Text style={s.finLbl}>{f.lbl}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={s.progressLblRow}>
                            <Text style={s.progressLbl}>
                                ₹{received.toLocaleString("en-IN")} received of
                                ₹{total.toLocaleString("en-IN")}
                            </Text>
                            <Text style={[s.progressPct, { color: pColor }]}>
                                {pct}%
                            </Text>
                        </View>
                        <View style={s.track}>
                            <View
                                style={[
                                    s.fill,
                                    {
                                        width: `${pct}%`,
                                        backgroundColor: pColor,
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    {/* ── Client Payments ── */}
                    <View style={s.card}>
                        <View style={s.cardTitleRow}>
                            <Text style={s.sectionHdr}>📥 Client Payments</Text>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("AddClientPay", {
                                        projectId: project._id,
                                        projectName: project.name,
                                        totalBilled: total,
                                        totalReceived: received,
                                        totalPending: pending,
                                        onAdded: loadProject,
                                    })
                                }
                                style={s.recordBtn}
                            >
                                <Text style={s.recordBtnTxt}>+ Record</Text>
                            </TouchableOpacity>
                        </View>

                        {(project.clientPayments || []).length === 0 ? (
                            <Text style={s.emptyRow}>
                                No payments recorded yet.
                            </Text>
                        ) : (
                            project.clientPayments.map((p, i) => (
                                <TouchableOpacity
                                    key={p._id}
                                    style={[
                                        s.payRow,
                                        i ===
                                            project.clientPayments.length -
                                                1 && { borderBottomWidth: 0 },
                                    ]}
                                    onPress={() =>
                                        setPayPopup({
                                            payment: p,
                                            data: {
                                                label: p.label,
                                                date: isoToShort(p.date),
                                                method: `${METHOD_ICONS[p.method] || "💰"} ${p.method}`,
                                                amount: `₹${p.amount.toLocaleString("en-IN")}`,
                                                status: p.status,
                                                note: p.note || "",
                                            },
                                        })
                                    }
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[
                                            s.payDot,
                                            {
                                                backgroundColor:
                                                    p.status === "paid"
                                                        ? "#D1FAE5"
                                                        : "#FEF3C7",
                                            },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 14 }}>
                                            {p.status === "paid" ? "✅" : "⏳"}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.payLabel}>
                                            {p.label}
                                        </Text>
                                        <Text style={s.payMeta}>
                                            {isoToShort(p.date)} ·{" "}
                                            {METHOD_ICONS[p.method] || "💰"}{" "}
                                            {p.method}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            s.payAmt,
                                            {
                                                color:
                                                    p.status === "paid"
                                                        ? COLORS.primary
                                                        : COLORS.accent,
                                            },
                                        ]}
                                    >
                                        ₹{p.amount.toLocaleString("en-IN")}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    {/* ── Developer Payments ── */}
                    <View style={s.cardTitleRow}>
                        <Text style={s.sectionHdr}>👨‍💻 Developer Payments</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("AddDevToProject", {
                                    projectId: project._id,
                                    onAdded: loadProject,
                                })
                            }
                            style={s.addDevBtn}
                        >
                            <Text style={s.addDevBtnTxt}>+ Add Dev</Text>
                        </TouchableOpacity>
                    </View>

                    {activeDev.length === 0 && (
                        <View
                            style={[
                                s.card,
                                { alignItems: "center", padding: 20, gap: 6 },
                            ]}
                        >
                            <Text style={{ fontSize: 28 }}>👨‍💻</Text>
                            <Text style={s.emptyRow}>
                                No developers assigned yet.
                            </Text>
                        </View>
                    )}

                    {activeDev.map((slot) => {
                        const dev = slot.developer || {};
                        const name = dev.name || "Developer";
                        const agreed = slot.agreedAmount || 0;
                        const paid = slot.paidAmount || 0;
                        const remain = Math.max(0, agreed - paid);
                        const devPct =
                            agreed > 0 ? Math.round((paid / agreed) * 100) : 0;
                        const isPaused = slot.status === "paused";
                        const color = getDevColor(name);
                        const initials = getDevInitials(name);

                        let devStatusCfg = {
                            bg: "#FEE2E2",
                            text: "#991B1B",
                            label: "Unpaid",
                        };
                        if (devPct >= 100)
                            devStatusCfg = {
                                bg: "#D1FAE5",
                                text: "#065F46",
                                label: "Fully Paid ✅",
                            };
                        else if (devPct > 0)
                            devStatusCfg = {
                                bg: "#FEF3C7",
                                text: "#92400E",
                                label: "Partial",
                            };
                        if (isPaused)
                            devStatusCfg = {
                                bg: "#F3F4F6",
                                text: "#6B7280",
                                label: "⏸ Paused",
                            };

                        return (
                            <View
                                key={slot._id}
                                style={[s.devCard, isPaused && s.devCardPaused]}
                            >
                                <View style={s.devTop}>
                                    <View
                                        style={[
                                            s.devAv,
                                            {
                                                backgroundColor: isPaused
                                                    ? "#9CA3AF"
                                                    : color,
                                            },
                                        ]}
                                    >
                                        <Text style={s.devAvTxt}>
                                            {initials}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={[
                                                s.devName,
                                                isPaused && {
                                                    color: COLORS.text2,
                                                },
                                            ]}
                                        >
                                            {name}
                                        </Text>
                                        <Text style={s.devRole}>
                                            {slot.role ||
                                                dev.role ||
                                                "Developer"}{" "}
                                            ·{" "}
                                            {isPaused ? "⏸ Paused" : "● Active"}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate(
                                                "DevPaymentPage",
                                                {
                                                    projectId: project._id,
                                                    devSlotId: slot._id,
                                                    devName: name,
                                                },
                                            )
                                        }
                                        style={[
                                            s.slotBadge,
                                            {
                                                backgroundColor:
                                                    devStatusCfg.bg,
                                            },
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text
                                            style={[
                                                s.slotBadgeTxt,
                                                { color: devStatusCfg.text },
                                            ]}
                                        >
                                            {devStatusCfg.label} 🔗
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Amounts */}
                                <View style={s.devAmts}>
                                    {[
                                        {
                                            lbl: "Total Agreed",
                                            val: `₹${agreed.toLocaleString("en-IN")}`,
                                            color: COLORS.text,
                                        },
                                        {
                                            lbl: "Paid",
                                            val: `₹${paid.toLocaleString("en-IN")}`,
                                            color: COLORS.primary,
                                        },
                                        {
                                            lbl: "Remaining",
                                            val: `₹${remain.toLocaleString("en-IN")}`,
                                            color:
                                                remain > 0
                                                    ? COLORS.danger
                                                    : COLORS.text2,
                                        },
                                    ].map((a) => (
                                        <View key={a.lbl} style={s.devAmtBox}>
                                            <Text style={s.devAmtLbl}>
                                                {a.lbl}
                                            </Text>
                                            <Text
                                                style={[
                                                    s.devAmtVal,
                                                    { color: a.color },
                                                ]}
                                            >
                                                {a.val}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Progress bar */}
                                <View style={s.track}>
                                    <View
                                        style={[
                                            s.fill,
                                            {
                                                width: `${devPct}%`,
                                                backgroundColor:
                                                    devPct >= 100
                                                        ? COLORS.primary
                                                        : COLORS.accent,
                                            },
                                        ]}
                                    />
                                </View>

                                {/* Actions */}
                                <View style={s.devActions}>
                                    {!isPaused ? (
                                        <>
                                            <TouchableOpacity
                                                style={[
                                                    s.devActionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#DBEAFE",
                                                    },
                                                ]}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "DevPay",
                                                        {
                                                            projectId:
                                                                project._id,
                                                            devSlotId: slot._id,
                                                            devName: name,
                                                            agreedAmount:
                                                                agreed,
                                                            paidAmount: paid,
                                                            onPaid: loadProject,
                                                        },
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.devActionTxt,
                                                        { color: "#1D4ED8" },
                                                    ]}
                                                >
                                                    💸 Pay
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    s.devActionBtn,
                                                    {
                                                        backgroundColor:
                                                            COLORS.primaryUltraLight,
                                                    },
                                                ]}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "DevPaymentPage",
                                                        {
                                                            projectId:
                                                                project._id,
                                                            devSlotId: slot._id,
                                                            devName: name,
                                                        },
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.devActionTxt,
                                                        {
                                                            color: COLORS.primary,
                                                        },
                                                    ]}
                                                >
                                                    🔗 Details
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    s.devActionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#F3F4F6",
                                                    },
                                                ]}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "EditDevInProject",
                                                        {
                                                            projectId:
                                                                project._id,
                                                            slot,
                                                            onSaved:
                                                                loadProject,
                                                        },
                                                    )
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.devActionTxt,
                                                        { color: COLORS.text2 },
                                                    ]}
                                                >
                                                    ✏️ Edit
                                                </Text>
                                            </TouchableOpacity>

                                            {/* ⏸ Pause → opens PauseDevPopup */}
                                            <TouchableOpacity
                                                style={[
                                                    s.devActionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#FEF3C7",
                                                    },
                                                ]}
                                                onPress={() =>
                                                    setPauseModal({
                                                        slotId: slot._id,
                                                        devName: name,
                                                    })
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.devActionTxt,
                                                        { color: "#92400E" },
                                                    ]}
                                                >
                                                    ⏸ Pause
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <>
                                            {/* ▶ Resume → opens ResumeDevPopup */}
                                            <TouchableOpacity
                                                style={[
                                                    s.devActionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#D1FAE5",
                                                    },
                                                ]}
                                                onPress={() =>
                                                    setResumeModal({
                                                        slotId: slot._id,
                                                        devName: name,
                                                    })
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.devActionTxt,
                                                        { color: "#065F46" },
                                                    ]}
                                                >
                                                    ▶ Resume
                                                </Text>
                                            </TouchableOpacity>

                                            {/* 🗑 Remove → opens RemoveDevPopup */}
                                            <TouchableOpacity
                                                style={[
                                                    s.devActionBtn,
                                                    {
                                                        backgroundColor:
                                                            "#FEE2E2",
                                                    },
                                                ]}
                                                onPress={() =>
                                                    setRemoveModal({
                                                        slotId: slot._id,
                                                        devName: name,
                                                    })
                                                }
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        s.devActionTxt,
                                                        {
                                                            color: COLORS.danger,
                                                        },
                                                    ]}
                                                >
                                                    🗑 Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>
                        );
                    })}

                    {/* ── Bottom actions ── */}
                    <View style={s.actionsGrid}>
                        {[
                            {
                                label: "🧾 Send Invoice",
                                bg: "#FEF3C7",
                                text: "#92400E",
                            },
                            {
                                label: "📞 Call Client",
                                bg: COLORS.primaryUltraLight,
                                text: COLORS.primary,
                            },
                            {
                                label: "💬 WhatsApp",
                                bg: "#D1FAE5",
                                text: "#065F46",
                            },
                            {
                                label: "🗑 Delete",
                                bg: "#FEE2E2",
                                text: COLORS.danger,
                                onPress: () => setDeletePopup(true),
                            },
                        ].map((a) => (
                            <TouchableOpacity
                                key={a.label}
                                style={[s.actionBtn, { backgroundColor: a.bg }]}
                                onPress={a.onPress}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[s.actionBtnTxt, { color: a.text }]}
                                >
                                    {a.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>

            {/* ══ POPUPS ══ */}

            {/* Client payment detail popup with Edit + Delete buttons */}
            <SinglePayPopup
                visible={!!payPopup}
                data={payPopup?.data}
                onClose={() => setPayPopup(null)}
                onEdit={
                    payPopup
                        ? () => {
                              navigation.navigate("EditClientPay", {
                                  projectId: project._id,
                                  payment: payPopup.payment,
                                  projectName: project.name,
                                  onSaved: loadProject,
                              });
                          }
                        : undefined
                }
                onDelete={
                    payPopup
                        ? () => setDeletePayPopup(payPopup.payment._id)
                        : undefined
                }
            />

            {/* Delete payment confirmation */}
            <DeleteConfirmPopup
                visible={!!deletePayPopup}
                onClose={() => setDeletePayPopup(null)}
                type="payment"
                onConfirm={handleDeletePayment}
                loading={deletingPay}
            />

            {/* Delete project confirmation */}
            <DeleteConfirmPopup
                visible={deletePopup}
                onClose={() => setDeletePopup(false)}
                type="project"
                name={project.name}
                onConfirm={handleDeleteProject}
                loading={deletingProject}
            />

            {/* Pause dev popup */}
            <PauseDevPopup
                visible={!!pauseModal}
                onClose={() => setPauseModal(null)}
                devName={pauseModal?.devName}
                onConfirm={() => executeDevStatus(pauseModal?.slotId, "paused")}
                loading={devActionLoading}
            />

            {/* Resume dev popup */}
            <ResumeDevPopup
                visible={!!resumeModal}
                onClose={() => setResumeModal(null)}
                devName={resumeModal?.devName}
                onConfirm={() =>
                    executeDevStatus(resumeModal?.slotId, "active")
                }
                loading={devActionLoading}
            />

            {/* Remove dev popup */}
            <RemoveDevPopup
                visible={!!removeModal}
                onClose={() => setRemoveModal(null)}
                devName={removeModal?.devName}
                onConfirm={() =>
                    executeDevStatus(removeModal?.slotId, "removed")
                }
                loading={devActionLoading}
            />
        </View>
    );
}

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
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 4,
    },
    headerClient: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 2,
    },
    headerName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    headerBtns: { flexDirection: "row", gap: 6 },
    iconBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerPills: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
        flexWrap: "wrap",
    },
    pill: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
    pillTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base },
    pill2: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    pill2Txt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        marginBottom: 14,
        ...SHADOWS.card,
    },
    cardTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionHdr: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    clientLbl: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: "#2563eb",
    },
    finRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
    finItem: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    finVal: { fontFamily: FONTS.nunito.black, fontSize: SIZES.lg },
    finLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text2,
        marginTop: 2,
    },
    progressLblRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    progressLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    progressPct: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.sm2 },
    track: {
        height: 6,
        backgroundColor: "#F3F4F6",
        borderRadius: 99,
        overflow: "hidden",
        marginBottom: 4,
    },
    fill: { height: "100%", borderRadius: 99 },
    recordBtn: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    recordBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm,
        color: "#fff",
    },
    payRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    payDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
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
    payAmt: { fontFamily: FONTS.nunito.black, fontSize: SIZES.md2 },
    emptyRow: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text3,
        paddingVertical: 4,
    },
    addDevBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    addDevBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm,
        color: "#fff",
    },
    devCard: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        ...SHADOWS.card,
    },
    devCardPaused: {
        opacity: 0.65,
        borderWidth: 1.5,
        borderColor: COLORS.border,
    },
    devTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    devAv: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    devAvTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md,
        color: "#fff",
    },
    devName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    devRole: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    slotBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    slotBadgeTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
    devAmts: { flexDirection: "row", gap: 8, marginBottom: 8 },
    devAmtBox: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    devAmtLbl: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm,
        color: COLORS.text2,
    },
    devAmtVal: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        marginTop: 2,
    },
    devActions: {
        flexDirection: "row",
        gap: 6,
        marginTop: 8,
        flexWrap: "wrap",
    },
    devActionBtn: {
        flex: 1,
        padding: 7,
        borderRadius: 9,
        alignItems: "center",
        minWidth: "22%",
    },
    devActionTxt: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.sm2 },
    actionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
    },
    actionBtn: {
        flex: 1,
        minWidth: "45%",
        padding: 11,
        borderRadius: 12,
        alignItems: "center",
    },
    actionBtnTxt: { fontFamily: FONTS.nunito.extraBold, fontSize: SIZES.base },
    errTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
        marginTop: 8,
    },
    retryBtn: {
        marginTop: 16,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    retryTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "#fff",
    },
});
