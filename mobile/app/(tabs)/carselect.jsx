import { SafeAreaView, StyleSheet, View, Text, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useCallback, useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import API_BASE_URL from '../../config/ipconfig';
import JeepIconIcon from "../../assets/cars/jeep.png"
import CarIconIcon from "../../assets/cars/caricon.png";
import authService from "../services/authService";
import Headersvg from "../../assets/cars/modernhedder.svg";
import AddVechiclesIcon from "../../assets/images/add vechicals.png";

export default function Carselect({ navigation }) {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]); // For search filtering
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  // Fetch user data and vehicles
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await authService.getUserData();
      setUser(userData);

      const response = await axios.get(`${API_BASE_URL}/get_vehicle/${userData.email}`);
      setVehicles(response.data);
      setFilteredVehicles(response.data); // initially show all
    } catch (error) {
      console.error("Error fetching user data or vehicles:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  // Filter vehicles based on search
  useEffect(() => {
    if (searchText === "") {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(vehicle =>
        vehicle.model.toLowerCase().includes(searchText.toLowerCase()) ||
        vehicle.licenseplate.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
  }, [searchText, vehicles]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.maincontainer}>
      {/* Header */}
      <View style={styles.imagecontainer}>
        <Headersvg style={styles.image} />
        <Text style={styles.title}>Add or Manage Vehicles</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by model or license..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <Text style={styles.secontext}>Added Vehicles</Text>
      {/* Vehicle List */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => {
            let vehicleIcon = CarIconIcon; // default icon
            if (item.model.toLowerCase().includes("jeep")) {
              vehicleIcon = JeepIconIcon;
            }

            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(components)/caredit",
                    params: { id: item.id },
                  })
                }
              >
                <View style={styles.vehicleCard}>
                  <View style={styles.caritems}>
                    <Image source={vehicleIcon} style={styles.addIcon} />
                    <View style={styles.cartext}>
                      <Text style={styles.normaltextbold}>{item.model}</Text>
                      <Text style={styles.normaltext}>{item.licenseplate}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ padding: 16, paddingBottom: 120, marginTop: 60 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Vehicle Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(components)/addnewcar")}
        >
          <Image source={AddVechiclesIcon} style={styles.addIcon} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  imagecontainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#FFFD78",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  title: {
    position: "absolute",
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: { flex: 1, padding: 16, backgroundColor: '#FFFD78' },
  vehicleCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFFD78',
    borderRadius: 40,
    marginBottom: 12,
    backgroundColor: "#FFFD78",
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  addIcon: {
    width: 60,
    height: 60,
  },
  caritems: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    gap: 25,
  },
  cartext: {
    flexDirection: 'column',
  },
  normaltext: {
    fontSize: 20,
  },
  normaltextbold: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginTop: 150,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchInput: {
    height: 55,
    backgroundColor: "#FFFEC7",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 19,
    marginTop:25,
  },
  secontext: {
    fontSize: 20,
    marginLeft: 15,
    marginTop:25,
    
  }
});
