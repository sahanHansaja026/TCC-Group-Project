import { SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from 'react';
import { Link, router } from 'expo-router';
import axios from 'axios';
import API_BASE_URL from '../../config/ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleIcon from '../../assets/images/google.png';
import Logico from "../../assets/images/applogicon.png";
import XIcon from '../../assets/images/xicon.png';
import FacebookIcon from '../../assets/images/facebook.png';

export default function Login() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        email,
        password,
      });

      await AsyncStorage.setItem('token', response.data.token);

      router.push('/(tabs)'); // Navigate to another page
    } catch (error) {
      console.error('Login failed', error);
      if (error.response) {
        alert(`Login failed: ${error.response.data.error}`);
      } else {
        alert('Login failed: Network error or server not reachable');
        router.push('/(tabs)')
      }
    }
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <Image source={Logico} style={styles.apphedericon} />
              <Text style={styles.title}>Sign In Your Account</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}
              keyboardShouldPersistTaps="handled">
              <Text style={styles.lable}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                placeholder="ex: example@gemail.com"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.lable}>Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="**************"
                secureTextEntry={true}
              />
              <View style={styles.centeraliment}>
                <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
                  <Text style={styles.btntext}>Login</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.centeraliment}>
                <Text style={styles.options}>or sign in with</Text>
              </View>
              <View style={styles.iconview}>
                <Image source={XIcon} style={styles.icon} />
                <Image source={FacebookIcon} style={styles.icon} />
                <Image source={GoogleIcon} style={styles.icon} />
              </View>
              <View style={styles.navigation}>
                <Link href="/signup">
                  <Text style={styles.linktext}>Don’t have an account? </Text>
                </Link>
              </View>
            </ScrollView>
            <View style={styles.bottomcontainer}>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginTop: 25,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  image: {
    width: '100%',
    height: 80,
  },
  icon: {
    width: 57,
    height: 60,
  },
  scrollView: {
    padding: 20,
    paddingTop: 0,
    flexGrow: 1,
    justifyContent: 'center',
  },
  lable: {
    fontSize: 20,
  },
  input: {
    height: 60,
    marginVertical: 10,
    borderColor: '#000',
    backgroundColor: "#C1C1C1",
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  centeraliment: {
    alignItems: 'center',
  },
  submitbtn: {
    backgroundColor: '#FFFC35',
    borderWidth: 0,
    borderColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  btntext: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  options: {
    fontSize: 20,
    marginTop: 10,
  },
  iconview: {
    marginTop: 10,
    gap: 50,
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigation: {
    marginTop: 0,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  linktext: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomcontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "flex-end",
    alignItems: "center",
  },
  apphedericon: {
    width: 100,
    height: 100,
    marginTop: 60,
  }
})