import React from "react";
import { Text, StyleSheet, SafeAreaView, View, Image , Alert} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyBcGAtTu4TlPOaWcObIqQisYnvEvlAqH1Y', {language : "en"});



export default function Map() {
    // Map Page
    var initialRegion={
      latitude: 5.464497,
      longitude: 9.06908,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    var MarkerArray = [
      {
        ID: 6,
        GPSLatitude: 5.466131,
        GPSLongitude: 9.06908,
        icon: 'https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e4.jpg'
      },
      {
        ID: 5,
        GPSLatitude: 5.464497,
        GPSLongitude: 9.071827,
        icon: 'https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e1.jpg'
      },
      {
        ID: 3,
        GPSLatitude: 51.510357,
        GPSLongitude: -0.116773,
        icon: 'https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben3.jpg'
      },
      {
        ID: 2,
        GPSLatitude: 51.510357,
        GPSLongitude: -0.116773,
        icon: 'https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben4.jpg'
      },
      {
        ID: 1,
        GPSLatitude: 51.510357,
        GPSLongitude: -0.116773,
        icon: 'https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben1.jpg'
      }
    ]
    
    return (
        <SafeAreaView style={styles.container}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            mapType='standard'
          >
            {MarkerArray.map( m => {
              return(
                <MapView.Marker coordinate={{latitude: m.GPSLatitude, longitude: m.GPSLongitude}} key={m.ID}>
                  <View style={{flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={{uri: m.icon}} style={{ width: 80, height: 80 }} />
                    <Text style={{backgroundColor: "#fff"}}> {m.ID} </Text>
                  </View>
                </MapView.Marker>
              );
            })}

          </MapView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center'
    },
});
