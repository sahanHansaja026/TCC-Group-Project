import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CreditCardInput } from 'react-native-credit-card-input';
import API_BASE_URL from '../../config/ipconfig';
import axios from 'axios';

// image import
import CreditCardimage from '../../assets/images/card.png';

export default function CardPage() {
  const [cardData, setCardData] = useState({});
  const [user, setUser] = useState(null);
  const [savedCards, setSavedCards] = useState([]); // plural for multiple cards

  const onChange = (formData) => {
    setCardData(formData);
    console.log('Card Data:', formData);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        console.log("Logged-in user:", userData);
        setUser(userData);

        // fetch cards if exists
        if (userData?.email) {
          fetchCards(userData.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  const fetchCards = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_card/${email}`);
      // make sure it's always an array
      setSavedCards(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.log("No cards found for this user yet.");
      setSavedCards([]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("User not logged in!");
      return;
    }

    const { number, expiry, cvc } = cardData.values || {};
    if (!number || !expiry || !cvc) {
      alert("Please fill in all card details");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/save_card/`, {
        email: user.email,
        cardnumber: number.replace(/\s+/g, ""), // Remove spaces
        cvv: cvc,
        exprire: expiry
      });

      alert("Card saved successfully!");
      // refresh saved cards
      fetchCards(user.email);
    } catch (error) {
      console.error("Error saving card:", error);
      if (error.response) {
        alert(error.response.data.detail || "Failed to save card");
      } else {
        alert("Network or server error");
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.imagecontainer}>
            <Image source={CreditCardimage} style={styles.image} />
          </View>

          <CreditCardInput
            autoFocus
            onChange={onChange}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.label}
            inputStyle={styles.input}
          />

          <View style={styles.centeraliment}>
            <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
              <Text style={styles.btntext}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Show saved cards */}
          {savedCards.length > 0 ? (
            savedCards.map((card, index) => (
              <View key={index} style={styles.cardDisplay}>
                <Text style={styles.cardtitle}>Payment</Text>
                <Text style={styles.cardText}>
                  Card Number: **** **** **** {card.cardnumber.slice(-4)}
                </Text>
                <Text style={styles.cardText}>Expiry: {card.exprire}</Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 10 }}>No saved cards yet.</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagecontainer: {
    alignItems: 'center',
  },
  image: {
    width: 380,
    height: 220,
    resizeMode: 'contain',
  },
  inputContainer: {},
  lable: {
    fontSize: 20,
  },
  input: {
    height: 60,
    marginVertical: 10,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  centeraliment: {
    alignItems: 'right',
    marginLeft: 10,
  },
  submitbtn: {
    backgroundColor: '#FFFD78',
    borderWidth: 0,
    borderColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '50%',
  },
  btntext: {
    fontSize: 22,
    fontWeight: 'bold',
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
});
