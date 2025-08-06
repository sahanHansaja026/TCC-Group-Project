import { SafeAreaView, StyleSheet, View, Text } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context";
import authService from "../services/authService";
import React, { useEffect, useState } from "react";
import HomeTopSvgImage from "../../assets/images/home-top.svg";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        console.log("Logged-in user:", userData);
        setUser(userData); // Save to state
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <HomeTopSvgImage style={styles.image} />
        <Text style={styles.welcome}>
          Hello {user?.username ?? 'Guest'}{'\n'}Good Morning!
        </Text>
        <View style={styles.topView}>
          <View style={styles.topbox1}>
          </View>
          <View style={styles.topbox1}>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: 'center',
    marginTop: 0,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  welcome: {
    fontSize: 20,
    color: '#FFFC35',
    marginTop: -190,
    marginLeft: 20,
  },
  topView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    marginTop: 80,
    gap:10,
  },
  topbox1: {
    backgroundColor: '#FFFC35',
    width: 190,
    height: 140,
    borderWidth: 2,
    MarginTop: 180,
    borderRadius: 15,
    borderColor:'#FFFC35',
  },
})