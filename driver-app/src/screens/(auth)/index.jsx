import { SafeAreaView, StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from 'react';
import { Link, router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FrontVector from '../../assets/images/login-front-vector.svg';
import RearVector from '../../assets/images/login-rear-vector.svg';
import GoogleIcon from '../../assets/images/google-icon.svg';
import XIcon from '../../assets/images/x-icon.svg';
import FacebookIcon from '../../assets/images/facebook-icon.svg';

export default function Login() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.1.4:8000/user/login', {
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
      <SafeAreaView style={styles.container}>
        <FrontVector style={styles.image} />
        <View style={styles.header}>
          <Text style={styles.title}>Sign In Your Account</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.lable}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.lable}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            placeholder="Password"
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
            <XIcon style={styles.icon} />
            <GoogleIcon style={styles.icon} />
            <FacebookIcon style={styles.icon} />
          </View>
          <View style={styles.navigation}>
            <Link href="/signup">
              <Text style={styles.linktext}>Create New Account</Text>
            </Link>
          </View>
        </ScrollView>
        <View style={styles.bottomcontainer}>
          <RearVector style={styles.image} />
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
    width: 180,
    height: 180,
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
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  centeraliment: {
    alignItems: 'center',
  },
  submitbtn: {
    backgroundColor: '#FFFC35',
    borderWidth: 2,
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
    marginTop: -50,
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
  }
})