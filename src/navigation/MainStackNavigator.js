import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MainTabNavigator from "./MainTabNavigator";

// TopBar destinations
import NotificationsScreen from "../screens/main/NotificationsScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

// Tier 2 — details
import ProjectDetailScreen from "../screens/details/ProjectDetailScreen";
import DevPaymentPageScreen from "../screens/details/DevPaymentPageScreen";
import FriendDetailScreen from "../screens/details/FriendDetailScreen";
import GroupDetailScreen from "../screens/details/GroupDetailScreen";
import ExpenseDetailScreen from "../screens/details/ExpenseDetailScreen";
import DevDetailScreen from "../screens/details/DevDetailScreen";
import ClientDetailScreen from "../screens/details/ClientDetailScreen";

// Tier 2 — forms
import AddProjectScreen from "../screens/forms/AddProjectScreen";
import AddGroupScreen from "../screens/forms/AddGroupScreen";
import AddFriendScreen from "../screens/forms/AddFriendScreen";
import AddExpenseScreen from "../screens/forms/AddExpenseScreen";
import AddClientPayScreen from "../screens/forms/AddClientPayScreen";
import AddDevFormScreen from "../screens/forms/AddDevFormScreen";
import AddClientFormScreen from "../screens/forms/AddClientFormScreen";
import GroupAddExpenseScreen from "../screens/forms/GroupAddExpenseScreen";
import DevPayScreen from "../screens/forms/DevPayScreen";

// Tier 2 — manage
import MyDevsScreen from "../screens/manage/MyDevsScreen";
import MyClientsScreen from "../screens/manage/MyClientsScreen";

// Tier 3A — modal screens
import SettleScreen from "../screens/modals/SettleScreen";
import GiveMoneyScreen from "../screens/modals/GiveMoneyScreen";
import GetMoneyScreen from "../screens/modals/GetMoneyScreen";
import EditProjectScreen from "../screens/modals/EditProjectScreen";
import StatusScreen from "../screens/modals/StatusScreen";
import EditDevScreen from "../screens/modals/EditDevScreen";
import DevStatusScreen from "../screens/modals/DevStatusScreen";
import EditClientScreen from "../screens/modals/EditClientScreen";
import ClientStatusScreen from "../screens/modals/ClientStatusScreen";
import AddDevToProjectScreen from "../screens/modals/AddDevToProjectScreen";
import AddTransactionScreen from "../screens/forms/AddTransactionScreen";
import SettleFriendScreen from "../screens/modals/SettleFriendScreen";
import EditDevInProjectScreen from "../screens/modals/EditDevInProjectScreen";
import EditClientPayScreen from "../screens/modals/EditClientPayScreen";
import EditProfileScreen from "../screens/forms/EditProfileScreen";

const Stack = createStackNavigator();

export default function MainStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Root tabs */}
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />

            {/* TopBar destinations */}
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

            {/* Tier 2 — detail screens */}
            <Stack.Screen
                name="ProjectDetail"
                component={ProjectDetailScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="DevPaymentPage"
                component={DevPaymentPageScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="FriendDetail"
                component={FriendDetailScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="GroupDetail"
                component={GroupDetailScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="ExpenseDetail"
                component={ExpenseDetailScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="DevDetail"
                component={DevDetailScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="ClientDetail"
                component={ClientDetailScreen}
                options={{ presentation: "card" }}
            />

            {/* Tier 2 — form screens */}
            <Stack.Screen
                name="AddProject"
                component={AddProjectScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="AddGroup"
                component={AddGroupScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="AddFriend"
                component={AddFriendScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="AddExpense"
                component={AddExpenseScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="AddClientPay"
                component={AddClientPayScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="AddDevForm"
                component={AddDevFormScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="AddClientForm"
                component={AddClientFormScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="GroupAddExpense"
                component={GroupAddExpenseScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="DevPay"
                component={DevPayScreen}
                options={{ presentation: "card" }}
            />

            {/* Tier 2 — manage screens */}
            <Stack.Screen
                name="MyDevs"
                component={MyDevsScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="MyClients"
                component={MyClientsScreen}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ presentation: "card" }}
            />

            {/* Tier 3A — slide-up modal screens */}
            <Stack.Screen
                name="Settle"
                component={SettleScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen name="SettleFriend" component={SettleFriendScreen} />
            <Stack.Screen
                name="GiveMoney"
                component={GiveMoneyScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="GetMoney"
                component={GetMoneyScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="EditProject"
                component={EditProjectScreen}
                // options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="Status"
                component={StatusScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="EditClientPay"
                component={EditClientPayScreen}
                // options={{ presentation: "modal" }}
                options={{ presentation: "card" }}
            />
            <Stack.Screen
                name="EditDevInProject"
                component={EditDevInProjectScreen}
                // options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="EditDev"
                component={EditDevScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="DevStatus"
                component={DevStatusScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="EditClient"
                component={EditClientScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="ClientStatus"
                component={ClientStatusScreen}
                options={{ presentation: "modal" }}
            />
            <Stack.Screen
                name="AddDevToProject"
                component={AddDevToProjectScreen}
                // options={{ presentation: "transparentModal" }}
            />
        </Stack.Navigator>
    );
}
