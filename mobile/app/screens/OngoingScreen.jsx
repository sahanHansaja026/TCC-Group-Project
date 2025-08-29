import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import API_BASE_URL from '../../config/ipconfig';
import { useRouter } from "expo-router";
import authService from "../services/authService";
import StartDotimage from "../../assets/images/dotstart.png"
import EndDotimage from "../../assets/images/enddot.png";

export default function OngoingScreen() {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await authService.getUserData();
                setUser(userData);

                if (userData?.id) {
                    // Fetch bookings for this driver
                    const response = await axios.get(
                        `${API_BASE_URL}/bookings/${userData.id}/occupied`
                    );

                    setBookings(response.data || []);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Ongoing Vehicles Content</Text>
            <Text style={styles.subHeader}>Driver ID: {user?.id ?? "Guest"}</Text>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : bookings.length > 0 ? (
                bookings.map((booking, index) => (
                    <View key={index} style={styles.bookingCard}>
                        <View style={styles.boxhedder}>
                            <Text style={styles.bookingIdtext}>{booking.BookingID}</Text>
                            <View style={styles.setdateandtime}>
                                <Text style={styles.bookingText}>{booking.date}</Text>
                                <Text style={styles.bookingText}>{booking.StartTime}</Text>
                            </View>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.timecontainer}>
                            <View style={styles.showtime}>
                                <Image source={StartDotimage} style={styles.dotimage} />
                                <Text style={styles.bookingText}>{booking.StartTime}</Text>
                            </View>
                            <View style={styles.showtime}>
                                <Image source={EndDotimage} style={styles.dotimage} />
                                <Text style={styles.bookingText}>{booking.EndTime}</Text>
                            </View>
                            
                        </View>

                        
                        
                        <Text style={styles.bookingText}>Status: {booking.status}</Text>
                    </View>
                ))
            ) : (
                <Text style={{ marginTop: 20, fontSize: 16 }}>No bookings found.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        marginBottom: 16,
    },
    bookingCard: {
        backgroundColor: "#FFFD78",
        padding: 12,
        marginBottom: 12,
        width: 380,
        height: 250,
        borderWidth: 1,
        borderColor: "#FFFD78",
        borderRadius: 25, // half of height/width for rounded corners
    },
    bookingIdtext: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    bookingText: {
        fontSize: 18,
        marginBottom: 4,
    },

    buttonText: {
        color: "#fff",
        fontSize: 14,
    },
    separator: {
        height: 2,
        backgroundColor: "#000", // line color
        marginVertical: 8,
    },
    boxhedder: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 220,
    },
    setdateandtime: {
        flexDirection: 'column',

    },
    dotimage: {
        width: 55,
        height: 55,
    },
    timecontainer: {
        flexDirection:'column',
    },
    showtime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap:15,
    }
});
