import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import API_BASE_URL from '../../config/ipconfig';
import authService from "../services/authService";
import StartDotimage from "../../assets/images/dotstart.png"
import EndDotimage from "../../assets/images/enddot.png";
import MonyIcon from "../../assets/images/money.png"

export default function CompleteScreen() {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId;

        const fetchData = async () => {
            try {
                const userData = await authService.getUserData();
                setUser(userData);

                if (userData?.id) {
                    // Fetch bookings
                    const bookingsRes = await axios.get(
                        `${API_BASE_URL}/bookings/${userData.id}/completed`
                    );
                    setBookings(bookingsRes.data || []);

                    // Fetch payments by subscriptionID == user.id
                    const paymentsRes = await axios.get(
                        `${API_BASE_URL}/payments/subscription/${userData.id}`
                    );
                    setPayments(paymentsRes.data || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchData();

        // Auto-refresh every 30 seconds
        intervalId = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    // Merge bookings + payments by index (assumes 1-to-1 match)
    const combinedData = bookings.map((booking, index) => ({
        booking,
        payment: payments[index] || null,
    }));

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <>
                    {/* ----- Combined Bookings + Payments ----- */}
                    {combinedData.length > 0 ? (
                        combinedData.map((item, index) => (
                            <View key={index} style={styles.bookingCard}>
                                {/* Booking Details */}
                                <View style={styles.boxhedder}>
                                    <Text style={styles.bookingIdtext}>{item.booking.BookingID}</Text>
                                    <View style={styles.setdateandtime}>
                                        <Text style={styles.bookingText}>{item.booking.date}</Text>
                                        <Text style={styles.bookingText}>{item.booking.StartTime}</Text>
                                    </View>
                                </View>
                                <View style={styles.separator} />
                                <View style={styles.timecontainer}>
                                    <View style={styles.showtime}>
                                        <Image source={StartDotimage} style={styles.dotimage} />
                                        <Text style={styles.bookingText}>{item.booking.StartTime}</Text>
                                    </View>
                                    <View style={styles.showtime}>
                                        <Image source={EndDotimage} style={styles.dotimage} />
                                        <Text style={styles.bookingText}>{item.booking.EndTime}</Text>
                                    </View>
                                </View>

                                {/* Payment Details */}
                                {item.payment ? (
                                    <View style={styles.paymentContainer}>
                                        <Text style={styles.bookingText}>Method: {item.payment.PaymentMethod}</Text>
                                        <View style={styles.pamentshow}>
                                            <Image source={MonyIcon} style={styles.dotimage} />
                                            <Text style={styles.monytext}>LKR{ " "}{item.payment.Amount}</Text>
                                        </View>                                    
                                    </View>
                                ) : (
                                    <Text style={{ marginTop: 10, fontSize: 16 }}>No payment found for this booking.</Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={{ marginTop: 20, fontSize: 16 }}>No completed bookings found.</Text>
                    )}
                </>
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
        height:"auto",
        borderWidth: 1,
        borderColor: "#FFFD78",
        borderRadius: 25, // half of height/width for rounded corners
    },
    bookingIdtext: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    bookingText: {
        fontSize: 20,
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
        flexDirection: 'column',
    },
    showtime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    pamentshow: {
        flexDirection: 'row',
        marginLeft: 180,
        alignItems: 'center',
        gap:10,
    },
    monytext: {
        fontSize:25,
    }
});