import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../../context/AppContext";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";

export default function ProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { user, logout } = useAppContext();
    console.log(user);

    const SettingRow = ({ icon, title, sub, onPress, right }) => (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{icon}</Text>
                <View>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {sub && <Text style={styles.settingSub}>{sub}</Text>}
                </View>
            </View>
            {right || <Text style={styles.settingArrow}>›</Text>}
        </TouchableOpacity>
    );

    const Toggle = () => <View style={styles.toggle} />;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={COLORS.gradientGreen}
                start={{ x: 0.13, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.hero, { paddingTop: insets.top + 10 }]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <View style={styles.profAvatar}>
                    <Text style={styles.profAvatarText}>{user.initials}</Text>
                </View>
                <Text style={styles.profName}>{user.name}</Text>
                <Text style={styles.profEmail}>
                    {user.email || "******@****.com"} · {user.useCase}
                </Text>
                <View style={styles.statPills}>
                    {[
                        ["7 Projects", null],
                        ["4 Devs", null],
                        ["3 Clients", null],
                    ].map(([l]) => (
                        <View key={l} style={styles.statPill}>
                            <Text style={styles.statPillText}>{l}</Text>
                        </View>
                    ))}
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.body}>
                    <View style={styles.settingsGroup}>
                        <SettingRow
                            icon="👤"
                            title="Edit Profile"
                            sub="Name, photo, phone"
                        />
                        <SettingRow
                            icon="💳"
                            title="Payment Methods"
                            sub="UPI, Bank, Cards"
                        />
                        <SettingRow
                            icon="👨‍💻"
                            title="My Developers"
                            sub="4 developers · Tap to manage"
                            onPress={() => navigation.navigate("MyDevs")}
                            right={
                                <Text
                                    style={[
                                        styles.settingArrow,
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
                            sub="Maksoft, Flatshare, School"
                            onPress={() => navigation.navigate("MyClients")}
                            right={
                                <Text
                                    style={[
                                        styles.settingArrow,
                                        { color: COLORS.primary },
                                    ]}
                                >
                                    ›
                                </Text>
                            }
                        />
                    </View>

                    <View style={styles.settingsGroup}>
                        <SettingRow
                            icon="🔔"
                            title="Notifications"
                            sub="Reminders & alerts"
                            right={<Toggle />}
                        />
                        <SettingRow
                            icon="💰"
                            title="Budget Alerts"
                            sub="Alert at 80% of budget"
                            right={<Toggle />}
                        />
                    </View>

                    <View style={styles.settingsGroup}>
                        <SettingRow
                            icon="📊"
                            title="Export Reports"
                            sub="PDF, CSV, Excel"
                        />
                        <SettingRow
                            icon="🧾"
                            title="Invoice Templates"
                            sub="Create & send invoices"
                        />
                        <SettingRow
                            icon="🔒"
                            title="Privacy & Security"
                            sub="PIN, biometrics"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={logout}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.logoutText}>🚪 Log Out</Text>
                    </TouchableOpacity>
                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    hero: { paddingHorizontal: 18, paddingBottom: 24, alignItems: "center" },
    backBtn: { alignSelf: "flex-start", marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    profAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "rgba(255,255,255,0.25)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    profAvatarText: {
        fontFamily: FONTS.nunito.black,
        fontSize: 26,
        color: "#fff",
    },
    profName: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl3,
        color: "#fff",
    },
    profEmail: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
        marginTop: 3,
    },
    statPills: { flexDirection: "row", gap: 10, marginTop: 14 },
    statPill: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    statPillText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: "#fff",
    },
    scroll: { flex: 1 },
    body: { padding: 14 },
    settingsGroup: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 14,
        ...SHADOWS.card,
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settingLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    settingIcon: { fontSize: 18 },
    settingTitle: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    settingSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginTop: 1,
    },
    settingArrow: { fontSize: SIZES.md2, color: COLORS.text3 },
    toggle: {
        width: 38,
        height: 22,
        borderRadius: 11,
        backgroundColor: COLORS.primary,
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: 3,
    },
    logoutBtn: { alignItems: "center", padding: 10 },
    logoutText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },
});
