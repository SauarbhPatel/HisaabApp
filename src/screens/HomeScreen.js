import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";

import { AppText } from "../components/ui";
import { SectionHeader } from "../components/common";
import StatCard from "../features/home/StatCard";
import MiniChart from "../features/home/MiniChart";
import QuickActionButton from "../features/home/QuickActionButton";
import ActivityItem from "../features/home/ActivityItem";
import { recentActivity } from "../data/mockData";
import { colors } from "../theme";

const STATS = [
    { value: "₹8,940", label: "Personal Spent", sub: "↑ 12% vs Feb" },
    { value: "₹34,000", label: "Project Income", sub: "3 active projects" },
    { value: "₹5,650", label: "Friends Owe You", sub: "3 pending" },
    { value: "₹9,000", label: "Dev Payments Due", sub: "2 developers" },
];

const CHARTS = [
    {
        value: "₹8.9k",
        label: "SPENT",
        color: colors.danger,
        heights: [10, 13, 17, 11, 22, 14, 18],
        hi: 4,
    },
    {
        value: "₹34k",
        label: "INCOME",
        color: "#2563eb",
        heights: [12, 17, 20, 16, 10, 13, 17],
        hi: 2,
    },
    {
        value: "3",
        label: "PROJECTS",
        color: colors.purple,
        heights: [15, 10, 14, 20, 12, 16, 11],
        hi: 3,
    },
];

function TopBar({ navigation }) {
    const insets = useSafeAreaInsets();
    return (
        <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.topBar, { paddingTop: insets.top + 10 }]}
        >
            <View style={styles.topLeft}>
                <AppText variant="h4" color="#fff">
                    💸 Hisaab
                </AppText>
                <View style={styles.monthBadge}>
                    <AppText variant="caption" color="#fff">
                        Mar 2026
                    </AppText>
                </View>
            </View>
            <View style={styles.topRight}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Notifications")}
                    style={styles.iconBtn}
                >
                    <AppText style={{ fontSize: 20 }}>🔔</AppText>
                    <View style={styles.notifDot}>
                        <AppText style={styles.notifDotText}>2</AppText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}
                >
                    <AppText style={{ fontSize: 20 }}>👤</AppText>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.screen}>
            <TopBar navigation={navigation} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hero}
                >
                    <AppText
                        variant="bodySm"
                        color="rgba(255,255,255,0.8)"
                        style={{ marginBottom: 4 }}
                    >
                        Good morning, Rahul 👋
                    </AppText>
                    <AppText
                        variant="h2"
                        color="#fff"
                        style={{ marginBottom: 14 }}
                    >
                        March Overview
                    </AppText>

                    <View style={styles.statsGrid}>
                        {STATS.map((s) => (
                            <StatCard key={s.label} {...s} />
                        ))}
                    </View>

                    <View style={styles.urgentBanner}>
                        <AppText style={{ fontSize: 14 }}>⚠️</AppText>
                        <AppText
                            variant="bodySm"
                            color="#FEE2E2"
                            style={{ flex: 1 }}
                        >
                            School ERP payment ₹10,000 pending from client
                        </AppText>
                    </View>
                </LinearGradient>

                <View style={styles.body}>
                    {/* Mini Charts */}
                    <View style={styles.chartsRow}>
                        {CHARTS.map((c) => (
                            <MiniChart
                                key={c.label}
                                value={c.value}
                                label={c.label}
                                color={c.color}
                                heights={c.heights}
                                highlightIdx={c.hi}
                            />
                        ))}
                    </View>

                    {/* Quick Actions */}
                    <SectionHeader
                        title="Quick Actions"
                        style={{ marginBottom: 10 }}
                    />
                    <View style={styles.qaGrid}>
                        <QuickActionButton
                            icon="💸"
                            title="Add Expense"
                            sub="Track spending"
                            onPress={() => navigation.navigate("Expenses")}
                        />
                        <QuickActionButton
                            icon="💼"
                            title="My Projects"
                            sub="3 active"
                            onPress={() => navigation.navigate("Projects")}
                        />
                        <QuickActionButton
                            icon="🤝"
                            title="Settle Up"
                            sub="₹5,650 pending"
                            onPress={() => navigation.navigate("Friends")}
                        />
                        <QuickActionButton
                            icon="👥"
                            title="My Groups"
                            sub="4 active"
                            onPress={() => navigation.navigate("Groups")}
                        />
                    </View>

                    {/* Recent Activity */}
                    <SectionHeader
                        title="Recent Activity"
                        actionLabel="See All →"
                        style={{ marginBottom: 10 }}
                    />
                    {recentActivity.map((item) => (
                        <ActivityItem
                            key={item.id}
                            {...item}
                            onPress={
                                item.screen
                                    ? () => navigation.navigate(item.screen)
                                    : undefined
                            }
                        />
                    ))}
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    topBar: {
        paddingHorizontal: 18,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    topLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    monthBadge: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    topRight: { flexDirection: "row", gap: 16, alignItems: "center" },
    iconBtn: { position: "relative" },
    notifDot: {
        position: "absolute",
        top: -6,
        right: -8,
        backgroundColor: colors.accent,
        width: 15,
        height: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    notifDotText: {
        color: "#fff",
        fontSize: 9,
        fontFamily: "Nunito_800ExtraBold",
    },
    hero: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 22 },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 12,
    },
    urgentBanner: {
        backgroundColor: "rgba(239,68,68,0.22)",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    body: { padding: 14 },
    chartsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
    qaGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 16,
    },
});
