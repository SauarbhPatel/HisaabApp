import React, { useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import {
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
} from "@expo-google-fonts/nunito";
import {
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";
import * as SplashScreen from "expo-splash-screen";

import { AppProvider, useAppContext } from "./src/context/AppContext";
import RootNavigator from "./src/navigation/RootNavigator";

SplashScreen.preventAutoHideAsync();

// ─── Inner app — waits for session restore before rendering navigator ─────────
function AppInner() {
    const { isLoadingSession } = useAppContext();

    if (isLoadingSession) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#1a7a5e",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return <RootNavigator />;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
    const [fontsLoaded, fontError] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
        Nunito_900Black,
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_600SemiBold,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AppProvider>
                    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                        <StatusBar style="light" />
                        <AppInner />
                    </View>
                </AppProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
