// import React from "react";
// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useAppContext } from "../../context/AppContext";
// import { COLORS, SHADOWS } from "../../theme/colors";
// import { FONTS, SIZES, RADIUS } from "../../theme/typography";

// export default function ProfileScreen({ navigation }) {
//     const insets = useSafeAreaInsets();
//     const { user, logout } = useAppContext();
//     console.log(user);

//     const SettingRow = ({ icon, title, sub, onPress, right }) => (
//         <TouchableOpacity
//             style={styles.settingRow}
//             onPress={onPress}
//             activeOpacity={0.8}
//         >
//             <View style={styles.settingLeft}>
//                 <Text style={styles.settingIcon}>{icon}</Text>
//                 <View>
//                     <Text style={styles.settingTitle}>{title}</Text>
//                     {sub && <Text style={styles.settingSub}>{sub}</Text>}
//                 </View>
//             </View>
//             {right || <Text style={styles.settingArrow}>›</Text>}
//         </TouchableOpacity>
//     );

//     const Toggle = () => <View style={styles.toggle} />;

//     return (
//         <View style={styles.container}>
//             <LinearGradient
//                 colors={COLORS.gradientGreen}
//                 start={{ x: 0.13, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={[styles.hero, { paddingTop: insets.top + 10 }]}
//             >
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={styles.backBtn}
//                 >
//                     <Text style={styles.backText}>← Back</Text>
//                 </TouchableOpacity>
//                 <View style={styles.profAvatar}>
//                     <Text style={styles.profAvatarText}>{user.initials}</Text>
//                 </View>
//                 <Text style={styles.profName}>{user.name}</Text>
//                 <Text style={styles.profEmail}>
//                     {user.email || "******@****.com"} · {user.useCase}
//                 </Text>
//                 <View style={styles.statPills}>
//                     {[
//                         ["7 Projects", null],
//                         ["4 Devs", null],
//                         ["3 Clients", null],
//                     ].map(([l]) => (
//                         <View key={l} style={styles.statPill}>
//                             <Text style={styles.statPillText}>{l}</Text>
//                         </View>
//                     ))}
//                 </View>
//             </LinearGradient>

//             <ScrollView
//                 style={styles.scroll}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <View style={styles.body}>
//                     <View style={styles.settingsGroup}>
//                         <SettingRow
//                             icon="👤"
//                             title="Edit Profile"
//                             sub="Name, photo, phone"
//                         />
//                         <SettingRow
//                             icon="💳"
//                             title="Payment Methods"
//                             sub="UPI, Bank, Cards"
//                         />
//                         <SettingRow
//                             icon="👨‍💻"
//                             title="My Developers"
//                             sub="4 developers · Tap to manage"
//                             onPress={() => navigation.navigate("MyDevs")}
//                             right={
//                                 <Text
//                                     style={[
//                                         styles.settingArrow,
//                                         { color: COLORS.primary },
//                                     ]}
//                                 >
//                                     ›
//                                 </Text>
//                             }
//                         />
//                         <SettingRow
//                             icon="🏢"
//                             title="My Clients"
//                             sub="Maksoft, Flatshare, School"
//                             onPress={() => navigation.navigate("MyClients")}
//                             right={
//                                 <Text
//                                     style={[
//                                         styles.settingArrow,
//                                         { color: COLORS.primary },
//                                     ]}
//                                 >
//                                     ›
//                                 </Text>
//                             }
//                         />
//                     </View>

//                     <View style={styles.settingsGroup}>
//                         <SettingRow
//                             icon="🔔"
//                             title="Notifications"
//                             sub="Reminders & alerts"
//                             right={<Toggle />}
//                         />
//                         <SettingRow
//                             icon="💰"
//                             title="Budget Alerts"
//                             sub="Alert at 80% of budget"
//                             right={<Toggle />}
//                         />
//                     </View>

