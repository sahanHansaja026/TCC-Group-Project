import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from "react-native-safe-area-context";
import FrontVector from "../../assets/images/your-vector.svg"

export default function Aboutus() {
  const { email, onChangeEmail } = React.useState("");
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <FrontVector style={styles.image} />
        </View>
        <View style={styles.itmes}>
          <Text style={styles.title}>Welcome to my page</Text>
        </View>
        <View style={styles.left}></View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  left: {
    backgroundColor: '#FFFC35',
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#0EFF43',
    borderRadius: '50%',
  },
  itmes: {
    alignItems: 'center',
  },
  image: {
    width: 80,
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