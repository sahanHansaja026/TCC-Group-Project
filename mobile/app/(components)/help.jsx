import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Button, TextInput} from 'react-native'
import React from 'react'
import { SafeAreaProvider} from 'react-native-safe-area-context';

export default function Help() {
  const handleSubmit= () => {
    console.log("Help button pressed");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.items}>
          <Text style={styles.title}>How can we help?</Text>
          <TextInput style={styles.textInput} placeholder='Search'/>
        </View>
        <View style={styles.top}>
          <TouchableOpacity activeOpacity={0.8} style={styles.submitbtn1} onPress={handleSubmit}>
            <Text style={styles.btn1}>How to use system</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.submitbtn1} onPress={handleSubmit}>
            <Text style={styles.btn1}>Billing Issues</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.submitbtn1} onPress={handleSubmit}>
            <Text style={styles.btn1}>System & Errors</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.submitbtn1} onPress={handleSubmit}>
            <Text style={styles.btn1}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.submitbtn1} onPress={handleSubmit}>
            <Text style={styles.btn1}>FAQs</Text>
          </TouchableOpacity>
          
        </View> 
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
textInput: {
    backgroundColor: '#ffffffff',
    width: '95%',
    borderRadius: 25,
    marginTop: 15,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 13,
  },
  items: {
    alignItems: 'left',
    marginLeft: 10,
    marginTop: 10,
  },
  top: {
    marginTop: 20,
  },
  submitbtn1: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
   
  },
  btn1: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: -5,
},

}); 