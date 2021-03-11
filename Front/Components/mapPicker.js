// Imports all the stuff needed
import React, { useState, useEffect, Component } from "react";
import {
    Text,
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Alert,
    Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from "react-native-geocoding";
import * as firebase from "firebase/app";
import "firebase/firestore";

// NOTE: internal commentary dosn't have spell check, sorry

export default class Map extends Component {
    // Constructor that inits some variables
    constructor(props) {
        super(props);
        // Inits the state object
        this.state = {
            // Inits the users coords to default 0, 0 and as zoomed out as possible
            latitude: 0,
            longitude: 0,
            latitudeDelta: 200,
            longitudeDelta: 200,
            // The location has not been set so this defaults to false
            locationset: false,
            // Empty variables for the coordinates, the lat and long extracted from it as well as bool to hold if a merker has been set.
            MarkerArray: [],
            MarkerLatitude: "",
            MarkerLongitude: "",
            MarkerChosen: false,
        };

        this.connection = props.connection;
    }

    // When the map is pressed gets the coodinates of where on the map, this is used by the <Marker> to create a merker where the user has tapped
    onMapPress(e) {
         this.setState({
            MarkerArray: [e.nativeEvent.coordinate],
            MarkerLatitude: [e.nativeEvent.coordinate.latitude],
            MarkerLongitude: [e.nativeEvent.coordinate.longitude],
            MarkerChosen: true,
          })
    }

    // The button the user presses when they want to submit, is displayed when a marker is placed
    // TODO: This should return the location data to where the post is being created instead of printing it
    // To whoever is making this work with the post creating process this is the only part you should need to edit
    submitButton(){
      return(
        <Button
          onPress={() => Alert.alert("Submitt this.state.MarkerLatitude and this.state.MarkerLongitude")}
          title="Submit Location"
          color="#111"
          accessibilityLabel="Submit the indicated location."
        />
      );
    }

    // The button displayed before the user places a marker on the map
    placeholderButton(){
      return(
        <Button
          onPress={() => Alert.alert("Please tap to add a marker to the map before submiting.")}
          title="Please select location"
          color="#111"
          accessibilityLabel="Please select location on map."
        />
      )
    }

    async componentDidMount() {
        console.log("Components mounted.");
        try {
            // Asks the user for permission
            let { status } = await Location.requestPermissionsAsync();
            // If permission is not given an alert is given
            if (status !== "granted") {
                console.log("Location Premission Not Granted!");
                this.setState({ locationset: true });
                Alert.alert(
                    "Location Premission Not Granted!",
                    "To have this screen default to your location please enable location services for this app."
                );
                return;
            }
            // Gets the last known location of the user
            let location = await Location.getLastKnownPositionAsync();
            // Saves it in the state varable
            this.setState({ latitude: location.coords.latitude });
            this.setState({ longitude: location.coords.longitude });
            this.setState({ latitudeDelta: 0.2 });
            this.setState({ longitudeDelta: 0.2 });
            this.setState({ locationset: true });
            // If an error occurs, such as the emulator not have a location set it is caught and an alert is made.
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error reading location!",
                "If using an Emulator please ensure a location is selected in the emulator options."
            );
            this.setState({ locationset: true });
        }
    }

    render() {
        // Unexplained thing, possibly due to the async being used above the app would ignore the componentDidMount() at first,
        // it would be run later but this would result in the map being generated with defualt values, this stops it by not allowing the map to be
        // genereated untill the users location has been atempted to be obtained, thats why this.state.locationset is used

        // Generates the map using the user location as its inital region,
        // If the map is pressed it calls the onMapPress fucnction to get the latitude and longitude of where the user tapped and places a marker there.
        if (this.state.locationset == true) {
            return (
                <SafeAreaView style={styles.container}>
                    <MapView
                        style={StyleSheet.absoluteFillObject}
                        provider={MapView.PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: this.state.latitudeDelta,
                            longitudeDelta: this.state.longitudeDelta,
                        }}
                        onPress={e => this.onMapPress(e)}
                        mapType='standard'
                    >
                    {this.state.MarkerArray.map(marker => (
                       <Marker
                          coordinate={marker}
                          key="0"
                       />
                    ))}
                    </MapView>
                    <View>
                      <Text style={{backgroundColor: "#fff"}}> latitude: {this.state.MarkerLatitude} </Text>
                      <Text style={{backgroundColor: "#fff"}}> longitude: {this.state.MarkerLongitude} </Text>
                    </View>
                    {this.state.MarkerChosen ? this.submitButton() : this.placeholderButton()}
                </SafeAreaView>
            );
        } else {
            // In case the program hasnt attempted to get the user location
            return null;
        }
    }
}

// css style stuff
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: "#fff",

    },
});