//                     <View style={styles.settingsGroup}>
//                         <SettingRow
//                             icon="📊"
//                             title="Export Reports"
//                             sub="PDF, CSV, Excel"
//                         />
//                         <SettingRow
//                             icon="🧾"
//                             title="Invoice Templates"
//                             sub="Create & send invoices"
//                         />
//                         <SettingRow
//                             icon="🔒"
//                             title="Privacy & Security"
//                             sub="PIN, biometrics"
//                         />
//                     </View>

//                     <TouchableOpacity
//                         style={styles.logoutBtn}
//                         onPress={logout}
//                         activeOpacity={0.8}
//                     >
//                         <Text style={styles.logoutText}>🚪 Log Out</Text>
//                     </TouchableOpacity>
//                     <View style={{ height: 30 }} />
//                 </View>
//             </ScrollView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },
//     hero: { paddingHorizontal: 18, paddingBottom: 24, alignItems: "center" },
//     backBtn: { alignSelf: "flex-start", marginBottom: 10 },
//     backText: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.md,
//         color: "rgba(255,255,255,0.9)",
//     },
//     profAvatar: {
//         width: 64,
//         height: 64,
//         borderRadius: 32,
//         backgroundColor: "rgba(255,255,255,0.25)",
//         alignItems: "center",
//         justifyContent: "center",
//         marginBottom: 10,
//     },
//     profAvatarText: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: 26,
//         color: "#fff",
//     },
//     profName: {
//         fontFamily: FONTS.nunito.black,
//         fontSize: SIZES.xl3,
//         color: "#fff",
//     },
//     profEmail: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.base,
//         color: "rgba(255,255,255,0.8)",
//         marginTop: 3,
//     },
//     statPills: { flexDirection: "row", gap: 10, marginTop: 14 },
//     statPill: {
//         backgroundColor: "rgba(255,255,255,0.2)",
//         borderRadius: 10,
//         paddingHorizontal: 14,
//         paddingVertical: 6,
//     },
//     statPillText: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.base,
//         color: "#fff",
//     },
//     scroll: { flex: 1 },
//     body: { padding: 14 },
//     settingsGroup: {
//         backgroundColor: COLORS.card,
//         borderRadius: 16,
//         overflow: "hidden",
//         marginBottom: 14,
//         ...SHADOWS.card,
//     },
//     settingRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         paddingHorizontal: 16,
//         paddingVertical: 13,
//         borderBottomWidth: 1,
//         borderBottomColor: COLORS.border,
//     },
//     settingLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
//     settingIcon: { fontSize: 18 },
//     settingTitle: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.md,
//         color: COLORS.text,
//     },
//     settingSub: {
//         fontFamily: FONTS.dmSans.regular,
//         fontSize: SIZES.sm2,
//         color: COLORS.text2,
//         marginTop: 1,
//     },
//     settingArrow: { fontSize: SIZES.md2, color: COLORS.text3 },
//     toggle: {
//         width: 38,
//         height: 22,
//         borderRadius: 11,
//         backgroundColor: COLORS.primary,
//         alignItems: "flex-end",
//         justifyContent: "center",
//         paddingRight: 3,
//     },
//     logoutBtn: { alignItems: "center", padding: 10 },
//     logoutText: {
//         fontFamily: FONTS.nunito.bold,
//         fontSize: SIZES.base,
//         color: COLORS.danger,
//     },
// });

import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Modal,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../../context/AppContext";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";

// ─── Logout Confirmation Modal ────────────────────────────────────────────────
function LogoutModal({ visible, onCancel, onConfirm }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={m.overlay}>
                <View style={m.box}>
                    <View style={m.iconWrap}>
                        <Text style={{ fontSize: 36 }}>🚪</Text>
                    </View>
                    <Text style={m.title}>Log Out?</Text>
                    <Text style={m.msg}>
                        You'll be signed out of your account. All your data
                        stays safe in the cloud.
                    </Text>
                    <View style={m.btnRow}>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={m.cancelBtn}
                            activeOpacity={0.8}
                        >
                            <Text style={m.cancelTxt}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onConfirm}
                            style={m.logoutBtn}
                            activeOpacity={0.8}
                        >
                            <Text style={m.logoutTxt}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// ─── Setting Row ──────────────────────────────────────────────────────────────
