import {
    SafeAreaView, StyleSheet, View,Text, ScrollView, Image,TouchableOpacity,Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/ipconfig";
import { useRouter } from "expo-router";
import authService from "../services/authService";
import ArrowIcon from "../../assets/images/settings-arrow.svg";
import GestImage from "../../assets/images/ui-profile-icon-vector.jpg";

export default function MyProfile() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const router = useRouter();
    const [loadingProfile, setLoadingProfile] = useState(true);
    const isFocused = useIsFocused();

    // Fetch User Auth Data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await authService.getUserData();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };
        fetchUserData();
    }, []);

    // Fetch Profile Data
    useEffect(() => {
        if (!user?.email) return;

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/profile/email`, {
                    params: { email: user.email },
                });
                setProfile(response.data);
            } catch (error) {
                setProfile(null);
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [user, isFocused]);

    // Delete Profile Handler
    const handleDeleteProfile = () => {
        Alert.alert(
            "Delete Profile",
            "Are you sure you want to delete your profile? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_BASE_URL}/profile/${profile?._id}`);
                            await authService.logout();
                            router.replace("/settings"); // Navigate to login screen
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete profile.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profile Image Section */}
                    <View style={styles.profileSection}>
                        <Image
                            source={
                                profile?.profileimage
                                    ? { uri: `data:image/jpeg;base64,${profile.profileimage}` }
                                    : GestImage
                            }
                            style={styles.profileImage}
                        />
                        <Text style={styles.profileName}>
                            {profile?.name || "Guest User"}
                        </Text>
                        <Text style={styles.emailText}>{user?.email || ""}</Text>
                    </View>

                    {/* Personal Information */}
                    <View style={styles.detailsContainer}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <ProfileField label="Full Name" value={profile?.name} />
                        <ProfileField label="Email" value={profile?.email} />
                        <ProfileField label="Phone" value={profile?.contact || "N/A"} />
                    </View>

                    {/* Edit Profile Button */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push("/(components)/editprofile")}
                    >
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    {/* Delete Profile Button */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteProfile}
                    >
                        <Text style={styles.deleteText}>Delete Profile</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const ProfileField = ({ label, value }) => (
    <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value || "Not Available"}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FD",
    },
    profileSection: {
        alignItems: "center",
        marginTop: 50,
        paddingBottom: 20,
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: "#fff",
    },
    profileName: {
        fontSize: 22,
        fontWeight: "600",
        marginTop: 12,
    },
    emailText: {
        fontSize: 14,
        color: "gray",
    },
    detailsContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 15,
        padding: 15,
        elevation: 4,
    },
    fieldContainer: {
        marginBottom: 12,
    },
    fieldLabel: {
        fontSize: 14,
        color: "#666",
    },
    fieldValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#222",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFD78",
        marginHorizontal: 80,
        marginTop: 30,
        padding: 12,
        borderRadius: 25,
    },
    editButtonText: {
        color: "#000",
        fontSize: 20,
        fontWeight: "500",
    },
    deleteButton: {
        marginTop: 15,
        alignItems: "center",
    },
    deleteText: {
        color: "red",
        fontSize: 20,
        fontWeight: "600",
    },
});
