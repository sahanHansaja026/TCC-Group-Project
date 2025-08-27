import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView, } from 'react-native';
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

    // New state for slots
    const [slotOpen, setSlotOpen] = useState(false);
    const [slotID, setSlotID] = useState(null);
    const [slotItems, setSlotItems] = useState([]);
    const [slotLoading, setSlotLoading] = useState(true);

    const [user, setUser] = useState(null);

    // Duration state
    const [startTime, setStartTime] = useState('07:00');
    const [endTime, setEndTime] = useState('11:00');
    const [startMeridian, setStartMeridian] = useState('a.m');
    const [endMeridian, setEndMeridian] = useState('a.m');
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [activePicker, setActivePicker] = useState(null);

    const [selectedDate, setSelectedDate] = useState(new Date()); // default today

    // Fetch user vehicles
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

    // Fetch available slots
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

    // Time Picker functions
    const showPicker = (picker) => {
        setActivePicker(picker);
        setPickerVisible(true);
    };

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

    const handleSubmit = async () => {
        if (!vehicleID || !slotID) {
            Alert.alert("Error", "Please select a vehicle and a slot.");
            return;
        }

        try {
            // Convert start/end time strings ("07:00") to "HH:MM:SS" format
            const startTimeStr = `${startTime}:00`; // "07:00:00"
            const endTimeStr = `${endTime}:00`;

            // Convert selectedDate to YYYY-MM-DD
            const dateStr = selectedDate.toISOString().split('T')[0];

            const bookingData = {
                date: dateStr,
                StartTime: startTimeStr,
                EndTime: endTimeStr,
                status: "Occupied", // default status
                DriverID: user?.id,
                VechicalID: vehicleID,
                slotid: slotID
            };

            const res = await axios.post(`${API_BASE_URL}/create_booking`, bookingData);

            if (res.status === 200 || res.status === 201) {
                Alert.alert("Success", "Booking saved successfully!");
            } else {
                Alert.alert("Error", "Failed to save booking.");
            }

        } catch (error) {
            console.error("Booking error:", error);
            Alert.alert("Error", "An error occurred while saving the booking.");
        }
    };


    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.maincontainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.container}>
                        <Text>DriverID = {user?.id ?? 'Guest'}</Text>

                        {/* Vehicle Dropdown */}
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
                            />
                        )}

                        {/* Slot Dropdown */}
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
                            />
                        )}

                        {/* Duration Selector */}
                        <View style={styles.durationContainer}>
                            <Text style={styles.label}>Duration</Text>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.timeBox}
                                    onPress={() => showPicker('start')}
                                >
                                    <Text style={styles.timeText}>{startTime}</Text>
                                    <Text style={styles.meridian}>{startMeridian}</Text>
                                </TouchableOpacity>

                                <Text style={styles.toText}>To</Text>

                                <TouchableOpacity
                                    style={styles.timeBox}
                                    onPress={() => showPicker('end')}
                                >
                                    <Text style={styles.timeText}>{endTime}</Text>
                                    <Text style={styles.meridian}>{endMeridian}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Time Picker Modal */}
                        <DateTimePickerModal
                            isVisible={isPickerVisible}
                            mode="time"
                            onConfirm={handleConfirm}
                            onCancel={hidePicker}
                        />
                    </View>
                    <View style={styles.centeraliment}>
                        <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
                            <Text style={styles.btntext}>Occupied</Text>
                        </TouchableOpacity>
                    </View>
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
});
