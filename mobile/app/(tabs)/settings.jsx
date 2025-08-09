import { SafeAreaView, StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import API_BASE_URL from '../../config/ipconfig';
import { useRouter } from "expo-router";
import authService from "../services/authService";
import FrontVector from '../../assets/images/login-front-vector.svg';
import ArrowIcon from "../../assets/images/settings-arrow.svg";
import GestImage from "../../assets/images/ui-profile-icon-vector.jpg";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter(); 

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

  // Fetch profile from backend once user email is available
  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/email`, {
          params: { email: user.email },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FrontVector style={styles.image} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.maintitle}>Settings</Text>
          <View style={styles.settingssection}>  

            <TouchableOpacity
              style={styles.profilesection}
              activeOpacity={0.7}
              onPress={() => router.push("/(components)")} // <-- Navigate here
            >
              <Image
                source={
                  profile?.profileimage
                    ? { uri: `data:image/jpeg;base64,${profile.profileimage}` }
                    : GestImage
                }
                style={styles.profileimage}
              />
              <View style={styles.profilecontent}>
                <Text>{profile?.email ?? 'Guest'}</Text>
                <Text>Edit Your Personal Details</Text>
              </View>
              <ArrowIcon style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.yellowbar} activeOpacity={0.7} onPress={() => router.push("/(components)/billing")} >
              <View style={styles.paddingofyellobar}>
                <Text style={styles.yellowbartitles}>Billing Information</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.yellowbar} activeOpacity={0.7} onPress={() => router.push("/(components)/privacy")} >
              <View style={styles.paddingofyellobar}>
                <Text style={styles.yellowbartitles}>Privacy & Security</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.yellowbar} activeOpacity={0.7} onPress={() => router.push("/(components)/aboutus")} >
              <View style={styles.paddingofyellobar}>
                <Text style={styles.yellowbartitles}>About Us</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.yellowbar} activeOpacity={0.7} onPress={() => router.push("/(components)/help")} >
              <View style={styles.paddingofyellobar}>
                <Text style={styles.yellowbartitles}>Help and support</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.yellowbar} activeOpacity={0.7} onPress={() => router.push("/(auth)")} >
              <View style={styles.paddingofyellobar}>
                <Text style={styles.yellowbartitles}>LogOut</Text>
              </View>
            </TouchableOpacity>


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
  image: {
    width: '100%',
    height: 80,
  },
  maintitle: {
    fontSize: 40,
    fontWeight: 'bold',
    margin: 10,
  },
  settingssection: {
    alignItems: 'center',
    gap:50,
  },
  profilesection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap:20,
  },
  profilecontent: {
    flexDirection:'column',
  },
  profileimage: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 35, // half of 70
    borderColor: '#000',
    backgroundColor:'#000'
  },
  yellowbar: {
    backgroundColor: '#FFFC35',
    width: 350,
    height: 60,
    borderWidth: 2,
    borderRadius: 18,
    borderColor: '#000',
    justifyContent:'center',
  },
  paddingofyellobar: {
    gap: 45,
    flexDirection: 'row',
    marginLeft:10
  },
  yellowbartitles: {
    fontSize: 25,
    fontWeight:'bold',
  }
})