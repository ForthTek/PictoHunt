import React, {useState, Component} from "react";
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
        initialRegion: {
          latitude: 0,
          longitude:0,
          latitudeDelta: 4,
          longitudeDelta: 4,
        },
        MarkerArray: [],
      }
    }

  componentDidMount() {
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
    return(
        <SafeAreaView style={styles.container}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={this.state.initialRegion}
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
