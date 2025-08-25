import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import authService from '../services/authService';
import API_BASE_URL from '../../config/ipconfig';

export default function Bokking() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const userData = await authService.getUserData();
                if (!userData?.email) {
                    Alert.alert("Error", "User email not found.");
                    return;
                }

                const res = await axios.get(`${API_BASE_URL}/get_vehicle/${userData.email}`);

                // Convert API response into dropdown items
                const carItems = res.data.map((car) => ({
                    label: `${car.licenseplate} - ${car.make} ${car.model}`,
                    value: car.licenseplate,
                }));

                setItems(carItems);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                Alert.alert("Error", "Failed to load vehicles.");
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select your vehicle</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Choose your car"
                    listMode="SCROLLVIEW"
                    style={styles.dropdown}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        paddingHorizontal: 20,
        zIndex: 1000,
    },
    label: {
        fontSize: 25,
        marginBottom: 10,
        fontWeight: "bold",
    },
    dropdown: {
        borderColor: '#ccc',
        minHeight: 50,
        fontSize:25,
    },
});
