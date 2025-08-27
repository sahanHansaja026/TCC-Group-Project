import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function OngoingScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.text}>Ongoing Vehicles Content</Text>
            {/* You can add more content here */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({

});
