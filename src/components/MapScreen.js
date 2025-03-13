import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { Modal, Portal, Text, TextInput, Button, Card, Snackbar } from 'react-native-paper';

const DEFAULT_LOCATION = {
    latitude: 10.6676864,  // Set your default location
    longitude: 75.9888914,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
};


const MapScreen = ({ navigation }) => {
    const mapRef = useRef(null);
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [title, setTitle] = useState('');
    const [locationText, setLocationText] = useState('Fetching...');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [existLocation, setExistLoc] = useState(null);
    const [region, setRegion] = useState(DEFAULT_LOCATION);

    useEffect(() => {
        if (selectedLocation) {
            fetchLocationText(selectedLocation.latitude, selectedLocation.longitude);
        }
    }, [selectedLocation]);
    useEffect(() => {
        if (route.params?.selectedData != undefined) {
            // console.log("---route.params.selectedData", route.params.selectedData);
            let data = route.params.selectedData;
            data.latitudeDelta = 0.01;
            data.longitudeDelta = 0.01;
            const LOCATION = {
                latitude: data.latitude,  // Set your default location
                longitude: data.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
                locationText: data.locationText
            };
            mapRef.current?.animateToRegion(LOCATION, 1000);
            setExistLoc(LOCATION);
            // setSelectedLocation(LOCATION)
            setRegion(LOCATION);

        }

    }, [route]);
    const fetchLocationText = async (lat, lng) => {
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            let data = await response.json();
            // console.log("----data",response,data.display_name);

            setLocationText(data.display_name || 'Unknown Location');
        } catch (error) {
            setLocationText('Error fetching location');
        }
    };

    const handleMapPress = (event) => {
        // console.log("------", event.nativeEvent.coordinate);
        setSelectedLocation(event.nativeEvent.coordinate);
        setTitle('')
        setModalVisible(true);
    };

    const saveLocation = async () => {
        const newLocation = {
            title,
            locationText,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            time: new Date().toLocaleString()
        };
        try {
            let savedLocations = await AsyncStorage.getItem('locations');
            savedLocations = savedLocations ? JSON.parse(savedLocations) : [];
            savedLocations.push(newLocation);
            await AsyncStorage.setItem('locations', JSON.stringify(savedLocations));
            setSnackbarVisible(true)
            setModalVisible(false);
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    return (
        <>
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
            <MapView style={{ flex: 1 }}
                ref={mapRef}
                onPress={(event) => {
                    handleMapPress(event)
                }}
                initialRegion={region}
                onRegionChangeComplete={(updatedRegion) => setRegion(updatedRegion)}
            >
                {selectedLocation && <Marker
                    title={selectedLocation && selectedLocation.locationText ? selectedLocation.locationText : undefined}
                    coordinate={selectedLocation} onPress={() => { }} />}

                {existLocation && <Marker
                    title={existLocation && existLocation.locationText ? existLocation.locationText : undefined}
                    coordinate={existLocation} onPress={() => { }} />}
            </MapView>
            {/* </TouchableWithoutFeedback> */}
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                <Card style={styles.card}>
                    <Card.Title title="Save Location" />
                    <Card.Content>
                        <TextInput
                            label="Enter Title"
                            value={title}
                            onChangeText={setTitle}
                            mode="outlined"
                            style={styles.input}
                        />
                        <Text style={styles.text}>Location: {locationText}</Text>
                        <Text style={styles.text}>Latitude: {selectedLocation?.latitude}</Text>
                        <Text style={styles.text}>Longitude: {selectedLocation?.longitude}</Text>
                    </Card.Content>
                    <Card.Actions style={styles.actions}>
                        <Button mode="contained" onPress={saveLocation} style={styles.saveButton}>
                            Save
                        </Button>
                        <Button mode="outlined" onPress={() => setModalVisible(false)}>
                            Cancel
                        </Button>
                    </Card.Actions>
                </Card>
            </Modal>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000} // 2 seconds
                action={{
                    label: 'OK',
                    onPress: () => setSnackbarVisible(false),
                }}>
                Location saved successfully!
            </Snackbar>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '95%',
        padding: 15,
        borderRadius: 10,
        // backgroundColor:'#a6a6a6'
    },
    input: {
        marginBottom: 10,
    },
    text: {
        marginVertical: 5,
        fontSize: 16,
    },
    actions: {
        justifyContent: 'space-between',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#595959',
    },
});
export default MapScreen