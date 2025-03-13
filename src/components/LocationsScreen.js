import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Modal, Portal, Text, Button, Card } from 'react-native-paper';
const LocationsScreen = ({ navigation }) => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            const savedLocations = await AsyncStorage.getItem('locations');
            if (savedLocations) setLocations(JSON.parse(savedLocations).reverse());
        };
        fetchLocations();
    }, [locations]);

    return (
        <FlatList
            data={locations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={()=>{
                   navigation.navigate("Map",{selectedData:item})
                }}>
                <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.title}>{item.title}</Text>
                    <Text variant="bodyMedium" style={styles.address}> Location:{item.locationText}</Text>
                    <View style={styles.row}>
                        <Text variant="bodySmall" style={styles.latLong}> Lat: {item.latitude}</Text>
                        <Text variant="bodySmall" style={styles.latLong}> Long: {item.longitude}</Text>
                    </View>
                </Card.Content>
            </Card>
            </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    addButton: {
        marginBottom: 10,
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    saveButton: {
        marginTop: 10,
        marginBottom: 10,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    address: {
        color: '#666',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    latLong: {
        color: '#888',
    },
});
export default LocationsScreen