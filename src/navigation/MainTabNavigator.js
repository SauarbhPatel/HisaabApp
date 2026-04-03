import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAppContext } from "../context/AppContext";
import { COLORS } from "../theme/colors";
import { FONTS, SIZES } from "../theme/typography";

import HomeScreen from "../screens/main/HomeScreen";
import GroupsScreen from "../screens/main/GroupsScreen";
import FriendsScreen from "../screens/main/FriendsScreen";
import ProjectsScreen from "../screens/main/ProjectsScreen";
import ExpensesScreen from "../screens/main/ExpensesScreen";
import ReportsScreen from "../screens/main/ReportsScreen";

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }) {
    return (
        <Text
            style={{
                fontSize: 20,
                transform: [{ translateY: focused ? -2 : 0 }],
            }}
        >
            {emoji}
        </Text>
    );
}

function TabLabel({ label, focused }) {
    return (
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
            {label}
        </Text>
    );
}

function TabDot({ focused }) {
    return <View style={[styles.dot, focused && styles.dotActive]} />;
}

export default function MainTabNavigator() {
    const { useCase } = useAppContext();
    const showSplit = useCase === "split" || useCase === "both";
    const showFreelance = useCase === "freelance" || useCase === "both";

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabItem}>
                            <TabIcon emoji="🏠" focused={focused} />
                            <TabLabel label="Home" focused={focused} />
                            <TabDot focused={focused} />
                        </View>
                    ),
                }}
            />
            {showSplit && (
                <Tab.Screen
                    name="Groups"
                    component={GroupsScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.tabItem}>
                                <TabIcon emoji="👥" focused={focused} />
                                <TabLabel label="Groups" focused={focused} />
                                <TabDot focused={focused} />
                            </View>
                        ),
                    }}
                />
            )}
            {showSplit && (
                <Tab.Screen
                    name="Friends"
                    component={FriendsScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.tabItem}>
                                <TabIcon emoji="🤝" focused={focused} />
                                <TabLabel label="Friends" focused={focused} />
                                <TabDot focused={focused} />
                            </View>
                        ),
                    }}
                />
            )}
            {showFreelance && (
                <Tab.Screen
                    name="Projects"
                    component={ProjectsScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.tabItem}>
                                <TabIcon emoji="💼" focused={focused} />
                                <TabLabel label="Projects" focused={focused} />
                                <TabDot focused={focused} />
                            </View>
                        ),
                    }}
                />
            )}
            <Tab.Screen
                name="Expenses"
                component={ExpensesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabItem}>
                            <TabIcon emoji="💸" focused={focused} />
                            <TabLabel label="Expenses" focused={focused} />
                            <TabDot focused={focused} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabItem}>
                            <TabIcon emoji="📊" focused={focused} />
                            <TabLabel label="Reports" focused={focused} />
                            <TabDot focused={focused} />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "#fff",
        borderTopWidth: 1.5,
        borderTopColor: COLORS.border,
        // height: 60,
        paddingBottom: 4,
        alignItems: "center",
        paddingTop: 10,
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 4,
        gap: 2,
        width: 50,
    },
    tabLabel: {
        fontFamily: FONTS.nunito.semiBold,
        fontSize: SIZES.xs,
        color: COLORS.text3,
    },
    tabLabelActive: { color: COLORS.primary },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
        marginTop: 1,
        opacity: 0,
    },
    dotActive: { opacity: 1 },
});
