import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from "expo-router";

export default function Appcycle() {
  const router = useRouter();

  // Example parking lot locations
  const locations = [
    { lat: 6.9271, lng: 79.8612 },
    { lat: 6.9280, lng: 79.8625 },
    { lat: 6.9260, lng: 79.8640 },
    { lat: 6.9255, lng: 79.8590 },
    { lat: 6.9278, lng: 79.8570 },
  ];

  // Convert locations to JS array for Leaflet
  const locationsJS = JSON.stringify(locations);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0">
        <style> html, body, #map { height: 100%; margin: 0; padding: 0; } </style>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([6.9271, 79.8612], 14);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);

          // Parking lot icon
          var parkingIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1072/1072562.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          // Add markers
          var locations = ${locationsJS};
          locations.forEach(function(loc) {
            L.marker([loc.lat, loc.lng], {icon: parkingIcon}).addTo(map);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
      />

      <View style={styles.bottomBox}>
        <TouchableOpacity
          style={styles.yellowbar}
          activeOpacity={0.7}
          onPress={() => router.push("/(components)/bokking")}
        >
          <View style={styles.paddingofyellobar}>
            <Text style={styles.yellowbartitles}>Select Your Parking Lot</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomBox: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#FFFC35',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: 350,
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yellowbartitles: {
    color: '#000',
    fontSize: 26,
  },
  yellowbar: {
    width: 306,
    backgroundColor: '#fff',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
