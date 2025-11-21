import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';

// SVG imports
import HomeIcon from '../../assets/images/home.svg';
import SettingsIcon from '../../assets/images/settings.svg';
import CarSelectIcon from "../../assets/images/carselect.svg";
import CircleIcon from "../../assets/images/cycle.svg";
import ListIcon from "../../assets/images/oder-bool.svg";

export default function TabLayout() {
  return (
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
          tabBarIcon: () => <HomeIcon style={styles.icon} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          tabBarIcon: () => <ListIcon style={styles.icon} />,
        }}
      />
      <Tabs.Screen
        name="carselect"
        options={{
          tabBarIcon: () => <CarSelectIcon style={styles.icon} />,
        }}
      />
      <Tabs.Screen
        name="cycle"
        options={{
          tabBarIcon: () => <CircleIcon style={styles.icon} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: () => <SettingsIcon style={styles.icon} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 90,
    paddingBottom: 4,
    marginTop: 2,
    alignItems: 'center',
    borderWidth: 2,
    borderColor:'#000',
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
  icon: {
    marginTop: 10,
    height: 44,
  },
});
