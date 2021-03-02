import React, {useState, useEffect, Component} from "react";
import { Text, StyleSheet, SafeAreaView, View, Image , Alert } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Geocoder from 'react-native-geocoding';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

Geocoder.init('AIzaSyBcGAtTu4TlPOaWcObIqQisYnvEvlAqH1Y', {language : "en"});



export default class Map extends Component{
    // Map Page
    constructor() {
      super();
      this.state={
        latitude: 0,
        longitude: 0,
        latitudeDelta: 200,
        longitudeDelta: 200,
        locationset: false,
        MarkerArray: [],
      }
    }

  async componentDidMount() {
    console.log("Components mounted.");
    try {
      let { status } = await Location.requestPermissionsAsync();
       if (status !== 'granted') {
         console.log("Location Premission Refused!");
         this.setState({ locationset: true })
         Alert.alert("Location Premission Not Granted!", "To have this screen default to your location please enable location services for this app.")
         return;
       }
       let location = await Location.getLastKnownPositionAsync();
       this.setState({ latitude: location.coords.latitude })
       this.setState({ longitude: location.coords.longitude })
       this.setState({ latitudeDelta: 0.2 })
       this.setState({ longitudeDelta: 0.2 })
       this.setState({ locationset: true })
    } catch (error) {
       console.log(error);
       Alert.alert("Error reading location!", "If using an Emulator please ensure a location is selected in the emulator options.")
       this.setState({ locationset: true })
    }

      fetch('http://10.0.2.2:5000/map')
      .then((response) => response.json())
      .then((response) => {
        this.setState({ MarkerArray: response })
      })
      .catch((error) => {
       console.log("Error",error);
     });
  }

  render(){
    if(this.state.locationset == true){
      return(
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
              mapType='standard'
            >
              {this.state.MarkerArray.map( m => {
                return(
                  <MapView.Marker coordinate={{latitude: m.GPS._latitude, longitude: m.GPS._longitude}} key={m.ID}>
                    <View style={{flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                      <Image source={{uri: m.icon}} style={{ width: 80, height: 80 }} />
                      <Text style={{backgroundColor: "#fff"}}> {m.ID} </Text>
                    </View>
                  </MapView.Marker>
                );
              })}
            </MapView>
          </SafeAreaView>
      )
    } else {
      return(null)
    }
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center'
    },
});
