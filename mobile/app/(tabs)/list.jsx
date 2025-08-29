import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import Headersvg from "../../assets/cars/modernhedder.svg";
import { SafeAreaProvider } from "react-native-safe-area-context";

import OngoingScreen from "../screens/OngoingScreen";
import CompletedScreen from "../screens/CompletedScreen";
import CancelledScreen from "../screens/CancelledScreen";

export default function BookingTabs() {
  const [activeTab, setActiveTab] = useState("Completed");

  const tabs = ["Ongoing", "Completed", "Cancelled"];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.maincontainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.imagecontainer}>
              <Headersvg style={styles.image} />
              <Text style={styles.title}>Vehicle Management</Text>
            </View>

            <View style={styles.tabContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.content}>
              {activeTab === "Ongoing" && <OngoingScreen />}
              {activeTab === "Completed" && <CompletedScreen />}
              {activeTab === "Cancelled" && <CancelledScreen />}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  imagecontainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain"
  },
  title: {
    position: "absolute",
    color: "#000",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -85,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFEC7",
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 5,
    marginTop: -80,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500"
  },
  activeTab: {
    borderBottomWidth: 3,       // thickness of the underline
    borderBottomColor: "#000", // gold color
    paddingBottom: 5             // spacing from text
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700"
  },
  content: {
    marginTop: 20,
    alignItems: "center"
  },
});
