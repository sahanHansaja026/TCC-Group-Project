import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Custom header component
function CustomHeader({ title, subtitle, onBack }) {
    return (
        <View style={styles.headerContainer}>
            {/* Back button */}
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={34} color="black" />
            </TouchableOpacity>

            {/* Texts */}
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && (
                    <Text style={styles.subtitle} numberOfLines={3} ellipsizeMode="tail">
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>

    );
}

// Main stack layout
export default function Componentlayout() {
    return (
        <Stack
            screenOptions={{
                header: ({ navigation, options }) => (
                    <CustomHeader
                        title={options.title}
                        subtitle="Store your card safely and enjoy quick, hassle-free payments with top-level security."
                        onBack={navigation.goBack}
                    />
                ),
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "My Profile",
                    header: ({ navigation, options }) => (
                        <CustomHeader
                            title={options.title}
                            subtitle="Set up your profile so we can tailor the app experience just for you"
                            onBack={navigation.goBack}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="help"
                options={{
                    title: "Help And Support",
                    header: ({ navigation, options }) => (
                        <CustomHeader
                            title={options.title}
                            subtitle="Find answers and get the support you need"
                            onBack={navigation.goBack}
                        />
                    ),
                }}
            />
            <Stack.Screen name="billing" options={{ title: "Billing Information" }} />
            <Stack.Screen name="aboutus" options={{ title: "About Us" }} />
            <Stack.Screen
                name="bokking"
                options={{
                    header: ({ navigation }) => (
                        <CustomHeader
                            title="Parking Reservation"
                            subtitle="Booking your parking in advance helps you save time, avoid hassle, and ensure a spot is always ready for you."
                            onBack={navigation.goBack}
                        />
                    ),
                }}
            />
        </Stack>
    );
}

// Styles
const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#fff000", // yellow background
        padding: 16,
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        height: 185,
    },
    backButton: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1, // takes remaining width
    },
    title: {
        marginTop: 10,
        fontSize: 25,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 15,
        color: "#000",
        flexWrap: "wrap", // allows wrapping
    },
});
