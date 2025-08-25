import React from 'react';
import MapView from 'react-native-maps';
import { useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Appcycle() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      <View style={styles.bottomBox}>
        <TouchableOpacity style={styles.yellowbar} activeOpacity={0.7} onPress={() => router.push("/(components)/bokking")} >
          <View style={styles.paddingofyellobar}>
            <Text style={styles.yellowbartitles}>Billing Information</Text>
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
    bottom: 30, // distance from bottom edge
    alignSelf: 'center', // center horizontally
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
  }
});
