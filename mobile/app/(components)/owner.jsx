import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import API_BASE_URL from '../../config/ipconfig';
import axios from "axios";

const IMAGES = [
    require("../../assets/images/slot1.jpg"),
    require("../../assets/images/slot2.png"),
    require("../../assets/images/slot3.png"),
];

import { useLocalSearchParams } from 'expo-router';


export default function Owner() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [lot, setLot] = useState(null);

    const [slots, setSlots] = useState([
        { id: 1, occupied: false },
        { id: 2, occupied: true },
        { id: 3, occupied: false },
        { id: 4, occupied: true },
        { id: 5, occupied: false },
        { id: 6, occupied: false },
    ]);
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % IMAGES.length;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }, 3000); // 3 seconds interval

        return () => clearInterval(interval);
    }, [currentIndex]);
    useEffect(() => {
        // Fetch parking lot details from backend
        axios.get(`${API_BASE_URL}/get_parking_location/${id}`)
            .then(response => setLot(response.data))
            .catch(error => console.log(error));
    }, [id]);

    if (!lot) return <Text>Loading...</Text>;
    return (
        <ScrollView style={styles.container}>
            {/* Auto-scrolling Image Gallery */}
            <FlatList
                ref={flatListRef}
                data={IMAGES}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({ item }) => (
                    <Image source={item} style={styles.image} />
                )}
                style={{ marginVertical: 15 }}
            />
            {/* Parking Info Card */}
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>{lot.lotname}</Text>
                <Text style={styles.infoText}>📍 Location: {lot.location}</Text>
                <Text style={styles.infoText}>🅿️ Total Slots: {slots.length}</Text>
                <Text style={styles.infoText}>
                    ✅ Available Slots: {slots.filter((s) => !s.occupied).length}
                </Text>
            </View>

            {/* Lot Map Section */}
            <Text style={styles.mapTitle}>Parking Lot Map</Text>
            <View style={styles.mapContainer}>
                {slots.map((slot) => (
                    <View
                        key={slot.id}
                        style={[
                            styles.slotBox,
                            { backgroundColor: slot.occupied ? "#ff6b6b" : "#8eff8e" },
                        ]}
                    >
                        <Text style={styles.slotText}>{slot.id}</Text>
                    </View>
                ))}
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(components)/bokking")} >
                <Text style={styles.buttonText}>Create Reservation</Text>
            </TouchableOpacity>
            <View style={styles.scollecontainer}></View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 16,
    },
    image: {
        width: 320,
        height: 180,
        borderRadius: 12,
        marginRight: 12,
    },
    infoCard: {
        backgroundColor: "#f7f7f7",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 4,
    },
    mapTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#2c3e50",
    },
    mapContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        padding: 10,
        marginBottom: 30,
    },
    slotBox: {
        width: 60,
        height: 60,
        borderRadius: 8,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    slotText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    addButton: {
        backgroundColor: "#FFFC35",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 40,
        marginBottom: 20,
    },
    buttonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
    },
    scollecontainer: {
        height: 100,
    },
});
