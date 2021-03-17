// Imports all the stuff needed
import React, { useState, useEffect, Component } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from "react-native-geocoding";

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
      // Empty set for the map markers to be put in
      MarkerArray: [],
    };

    this.connection = props.connection;
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
         console.log({location});
      // Saves it in the state varable
      if (location == null) {Alert.alert("'user location = null' error!"); this.setState({ locationset: true });}
      else if (location.coords == null) {Alert.alert("'user coords = null' error!"); this.setState({ locationset: true });}
      else if (location.coords.latitude == null || location.coords.longitude == null) {Alert.alert("'user latitude or longitude = null' error!"); this.setState({ locationset: true });}
      else{
        this.setState({ latitude: location.coords.latitude });
        this.setState({ longitude: location.coords.longitude });
        this.setState({ latitudeDelta: 0.2 });
        this.setState({ longitudeDelta: 0.2 });
        this.setState({ locationset: true });
      }
      // If an error occurs, such as the emulator not have a location set it is caught and an alert is made.
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error reading location!",
        "If using an Emulator please ensure a location is selected in the emulator options."
      );
      this.setState({ locationset: true });
    }

    // Gets the array of markers with locations
    // Converts to json
    // Puts in the state variable MarkerArray
    // Catches any arror with the marker obtaining and makes an alert
    this.connection
      .getMap()
      //.then((response) => response.json())
      .then((response) => {
        //console.log(response);
        this.setState({ MarkerArray: response });
      })
      .catch((error) => {
        Alert.alert(
          "Error loading pictures!",
          "Could not load the markers from the server."
        );
        console.log("Error loading pictures!");
      });
  }

  render() {
    // Unexplained thing, possibly due to the async being used above the app would ignore the componentDidMount() at first,
    // it would be run later but this would result in the map being generated with defualt values, this stops it by not allowing the map to be
    // genereated untill the users location has been atempted to be obtained, thats why this.state.locationset is used

    // Generates the map using the user location as its inital region, then a function adds all the markers from the MarkerArray
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
            mapType="standard"
          >
            {this.state.MarkerArray.map((m) => {
              return (
                <MapView.Marker
                  coordinate={{
                    latitude: m.GPS.latitude,
                    longitude: m.GPS.longitude,
                  }}
                  key={m.ID}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={{ uri: m.icon }}
                      style={{ width: 80, height: 80 }}
                    />
                    <Text style={{ backgroundColor: "#fff" }}> {m.ID} </Text>
                  </View>
                </MapView.Marker>
              );
            })}
          </MapView>
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
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
