import { SafeAreaView, StyleSheet, View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from 'expo-router';
import axios from 'axios';
import API_BASE_URL from '../../config/ipconfig';
import authService from "../services/authService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, onChangeEmail] = React.useState('');
  const [contact, onChangeContact] = React.useState('');
  const [name, onChangeName] = React.useState('');
  const [profileimage, onChangeProfileImage] = React.useState(null);

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      onChangeProfileImage(result.assets[0].uri);
    }
  };
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      onChangeProfileImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', user.email);
      formData.append('contact', contact);

      if (profileimage) {
        formData.append('profileimage', {   // lowercase here
          uri: profileimage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }


      const response = await axios.post(`${API_BASE_URL}/profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile saved successfully!');
      router.push('/(components)'); // Go back
    } catch (error) {
      console.error('Save failed', error);
      if (error.response) {
        alert(`Save failed: ${error.response.data.error}`);
      } else {
        alert('Save failed: Network error or server not reachable');
      }
    }
  };


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formview}>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeName}
              placeholder="Full Name"
              value={name}
              keyboardType="name"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Upload Profile Image</Text>
            <View style={styles.profilebox}>
              <View style={styles.profileimge}>
                {profileimage && <Image source={{ uri: profileimage }} style={styles.image} />}

              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
              <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                <Text style={styles.text}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
                <Text style={styles.text}>Camera</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              placeholder={user?.email ?? 'Guest'}
              editable={false}      // This makes the input read-only
              selectTextOnFocus={false} 
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeContact}
              value={contact}
              placeholder="contact"
            />

            <View style={styles.centeraliment}>
              <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
                <Text style={styles.btntext}>Save</Text>
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
    fontWeight: 'bold',
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
  label: {
    fontSize: 20,
    fontWeight: 600
  },
  profileimge: {
    width: 350,
    height: 200,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 50,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius:20,
  },
  image: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 90,
  },
  imageBtn: {
    backgroundColor: "#2ecc71",
    padding: 5,
    borderRadius: 8,
    marginBottom: 10,
    
  },
  text: {
    fontSize: 20,
  },
  profilebox: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom:10,
  },
  submitbtn: {
    backgroundColor: '#FFFC35',
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '30%',
  },
  btntext: {
    fontSize: 22,
    fontWeight: 'bold'
  },
})