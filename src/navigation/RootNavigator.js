import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import AuthNavigator from "./AuthNavigator";
import MainStackNavigator from "./MainStackNavigator";

export default function RootNavigator() {
    const { isAuthenticated } = useAppContext();

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainStackNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
