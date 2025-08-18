import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Image, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MyLogo from '../assets/images/logoimage.png'

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
      <SafeAreaView style={styles.maincontainer}>
        <View style={styles.container}>
          <Image source={MyLogo} style={styles.image} />
          <Text style={styles.title}>EasyPark</Text>
          <View style={styles.finaltitle}>
            <Text style={styles.bottomtext}> Welcome !</Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#FFFD78",
  },
  container: {
    flex: 1,
    justifyContent: "center", // center vertically
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 350,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: -20,
  },
  finaltitle: {
    marginTop: 180,
    alignItems: 'center',
  },
  bottomtext: {
    fontSize: 40,
    marginTop: 85,
  }
});
