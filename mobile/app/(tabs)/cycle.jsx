import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator,Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import API_BASE_URL from "../../config/ipconfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Appcycle() {

  const router = useRouter();
  const mapRef = useRef(null);

  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestParking, setNearestParking] = useState("Finding nearest parking...");
  const [nearestParkingData, setNearestParkingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Haversine formula
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  // Fetch parking lots
  const fetchParkingLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_parking_locations`);
      setLocations(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Get user location + nearest parking
  const detectNearestParking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;
    setUserLocation({ latitude, longitude });

    let best = null;
    let bestDist = Infinity;

    locations.forEach(lot => {
      const dist = getDistance(latitude, longitude, lot.lat, lot.lng);
      if (dist < bestDist) {
        bestDist = dist;
        best = lot;
      }
    });

    if (best) {
      setNearestParking(`${best.lotname} (${bestDist.toFixed(2)} km)`);
      setNearestParkingData(best);
    }
  };

  useEffect(() => { fetchParkingLocations(); }, []);
  useEffect(() => { if (locations.length > 0) detectNearestParking(); }, [locations]);

  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
            style={styles.map}
            
          initialRegion={{
            latitude: 7.8731,
            longitude: 80.7718,
            latitudeDelta: 2,
            longitudeDelta: 2,
          }}
        >

          {/* User Marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="You are here"
              pinColor="blue"
            />
          )}

          {/* Parking markers */}
            {locations.map((lot) => (
              <Marker
                key={lot.parkinglotid}
                coordinate={{ latitude: lot.lat, longitude: lot.lng }}
                onPress={() =>
                  router.push({
                    pathname: "/(components)/owner",
                    params: { id: lot.parkinglotid },
                  })
                }
              >
                <Image
                  source={require("../../assets/images/maplocation.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </Marker>
            ))}


        </MapView>
      )}

      {/* Nearest Parking Button */}
      <View style={styles.bottomBox}>
        <TouchableOpacity
          style={styles.yellowBar}
          onPress={() => {
            if (nearestParkingData && mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: nearestParkingData.lat,
                longitude: nearestParkingData.lng,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              });
            }
          }}
        >
          <Ionicons name="location-sharp" size={22} color="#4a4a4a" />
          <Text style={styles.yellowText}>{nearestParking}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  bottomBox: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  yellowBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFC35",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  yellowText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});
