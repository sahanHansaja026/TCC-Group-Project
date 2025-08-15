import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

export default function RootLayout() {
  useEffect(() => {
    async function overlayNavBar() {
      // Let app extend behind Android navigation bar
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      await NavigationBar.setBackgroundColorAsync("transparent");
    }
    overlayNavBar();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </SafeAreaProvider>
  );
}
