import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import API_BASE_URL from '../../config/ipconfig';
import authService from "../services/authService";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileEdit() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    // Load user + profile details
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = await authService.getUserData();
                setUser(userData);

                // Fetch profile from backend
                const res = await axios.get(`${API_BASE_URL}/profile/email`, {
                    params: { email: userData.email }
                });

                const profile = res.data;

                setName(profile.name || "");
                setContact(profile.contact || "");

                // Convert base64 image
                if (profile.profileimage) {
                    setProfileImage(`data:image/jpeg;base64,${profile.profileimage}`);
                }

            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
    }, []);

    // Pick image from gallery
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Take photo
    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Save to backend
    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("email", user.email);
            formData.append("name", name);
            formData.append("contact", contact);

            if (profileImage && profileImage.startsWith("file")) {
                formData.append("profileimage", {
                    uri: profileImage,
                    type: "image/jpeg",
                    name: "profile.jpg",
                });
            }

            await axios.post(`${API_BASE_URL}/profile/update`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Profile Updated Successfully");

        } catch (err) {
            console.log("Update failed:", err);
            alert("Update failed");
        }
    };

    return (
        <SafeAreaProvider>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"                >
                    <SafeAreaView style={styles.container}>
                        {/* Avatar */}
                        <View style={styles.avatarContainer}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.avatar} />
                            ) : (
                                <Ionicons name="person-circle-outline" size={130} color="#777" />
                            )}
                        </View>

                        {/* Photo Buttons */}
                        <View style={styles.photoButtons}>
                            <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
                                <Ionicons name="image-outline" size={24} color="#000" />
                                <Text style={styles.photoBtnText}>Gallery</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                                <Ionicons name="camera-outline" size={24} color="#000" />
                                <Text style={styles.photoBtnText}>Camera</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form */}
                        <View style={styles.card}>

                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Your full name"
                            />

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: "#eee" }]}
                                value={user?.email || ""}
                                editable={false}
                            />

                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={contact}
                                onChangeText={setContact}
                                placeholder="Enter phone number"
                                keyboardType="numeric"
                            />

                        </View>

                        <View style={styles.savecontainer}>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveText}>Update Profile</Text>
                            </TouchableOpacity>
                        </View>

                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        marginTop:20,
    },
    scroll: { padding: 20 },
    header: {
        fontSize: 28,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 20,
    },

    avatarContainer: {
        alignItems: "center",
        marginBottom: 15
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 100,
        borderWidth: 0,
        borderColor: "#000",
    },

    photoButtons: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        marginBottom: 25,
    },
    photoBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFD78",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
    },
    photoBtnText: { color: "#000", fontSize: 18, marginLeft: 6 },

    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        borderWidth: 0,
        borderColor: "#000",
        marginBottom: 25,
    },

    label: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 10
    },
    input: {
        height: 55,
        borderWidth: 2,
        borderColor: "#000",
        paddingHorizontal: 12,
        borderRadius: 10,
        marginTop: 8,
        fontSize: 18,
    },

    saveBtn: {
        backgroundColor: "#FFFC35",
        borderWidth: 0,
        borderColor: "#000",
        paddingVertical: 15,
        borderRadius: 12,
        width:250,
    },
    saveText: {
        textAlign: "center",
        fontSize: 22,
    },
    savecontainer: {
        alignItems: 'center',
        justifyContent:'center'
    }
});
