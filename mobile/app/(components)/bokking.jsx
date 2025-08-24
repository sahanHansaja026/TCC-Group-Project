import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Bokking() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple 🍎', value: 'apple' },
        { label: 'Banana 🍌', value: 'banana' },
        { label: 'Orange 🍊', value: 'orange' },
    ]);

    return (
        <View style={styles.container}>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select a fruit"
                listMode="SCROLLVIEW"
                style={styles.dropdown}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        paddingHorizontal: 20,
        zIndex: 1000,
    },
    dropdown: {
        borderColor: '#ccc',
    },
});