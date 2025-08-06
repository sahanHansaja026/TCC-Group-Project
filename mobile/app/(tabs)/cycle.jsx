import { SafeAreaView, StyleSheet, View, Text, ScrollView } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from 'react';
import TopVector from "../../assets/images/about-page-top-vector.svg";
import MiddleVector from "../../assets/images/about-page-middle-black-vector.svg";
import HowItWork from "../../assets/images/about-middle-yellow.svg";
import RoadMap from "../../assets/images/middle-how-it-work.svg";

export default function AboutPage() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topcontainer}>
            <TopVector style={styles.image1} />
            <MiddleVector style={styles.image2} />
          </View>
          <View style={styles.discriptionbox}>
            <Text style={styles.title}>Description</Text>
            <Text style={styles.normalwords}>
              This AI-powered Car Parking System features a clean, user-friendly interface designed to simplify parking management. It displays real-time slot availability, supports smart reservations, and provides visual feedback for vehicle entry and exit using AI detection. The layout includes an interactive parking map, intuitive icons, and a responsive design optimized for both light and dark modes, ensuring a smooth and modern user experience.
            </Text>
          </View>
          <View style={styles.topcontainer}>
            <HowItWork style={styles.image1} />
            <RoadMap style={styles.image3} />
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
  image1: {
    width: '100%',
    height: '100%',
  },
  image2: {
    width: '100%',
    height: '100%',
    marginTop: -150,
  },
  topcontainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discriptionbox: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 25,
  },
  title: {
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  normalwords: {
    fontSize: 18,
    color: '#555555',
    fontWeight: 'bold',
    marginBottom:-150,
  },
  middlecontainer: {
    width: '100%',
    height: '100%', // or however tall your images are
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image3: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  }
})