import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SplashScreen from "../screens/auth/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import HomeScreen from "../screens/main/HomeScreen";
import { ProjectsScreen } from "../screens/main/ProjectsScreen";
import { ExpensesScreen } from "../screens/main/ExpensesScreen";
import FriendsScreen from "../screens/main/FriendsScreen";
import GroupsScreen from "../screens/main/GroupsScreen";
import {
    ReportsScreen,
    NotificationsScreen,
    ProfileScreen,
} from "../screens/main/OtherScreens";

import { AppProvider, useAppContext } from "../context/AppContext";
import { colors, fonts } from "../theme";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ── Custom Tab Bar ─────────────────────────────────────────────
const TAB_ITEMS = [
    { name: "Home", icon: "🏠", label: "Home" },
    { name: "Groups", icon: "👥", label: "Groups" },
    { name: "Friends", icon: "🤝", label: "Friends" },
    { name: "Expenses", icon: "💸", label: "Expenses" },
    { name: "Reports", icon: "📊", label: "Reports" },
];

function CustomTabBar({ state, navigation }) {
    const insets = useSafeAreaInsets();
    const { useCase } = useAppContext();

    // Dynamic tabs based on useCase
    const visibleTabs = TAB_ITEMS.filter((t) => {
        if (useCase === "freelance")
            return !["Groups", "Friends"].includes(t.name);
        if (useCase === "split") return t.name !== "Projects";
        return true; // 'both' - show all
    });

    return (
        <View style={[styles.tabBar, { paddingBottom: insets.bottom || 6 }]}>
            {visibleTabs.map((tab) => {
                const route = state.routes.find((r) => r.name === tab.name);
                const active = route
                    ? state.index === state.routes.indexOf(route)
                    : false;
                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.tabItem}
                        onPress={() => navigation.navigate(tab.name)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.tabIcon,
                                active && styles.tabIconActive,
                            ]}
                        >
                            {tab.icon}
                        </Text>
                        <Text
                            style={[
                                styles.tabLabel,
                                active && styles.tabLabelActive,
                            ]}
                        >
                            {tab.label}
                        </Text>
                        <View
                            style={[
                                styles.tabDot,
                                active && styles.tabDotActive,
                            ]}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ── Tab Navigator ─────────────────────────────────────────────
function TabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Groups" component={GroupsScreen} />
            <Tab.Screen name="Friends" component={FriendsScreen} />
            <Tab.Screen name="Expenses" component={ExpensesScreen} />
            <Tab.Screen name="Reports" component={ReportsScreen} />
        </Tab.Navigator>
    );
}

// ── Main Stack (post-auth) ────────────────────────────────────
function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
                name="Projects"
                component={ProjectsScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ presentation: "card" }}
            />
        </Stack.Navigator>
    );
}

// ── Auth Flow Component ───────────────────────────────────────
function AuthFlow({ onComplete }) {
    const { setUseCase } = useAppContext();
    const [stage, setStage] = useState("splash"); // 'splash' | 'login' | 'signup'

    if (stage === "splash")
        return <SplashScreen onDone={() => setStage("login")} />;
    if (stage === "login")
        return (
            <LoginScreen
                onLogin={() => onComplete("both")}
                onSignup={() => setStage("signup")}
            />
        );
    if (stage === "signup")
        return (
            <SignupScreen
                onDone={(useCase) => {
                    setUseCase(useCase);
                    onComplete(useCase);
                }}
                onLogin={() => setStage("login")}
            />
        );
}

// ── Root Navigator ────────────────────────────────────────────
function RootNavigator() {
    const [authed, setAuthed] = useState(false);
    const { setUseCase } = useAppContext();

    if (!authed) {
        return (
            <AuthFlow
                onComplete={(uc) => {
                    setUseCase(uc);
                    setAuthed(true);
                }}
            />
        );
    }

    return (
        <NavigationContainer>
            <MainStack />
        </NavigationContainer>
    );
}

// ── Export ────────────────────────────────────────────────────
export default function AppNavigator() {
    return (
        <AppProvider>
            <RootNavigator />
        </AppProvider>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        backgroundColor: colors.white,
        borderTopWidth: 1.5,
        borderTopColor: colors.border,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        paddingTop: 6,
        paddingBottom: 2,
        gap: 2,
    },
    tabIcon: { fontSize: 18, opacity: 0.4 },
    tabIconActive: { opacity: 1 },
    tabLabel: { fontFamily: fonts.bold, fontSize: 9, color: colors.text3 },
    tabLabelActive: { color: colors.primary },
    tabDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "transparent",
        marginTop: 1,
    },
    tabDotActive: { backgroundColor: colors.primary },
});
