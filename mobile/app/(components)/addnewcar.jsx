import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import API_BASE_URL from '../../config/ipconfig';
import authService from "../services/authService";


export default function CarAdd() {
    const [color, setColor] = useState("#000");
    const [email, onChangeEmail] = React.useState('');
    const [model, onChangeModel] = React.useState('');
    const [licenseplate, onChangelicenseplate] = React.useState('');
    const [make, onchangeMake] = React.useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await authService.getUserData();
                console.log("Logged-in user:", userData);
                setUser(userData);
                onChangeEmail(userData?.email || ""); // set email to field
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async () => {
        if (!licenseplate || !model || !make || !color) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/save_vehicle`, {
                email,
                licenseplate,
                model,
                make,
                color,
            });

            console.log("Vehicle saved:", response.data);
            Alert.alert("Success", "Vehicle saved successfully!");

            // reset form (optional)
            onChangelicenseplate("");
            onChangeModel("");
            onchangeMake("");
            setColor("#000");

        } catch (error) {
            console.error("Error saving vehicle:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.detail || "Something went wrong!");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.maincontainer}>
                {/* 👇 Wrap with KeyboardAvoidingView */}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={80} // adjust if header overlaps
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.carimage}>
                            <Text style={styles.title}>Add Vehicle</Text>
                        </View>
                        <View style={styles.form}>
                            <View style={styles.fieldbackground}>
                                <Text style={styles.lable}> License Plate</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChangelicenseplate}
                                    placeholder=" License Plate"
                                    value={licenseplate}
                                />
                            </View>
                            <View style={styles.fieldbackground}>
                                <Text style={styles.lable}>Model</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChangeModel}
                                    placeholder="Car Model"
                                    value={model}
                                />
                            </View>
                            <View style={styles.fieldbackground}>
                                <Text style={styles.lable}>Colour</Text>
                                <View style={styles.colorInputContainer}>
                                    {/* Color preview box */}
                                    <View style={[styles.colorBox, { backgroundColor: color }]} />

                                    {/* Input field */}
                                    <TextInput
                                        style={styles.colorInput}
                                        placeholder="Enter a color (e.g. #ff0000)"
                                        value={color}
                                        onChangeText={setColor}
                                    />
                                </View>
                            </View>
                            <View style={styles.fieldbackground}>
                                <Text style={styles.lable}>Country</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onchangeMake}
                                    placeholder="Made In .. "
                                    value={make}
                                />
                            </View>
                            <View style={styles.centeraliment}>
                                <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
                                    <Text style={styles.btntext}>Save My Car</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    imagecontainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 150,
        resizeMode: "contain",
    },
    title: {
        position: "absolute",
        color: "#000",   // change to contrast with your svg background
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: -85,
    },
    carimage: {
        alignItems: 'center',
    },
    form: {
        padding: 10,
        gap:10,
    },
    fieldbackground: {
        backgroundColor: '#FFFD78',
        padding: 10,
        borderWidth: 0,
        borderRadius: 18,
    },
    lable: {
        fontSize: 20,
        fontWeight: 800,
    },
    input: {
        height: 60,
        marginVertical: 10,
        borderColor: '#000',
        borderWidth: 0,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 20,
        backgroundColor: '#fff'
    },
    centeraliment: {
        alignItems: 'center',
    },
    submitbtn: {
        backgroundColor: '#FFFC35',
        borderWidth: 0,
        borderColor: '#000',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        width: '80%',
    },
    btntext: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    colorInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#fff",
        borderWidth: 2,
        borderRadius: 8,
        marginVertical: 10,
        paddingHorizontal: 5,
        backgroundColor:'#fff'
    },

    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },

    colorInput: {
        flex: 1,
        height: 50,
        fontSize: 18,
    },
});
