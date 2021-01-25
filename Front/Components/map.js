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
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    return (
        <SafeAreaView style={styles.container}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            mapType='standard'
          >
          <MapView.Marker coordinate={{latitude: 37.78825, longitude: -122.4324}}>
            <View style={{flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require('../assets/icon.png')} style={{ width: 80, height: 80 }} />
                <Text style={{backgroundColor: "#fff"}}> [Image Title] </Text>
            </View>
          </MapView.Marker>
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


//          <Marker
//            coordinate={{ latitude: 37.78825, longitude: -122.4324,}}
//            image={require('../assets/icon.png')}
//            title='Picture Title'
//            description='Posted by User Name'
//          />
