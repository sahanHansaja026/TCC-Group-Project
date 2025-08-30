import React, { useRef, useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import authService from "../services/authService";


// import images
import MyLogo from "../../assets/images/logoimage.png";
import Bell from "../../assets/images/bellicon.png";
import HomeImage from "../../assets/images/home vecotor.png";
import Aiicon from "../../assets/images/Artificial intelligence-amico.png";
import Payment from "../../assets/images/Plain credit card-bro.png";
import CarRide from "../../assets/images/Car rental-rafiki.png";
import Location from "../../assets/images/Location review-amico.png";
import Safe from "../../assets/images/Coronavirus Border Closure-cuate (1).png";
import SafeOfCar from "../../assets/images/Order ride-pana.png"

const { width } = Dimensions.get("window");

export default function Home() {
  const ads = [
    { id: "1", text: "Book Your Spot in Advance 📲", image: require("../../assets/images/Order ride-rafiki.png") },
    { id: "2", text: "Secure Parking Available 24/7 🚗", image: require("../../assets/images/street paid parking-pana.png") },
    { id: "3", text: "Safe & Affordable Parking Near You 🔐", image: require("../../assets/images/Take Away-pana.png") },
  ];

  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState(null);
  
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (index + 1) % ads.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

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

  return (
    <SafeAreaProvider>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <View style={styles.maincantainer}>
            <View style={styles.rowcontainer}>
              <View style={styles.logo}>
                <Image source={MyLogo} style={styles.logoimage} />
                <Text style={styles.logoText}>
                  EasyPark
                </Text>
              </View>
              <View style={styles.bellcontainer}>
                <Image source={Bell} style={styles.bell} />
              </View>
            </View>
            <Text style={styles.welcome}>
              Hello {user?.username ?? 'Guest'}{'\n'}
              {getGreeting()}!
            </Text>
          </View>
          <View style={styles.yellowcontainer}>
            <Image source={HomeImage} style={styles.homeimage} />
          </View>
          <View style={styles.iconcontainer}>
            <View style={styles.iconrow}>
              <View style={styles.icon}>
                <Image source={Aiicon} style={styles.iconimages} />
              </View>
              <View style={styles.icon}>
                <Image source={Payment} style={styles.iconimages} />
              </View>
              <View style={styles.icon}>
                <Image source={CarRide} style={styles.iconimages} />
              </View>
            </View>
            <View style={styles.iconrow}>
              <View style={styles.icon}>
                <Image source={Location} style={styles.iconimages} />
              </View>
              <View style={styles.icon}>
                <Image source={Safe} style={styles.iconimages} />
              </View>
              <View style={styles.icon}>
                <Image source={SafeOfCar} style={styles.iconimages} />
              </View>
            </View>

          </View>
          <View style={styles.slideshow}>
            <FlatList
              ref={flatListRef}
              data={ads}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.slide}>
                  <Image source={item.image} style={styles.image} />
                  <Text style={styles.text}>{item.text}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {ads.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, index === i ? styles.activeDot : null]}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  maincantainer: {
    width: "100%",
    height: 265,
    backgroundColor: "#fff",

  },
  rowcontainer: {
    flexDirection: "row",
  },
  bellcontainer: {
    marginLeft:90,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  logoimage: {
    width: 105,
    height: 105,
  },
  logoText: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  bell: {
    width: 75,
    height: 75,
    marginTop: 40,
  },
  slideshow: {
    padding: 0,
  },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  image: {
    width: width * 0.9,
    height: 180,
    borderRadius: 12,
    resizeMode: "cover"
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center"
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  welcome: {
    fontSize: 28,
    color: '#000',
    marginLeft: 30,
    fontWeight: 'bold',
  },
  yellowcontainer: {
    width: "100%",
    height: 265,
    backgroundColor: "#FFFC35",
    justifyContent: 'center',  /* Center horizontally */
    alignItems: 'flex-end',  /* Push content to bottom */
    marginBottom: 20,
  },
  homeimage: {
    width: "100%",
    height: 280,
  },
  iconcontainer: {
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  iconrow: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50
  },
  icon: {
    width: 85,
    height: 85,
    backgroundColor: '#FFFD78',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent:'center',
  },
  iconimages: {
    width: 75,
    height:75,
  }
});
