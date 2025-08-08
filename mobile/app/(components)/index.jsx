import { SafeAreaView, StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from 'react';
import { Link, router } from 'expo-router';
import axios from 'axios';
import API_BASE_URL from '../../config/ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user`, {
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formview}>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formview: {
    padding: 10,
  },
  headtitle: {
    fontSize: 25,
   fontWeight:'bold', 
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
})