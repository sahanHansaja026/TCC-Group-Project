import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MyLogo from '../assets/images/mylogo.svg';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <MyLogo style={styles.image} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end", // center vertically
    alignItems: "center",     
  },
  image: {
    width: 200,
    height: 70,
  }
});
