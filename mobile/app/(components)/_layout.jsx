import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Componentlayout() {
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: true }}>
                <Stack.Screen name="index" options={{ title: "Profile Edit" }} />
                <Stack.Screen name="billing" options={{ title: "Billing Information" }} />
                <Stack.Screen name="aboutus" options={{ title: 'About Us' }} />
            </Stack>
        </SafeAreaProvider>
    );
}