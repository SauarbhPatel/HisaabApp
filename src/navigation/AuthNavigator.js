import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppContext } from "../context/AppContext";

import SplashScreen from "../screens/auth/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";

const Stack = createStackNavigator();

export default function AuthNavigator() {
    const { resumeSignup } = useAppContext();

    // If login detected an incomplete signup, skip to the right step directly
    // by passing initialParams to SignupScreen
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, animationEnabled: true }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
                initialParams={
                    resumeSignup ? { resume: resumeSignup } : undefined
                }
            />
        </Stack.Navigator>
    );
}