function SettingRow({ icon, title, sub, right, onPress, last }) {
    return (
        <TouchableOpacity
            style={[s.row, last && { borderBottomWidth: 0 }]}
            onPress={onPress}
            activeOpacity={onPress ? 0.75 : 1}
        >
            <View style={s.rowLeft}>
                <Text style={s.rowIcon}>{icon}</Text>
                <View>
                    <Text style={s.rowTitle}>{title}</Text>
                    {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
                </View>
            </View>
            {right !== undefined ? right : <Text style={s.rowArrow}>›</Text>}
        </TouchableOpacity>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { user, logout } = useAppContext();

    const [notifs, setNotifs] = useState(true);
    const [budgetAlerts, setBudgetAlerts] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        setShowLogoutModal(false);
        await logout();
        // Navigation resets automatically when isAuthenticated → false
    };

    const initials = user?.initials || "RK";
    const name = user?.name || "Rahul Kumar";
    const email = user?.email || "";
    const phone = user?.phone || "";
    const avatarColor = user?.avatarColor || COLORS.primary;
    const avatarEmoji = user?.avatar || "";
    const useCase = user?.useCase || "both";

    const useCaseLabel = {
        split: "Expense Tracker",
        freelance: "Freelancer",
        both: "Freelancer",
    };

    return (
        <View style={s.container}>
            {/* Hero */}
            <LinearGradient
                colors={COLORS.gradientGreen}
                start={{ x: 0.13, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[s.hero, { paddingTop: insets.top + 10 }]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={s.backBtn}
                >
                    <Text style={s.backTxt}>← Back</Text>
                </TouchableOpacity>
                <View style={s.heroCenter}>
                    <View style={[s.avatar, { backgroundColor: avatarColor }]}>
                        {avatarEmoji ? (
                            <Text style={{ fontSize: 28 }}>{avatarEmoji}</Text>
                        ) : (
                            <Text style={s.avatarTxt}>{initials}</Text>
                        )}
                    </View>
                    <Text style={s.heroName}>{name}</Text>
                    <Text style={s.heroEmail}>
                        {email || phone || "Tap Edit to add contact info"} ·{" "}
                        {useCaseLabel[useCase] || "User"}
                    </Text>
                    {/* Stat pills */}
                    <View style={s.pillRow}>
                        {[
                            { label: "7 Projects" },
                            { label: "4 Devs" },
                            { label: "3 Clients" },
                        ].map((p) => (
                            <View key={p.label} style={s.pill}>
                                <Text style={s.pillTxt}>{p.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
                <View style={s.body}>
                    {/* Account */}
                    <View style={s.group}>
                        <SettingRow
                            icon="👤"
                            title="Edit Profile"
                            sub="Name, avatar, use-case"
                            onPress={() => navigation.navigate("EditProfile")}
                        />
                        <SettingRow
                            icon="💳"
                            title="Payment Methods"
                            sub="UPI, Bank, Cards"
                            onPress={() =>
                                Alert.alert(
                                    "Coming Soon",
                                    "Payment methods management is coming soon.",
                                )
                            }
                        />
                        <SettingRow
                            icon="👨‍💻"
                            title="My Developers"
                            sub="Manage your dev team"
                            onPress={() => navigation.navigate("MyDevs")}
                            right={
                                <Text
                                    style={[
                                        s.rowArrow,
                                        { color: COLORS.primary },
                                    ]}
                                >
                                    ›
                                </Text>
                            }
                        />
                        <SettingRow
                            icon="🏢"
                            title="My Clients"
                            sub="Manage your clients"
                            onPress={() => navigation.navigate("MyClients")}
                            right={
                                <Text
                                    style={[
                                        s.rowArrow,
                                        { color: COLORS.primary },
                                    ]}
                                >
                                    ›
                                </Text>
                            }
                            last
                        />
                    </View>

                    {/* Preferences */}
                    <View style={s.group}>
                        <SettingRow
                            icon="🔔"
                            title="Notifications"
                            sub="Reminders & alerts"
                            right={
                                <Switch
                                    value={notifs}
                                    onValueChange={setNotifs}
                                    trackColor={{
                                        false: "#E5E7EB",
                                        true: COLORS.primaryLight,
                                    }}
                                    thumbColor={
                                        notifs ? COLORS.primary : "#f4f3f4"
                                    }
                                />
                            }
                        />
                        <SettingRow
                            icon="💰"
                            title="Budget Alerts"
                            sub="Alert at 80% of budget"
                            right={
                                <Switch
                                    value={budgetAlerts}
                                    onValueChange={setBudgetAlerts}
                                    trackColor={{
                                        false: "#E5E7EB",
                                        true: COLORS.primaryLight,
                                    }}
                                    thumbColor={
                                        budgetAlerts
                                            ? COLORS.primary
                                            : "#f4f3f4"
                                    }
                                />
                            }
                            last
                        />
                    </View>

                    {/* Tools */}
                    <View style={s.group}>
                        <SettingRow
                            icon="📊"
                            title="Export Reports"
                            sub="PDF, CSV, Excel"
                            onPress={() =>
                                Alert.alert(
                                    "Coming Soon",
                                    "Export feature is coming soon.",
                                )
                            }
                        />
                        <SettingRow
                            icon="🧾"
                            title="Invoice Templates"
                            sub="Create & send invoices"
                            onPress={() =>
                                Alert.alert(
                                    "Coming Soon",
                                    "Invoice templates coming soon.",
                                )
                            }
                        />
                        <SettingRow
                            icon="🔒"
                            title="Privacy & Security"
                            sub="PIN, biometrics"
                            onPress={() =>
                                Alert.alert(
                                    "Coming Soon",
                                    "Security settings coming soon.",
                                )
                            }
                            last
                        />
                    </View>

                    {/* Danger Zone */}
                    <View style={s.group}>
                        <SettingRow
                            icon="🚪"
                            title="Log Out"
                            sub="Sign out of your account"
                            onPress={() => setShowLogoutModal(true)}
                            right={
                                <Text
                                    style={[
                                        s.rowArrow,
                                        { color: COLORS.danger },
                                    ]}
                                >
                                    ›
                                </Text>
                            }
                            last
                        />
                    </View>

                    <Text style={s.version}>Hisaab v1.0.0</Text>
                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>

            <LogoutModal
                visible={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    hero: { paddingHorizontal: 18, paddingBottom: 24 },
    backBtn: { marginBottom: 10, alignSelf: "flex-start" },
    backTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    heroCenter: { alignItems: "center" },
    avatar: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.3)",
    },
    avatarTxt: { fontFamily: FONTS.nunito.black, fontSize: 26, color: "#fff" },
    heroName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    heroEmail: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
        marginTop: 3,
    },
    pillRow: { flexDirection: "row", gap: 10, marginTop: 14 },
    pill: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    pillTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    scroll: { flex: 1 },
    body: { padding: 14 },
    group: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 14,
        ...SHADOWS.card,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
    rowIcon: { fontSize: 18 },
    rowTitle: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    rowSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 1,
    },
    rowArrow: { fontSize: SIZES.lg2, color: COLORS.text3 },
    version: {
        textAlign: "center",
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        marginTop: 4,
    },
});

// ─── Logout modal styles ──────────────────────────────────────────────────────
const m = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    box: {
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 26,
        width: "100%",
        maxWidth: 320,
        alignItems: "center",
    },
    iconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#FEF2F2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    title: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: COLORS.text,
        marginBottom: 8,
    },
    msg: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 22,
    },
    btnRow: { flexDirection: "row", gap: 12, width: "100%" },
    cancelBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    cancelTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    logoutBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 12,
        backgroundColor: COLORS.danger,
        alignItems: "center",
    },
    logoutTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: "#fff",
    },
});
