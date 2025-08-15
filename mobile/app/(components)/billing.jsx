import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CreditCardInput } from 'react-native-credit-card-input';
import API_BASE_URL from '../../config/ipconfig';
import axios from 'axios';

// svg import
import CreditCardimage from '../../assets/images/card.png';

export default function CardPage() {
  const [cardData, setCardData] = useState({});
  const [user, setUser] = useState(null);


  const onChange = (formData) => {
    setCardData(formData);
    console.log('Card Data:', formData);
  };

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await authService.getUserData();
          console.log("Logged-in user:", userData);
          setUser(userData); // Save to state
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      };
  
      fetchUserData();
    }, []);
  
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
      const response = await axios.post(`${API_BASE_URL}/save_card/`, {
        email: user.email,
        cardnumber: number.replace(/\s+/g, ""), // Remove spaces
        cvv: cvc,
        exprire: expiry
      });

      alert("Card saved successfully!");
      console.log("Saved card:", response.data);
    } catch (error) {
      console.error("Error saving card:", error);
      if (error.response) {
        // Backend returned a response with an error status
        alert(error.response.data.detail || "Failed to save card");
      } else {
        alert("Network or server error");
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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
  inputContainer: {
    // Customize input container styles here
  },
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
    marginLeft:10,
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
    fontWeight: 'bold'
  },
});
