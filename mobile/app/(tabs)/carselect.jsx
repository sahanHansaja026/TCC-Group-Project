import { SafeAreaView, StyleSheet, View, Text, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import API_BASE_URL from '../../config/ipconfig';
import authService from "../services/authService";
import Headersvg from "../../assets/cars/modernhedder.svg";
import AddVechiclesIcon from "../../assets/images/add vechicals.png"; 
import CarIconIcon from "../../assets/cars/caricon.png";


export default function Carselect({ navigation }) { // <-- get navigation prop
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        setUser(userData);

        const response = await axios.get(`${API_BASE_URL}/get_vehicle/${userData.email}`);
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching user data or vehicles:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.maincontainer}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <FlatList
            data={vehicles}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            ListHeaderComponent={
              <View style={styles.imagecontainer}>
                <Headersvg style={styles.image} />
                <Text style={styles.title}>Add or Manage Vehicles</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.vehicleCard}>
                <View style={styles.caritems}>
                  <Image source={CarIconIcon} style={styles.addIcon} />
                  <View style={styles.cartext}>
                    <Text style={styles.normaltextbold}>{item.model}</Text>
                    <Text style={styles.normaltext}>{item.licenseplate}</Text>

                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }} // extra padding for bottom button
            showsVerticalScrollIndicator={false}
          />

          {/* Add Vehicle Button fixed at bottom */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/(components)/addnewcar")}
          >
            <Image source={AddVechiclesIcon} style={styles.addIcon} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  maincontainer: { flex: 1, backgroundColor: "#FFF" },
  imagecontainer: { justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 150, resizeMode: "contain" },
  title: { position: "absolute", color: "#000", fontSize: 25, fontWeight: "bold", textAlign: "center", marginTop: -85 },
  container: { flex: 1, padding: 16, backgroundColor: '#FFFD78' },
  texttitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  vehicleCard: { padding: 12, borderWidth: 1, borderColor: '#FFFD78', borderRadius: 8, marginBottom: 12, backgroundColor: "#FFFD78" },
  addButton: {
    position: 'absolute',
    bottom: 20, // distance from bottom
    right: 20,  // distance from right
    zIndex: 10, // ensure it’s above other components
  },
  addIcon: {
    width: 60,
    height: 60,
  },
  caritems: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    gap:25,
  },
  cartext: {
    flexDirection:'column',
  },
  normaltext: {
    fontSize:25,
  },
  normaltextbold: {
    fontSize: 25,
    fontWeight:'bold',
  }

});
