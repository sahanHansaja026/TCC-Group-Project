import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import authService from '../services/authService';
import API_BASE_URL from '../../config/ipconfig';

export default function Booking() {
    const [open, setOpen] = useState(false);
    const [vehicleID, setVechicleID] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);


    const [slotOpen, setSlotOpen] = useState(false);
    const [slotID, setSlotID] = useState(null);
    const [slotItems, setSlotItems] = useState([]);
    const [slotLoading, setSlotLoading] = useState(true);
    const [savedCards, setSavedCards] = useState([]); // plural for multiple cards

    const [user, setUser] = useState(null);

    const [startTime, setStartTime] = useState('07:00');
    const [endTime, setEndTime] = useState('11:00');
    const [startMeridian, setStartMeridian] = useState('a.m');
    const [endMeridian, setEndMeridian] = useState('a.m');
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [activePicker, setActivePicker] = useState(null);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [cardData, setCardData] = useState({});

    const [currentStep, setCurrentStep] = useState(1);

    // Fetch vehicles
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const userData = await authService.getUserData();
                if (!userData?.email) {
                    Alert.alert("Error", "User email not found.");
                    return;
                }
                const res = await axios.get(`${API_BASE_URL}/get_vehicle/${userData.email}`);
                const carItems = res.data.map((car) => ({
                    label: `${car.licenseplate} - ${car.make} ${car.model}`,
                    value: car.id,
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

    useEffect(() => {
        const loadCards = async () => {
            try {
                const userData = await authService.getUserData();
                if (userData?.email) {
                    await fetchCards(userData.email);
                }
            } catch (error) {
                console.error("Error fetching cards:", error.message);
            }
        };

        loadCards();
    }, []);


    // Fetch slots
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/get_available_slots`);
                const slots = res.data.map((slot) => ({
                    label: `Slot ${slot.slotnumber} - Lot ${slot.parkinglotid}`,
                    value: slot.slotid,
                }));
                setSlotItems(slots);
            } catch (error) {
                console.error("Error fetching slots:", error);
                Alert.alert("Error", "Failed to load available slots.");
            } finally {
                setSlotLoading(false);
            }
        };
        fetchSlots();
    }, []);

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

    const showPicker = (picker) => {
        setActivePicker(picker);
        setPickerVisible(true);
    };

    const hidePicker = () => setPickerVisible(false);

    const handleConfirm = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let meridian = hours >= 12 ? 'p.m' : 'a.m';
        hours = hours % 12 || 12;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}`;

        if (activePicker === 'start') {
            setStartTime(formattedTime);
            setStartMeridian(meridian);
        } else {
            setEndTime(formattedTime);
            setEndMeridian(meridian);
        }
        hidePicker();
    };



    // get total minutes
    const getTotalMinutes = (start, end, startMeridian, endMeridian) => {
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);

        let startHour24 = startMeridian === "p.m" && startH !== 12 ? startH + 12 : startH;
        if (startMeridian === "a.m" && startH === 12) startHour24 = 0;

        let endHour24 = endMeridian === "p.m" && endH !== 12 ? endH + 12 : endH;
        if (endMeridian === "a.m" && endH === 12) endHour24 = 0;

        const startDate = new Date(2024, 0, 1, startHour24, startM);
        const endDate = new Date(2024, 0, 1, endHour24, endM);

        if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }

        const diffMs = endDate - startDate;
        return Math.floor(diffMs / (1000 * 60)); // total minutes
    };

    // Calculate total payment
    const calculatePayment = (start, end, startMeridian, endMeridian, ratePerHour) => {
        const totalMinutes = getTotalMinutes(start, end, startMeridian, endMeridian);
        const totalHours = totalMinutes / 60;
        return Math.ceil(totalHours * ratePerHour); // round up payment
    };


    const fetchCards = async (email) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get_card/${email}`);
            // make sure it's always an array
            setSavedCards(Array.isArray(response.data) ? response.data : [response.data]);
        } catch (erro) {
            console.log("No cards found for this user yet.");
            setSavedCards([]);
        }
    };

    const calculateDuration = (start, end, startMeridian, endMeridian) => {
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);

        let startHour24 = startMeridian === "p.m" && startH !== 12 ? startH + 12 : startH;
        if (startMeridian === "a.m" && startH === 12) startHour24 = 0;

        let endHour24 = endMeridian === "p.m" && endH !== 12 ? endH + 12 : endH;
        if (endMeridian === "a.m" && endH === 12) endHour24 = 0;

        const startDate = new Date(2024, 0, 1, startHour24, startM);
        const endDate = new Date(2024, 0, 1, endHour24, endM);

        if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }

        const diffMs = endDate - startDate;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;

        if (hours === 0) return `${minutes} min`;
        if (minutes === 0) return `${hours} hr`;
        return `${hours} hr ${minutes} min`;
    };

    const handleSubmit = async () => {
        if (!vehicleID || !slotID || !selectedCard) {
            Alert.alert("Error", "Please select a vehicle, a slot, and a card.");
            return;
        }

        try {
            const startTimeStr = `${startTime}:00`;
            const endTimeStr = `${endTime}:00`;
            const dateStr = selectedDate.toISOString().split('T')[0];

            // 1️⃣ First, create booking
            const bookingData = {
                date: dateStr,
                StartTime: startTimeStr,
                EndTime: endTimeStr,
                status: "Occupied",
                DriverID: user?.id,
                VechicalID: vehicleID,
                slotid: slotID
            };

            const bookingRes = await axios.post(`${API_BASE_URL}/create_booking`, bookingData);

            if (bookingRes.status === 200 || bookingRes.status === 201) {
                const booking = bookingRes.data;

                //  Calculate total payment
                const amount = calculatePayment(startTime, endTime, startMeridian, endMeridian, 500);

                const paymentData = {
                    Amount: parseFloat(amount),                    // ✅ matches float
                    date: new Date().toISOString().split("T")[0],  // ✅ gives "YYYY-MM-DD" string → valid date
                    status: "Paid",                                // ✅ string
                    PaymentMethod: "card payment",                 // ✅ string
                    SessionID: parseInt(user.id, 10),
                    SubscriptionID: parseInt(user.id, 10),
                    // ⚠️ must be integer
                };

                const paymentRes = await axios.post(`${API_BASE_URL}/save_payment`, paymentData);

                if (paymentRes.status === 200 || paymentRes.status === 201) {
                    Alert.alert("Success", "Booking & Payment saved successfully!");
                } else {
                    Alert.alert("Error", "Booking saved, but payment failed.");
                }
            } else {
                Alert.alert("Error", "Failed to save booking.");
            }
        } catch (error) {
            console.error("Booking/Payment error:", error);
            Alert.alert("Error", "An error occurred while saving booking/payment.");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.maincontainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* STEP 1 */}
                    {currentStep === 1 && (
                        <View style={styles.container}>
                            <Text style={styles.label}>Select your vehicle</Text>
                            {loading ? (
                                <ActivityIndicator size="large" color="#000" />
                            ) : (
                                <DropDownPicker
                                    open={open}
                                    value={vehicleID}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setVechicleID}
                                    setItems={setItems}
                                    placeholder="Choose your car"
                                    listMode="SCROLLVIEW"
                                    style={styles.dropdown}
                                    textStyle={{ fontSize: 18 }}  // selected value text
                                    labelStyle={{ fontSize: 18 }} // dropdown items text
                                />
                            )}

                            <Text style={styles.label}>Select Available Slot</Text>
                            {slotLoading ? (
                                <ActivityIndicator size="large" color="#000" />
                            ) : (
                                <DropDownPicker
                                    open={slotOpen}
                                    value={slotID}
                                    items={slotItems}
                                    setOpen={setSlotOpen}
                                    setValue={setSlotID}
                                    setItems={setSlotItems}
                                    placeholder="Choose a slot"
                                    listMode="SCROLLVIEW"
                                    style={styles.dropdown}
                                    textStyle={{ fontSize: 18 }}  // selected value text
                                    labelStyle={{ fontSize: 18 }} // dropdown items text
                                />
                            )}

                            <View style={styles.durationContainer}>
                                <Text style={styles.label}>Duration</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity style={styles.timeBox} onPress={() => showPicker('start')}>
                                        <Text style={styles.timeText}>{startTime}</Text>
                                        <Text style={styles.meridian}>{startMeridian}</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.toText}>To</Text>

                                    <TouchableOpacity style={styles.timeBox} onPress={() => showPicker('end')}>
                                        <Text style={styles.timeText}>{endTime}</Text>
                                        <Text style={styles.meridian}>{endMeridian}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <DateTimePickerModal
                                isVisible={isPickerVisible}
                                mode="time"
                                onConfirm={handleConfirm}
                                onCancel={hidePicker}
                            />

                            <View style={styles.centeraliment}>
                                <TouchableOpacity style={styles.submitbtn} onPress={() => setCurrentStep(2)}>
                                    <Text style={styles.btntext}>Next</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* STEP 2.. */}
                    {currentStep === 2 && (
                        <View style={styles.container}>
                            <View style={styles.paymentdetails}>
                                <View style={styles.paymentleftflow}>
                                    <View style={styles.paymenttextroe}>
                                        <Text style={styles.paymenttext}>Driver</Text>
                                        <View style={styles.primerytext}>
                                            <Text style={styles.paymenttext}>{user?.email}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.paymenttextroe}>
                                        <Text style={styles.paymenttext}>Slot:</Text>
                                        <View style={styles.primerytext}>
                                            <Text style={styles.paymenttext}>{slotID}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.paymenttextroe}>
                                        <Text style={styles.paymenttext}>Duration</Text>
                                        <View style={styles.primerytext}>
                                            <Text style={styles.paymenttext}>{calculateDuration(startTime, endTime, startMeridian, endMeridian)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.paymenttextroe}>
                                        <Text style={styles.paymenttext}>Date:</Text>
                                        <View style={styles.primerytext}>
                                            <Text style={styles.paymenttext}>{selectedDate.toDateString()}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.paymenttextroe}>
                                        <Text style={styles.paymenttext}>Per Hour</Text>
                                        <View style={styles.primerytext}>
                                            <Text style={styles.paymenttext}>LKR 500</Text>
                                        </View>
                                    </View>
                                    <View style={styles.paymenttextroe}>
                                        <Text style={styles.paymenttext}>Total Payment:</Text>
                                        <View style={styles.primerytext}>
                                            <Text style={styles.paymenttext}>LKR {calculatePayment(startTime, endTime, startMeridian, endMeridian, 500)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Show saved cards */}
                            {savedCards.length > 0 ? (
                                savedCards.map((card, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.cardRow}
                                        onPress={() => setSelectedCard(card.cardnumber)} // select by cardnumber or id
                                    >
                                        {/* Radio Button */}
                                        <View style={styles.radioOuter}>
                                            {selectedCard === card.cardnumber && <View style={styles.radioInner} />}
                                        </View>

                                        {/* Card Info */}
                                        <View style={styles.cardDisplay}>
                                            <Text style={styles.cardtitle}>Payment</Text>
                                            <Text style={styles.cardText}>
                                                Card Number: **** **** **** {card.cardnumber.slice(-4)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={{ textAlign: "center", marginTop: 10 }}>
                                    No saved cards yet.
                                </Text>
                            )}
                            <View style={styles.centeraliment}>
                                <TouchableOpacity
                                    style={[styles.submitbtn, { backgroundColor: "#ccc" }]}
                                    onPress={() => setCurrentStep(1)}
                                >
                                    <Text style={styles.btntext}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
                                    <Text style={styles.btntext}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    )}

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        paddingHorizontal: 20,
        zIndex: 1000,
    },
    label: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',

    },
    dropdown: {
        minHeight: 50,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 20,
        fontSize: 25,
    },
    durationContainer: {
        marginTop: 30,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeBox: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 150,
    },
    timeText: {
        fontSize: 26,
    },
    meridian: {
        marginLeft: 5,
        fontSize: 24,
    },
    toText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    centeraliment: {
        alignItems: 'center',
        marginTop: 25,
    },
    submitbtn: {
        backgroundColor: '#FFFC35',
        borderWidth: 0,
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
    cardDisplay: {
        marginTop: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#FFFD78',
        marginHorizontal: 10,
    },
    cardText: {
        fontSize: 18,
        fontWeight: '500',
    },
    cardtitle: {
        fontSize: 30,
        marginBottom: 5,
    },
    paymentdetails: {
        alignItems: 'center',
    },
    paymenttitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: -35,
    },
    paymentleftflow: {
        borderWidth: 1,
        width: 350,
        height: 230,
        borderRadius: 25,
        padding: 20,
    },
    paymenttext: {
        fontSize: 18,
    },
    paymenttextroe: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 3,
    },
    primerytext: {
        alignItems: 'flex-start',
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },

    radioOuter: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    radioInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: "#000",
    },

});
