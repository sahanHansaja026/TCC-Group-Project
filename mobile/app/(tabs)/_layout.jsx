import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';

// SVG imports (ensure react-native-svg is installed)
import HomeIcon from '../../assets/images/home.svg';
import SettingsIcon from '../../assets/images/settings.svg';
import CarSelectIcon from "../../assets/images/carselect.svg";
import CircleIcon from "../../assets/images/cycle.svg";
import ListIcon from "../../assets/images/oder-bool.svg";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <HomeIcon style={styles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            tabBarIcon: ({ color }) => (
              <ListIcon style={styles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="carselect"
          options={{
            tabBarIcon: ({ color }) => (
              <CarSelectIcon style={styles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="cycle"
          options={{
            tabBarIcon: ({ color }) => (
              <CircleIcon style={styles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => (
              <SettingsIcon style={styles.icon} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#FFFC35',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 90,
    paddingBottom: 4,
    marginTop: 2,
    alignItems: 'center',
  },
  icon: {
    marginTop: 10,
    height: 44,
  },
});
