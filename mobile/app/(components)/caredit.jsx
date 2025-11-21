import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import API_BASE_URL from '../../config/ipconfig';

export default function CarDetils() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/get_vehicle_by_id/${id}`);
                setVehicle(res.data);
            } catch (err) {
                setError("Failed to load vehicle details");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleDetails();
    }, [id]);

    const handleDelete = async () => {
        Alert.alert(
            "Delete Vehicle",
            "Are you sure you want to delete this vehicle?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_BASE_URL}/delete_vehicle/${id}`);
                            Alert.alert("Success", "Vehicle deleted successfully");
                            router.back(); // Navigate to previous screen
                        } catch {
                            Alert.alert("Error", "Failed to delete vehicle");
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vehicle Details</Text>
            <View style={styles.card}>
                <DetailRow label="License Plate" value={vehicle.licenseplate} />
                <DetailRow label="Make" value={vehicle.make} />
                <DetailRow label="Model" value={vehicle.model} />
                <DetailRow label="Color" value={vehicle.color} />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => router.push({ pathname: "/(components)/editvehicle", params: { id } })}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function DetailRow({ label, value }) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    card: { backgroundColor: "#FFF", borderRadius: 12, padding: 20, elevation: 5 },
    row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
    label: { fontSize: 16, color: "#888" },
    value: { fontSize: 16, fontWeight: "bold" },
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 30 },
    editButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, width: "40%", alignItems: "center" },
    deleteButton: { backgroundColor: "#E53935", padding: 15, borderRadius: 10, width: "40%", alignItems: "center" },
    buttonText: { color: "#FFF", fontWeight: "bold" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { color: "red" }
});
