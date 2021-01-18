import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Button, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import Image from 'react-native-scalable-image';

function Home() { // Home page
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection:'row'}}>
        <Image
          source={require('./assets/pfp-placeholder.png')}
          width={160}
        />
        <View>
          <Text style={{fontSize: 22, paddingLeft: '3%'}}>
            [User Name]
            {'\n'}
          </Text>
          <Text style={{fontSize: 18, paddingLeft: '3%'}}>
            Joined: [Join Date]
            {'\n'} {'\n'}
            Location: [Location]
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Browse() { // Browse Page
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        [Browse Page]
      </Text>
    </SafeAreaView>
  );
}

function Channels() {  // Channels Page
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        [Channels Page]
      </Text>
    </SafeAreaView>
  );
}

function Upload() {  // Upload Page
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        [Upload Page]
      </Text>
    </SafeAreaView>
  );
}

function Map() {  // Map Page
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        [Map Page]
      </Text>
    </SafeAreaView>
  );
}

const bButton = createBottomTabNavigator(); // Create the bottom tab bar

export default function App() { // Main app function
  return (
    <NavigationContainer>
      <bButton.Navigator // Sets things about the bottom buttons
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') { // Such as the icons
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Browse') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Channels') {
              iconName = focused ? 'albums' : 'albums-outline';
            } else if (route.name === 'Upload') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue', // Colour of the bar
          inactiveTintColor: 'gray',
        }}
      >
        <bButton.Screen name='Home' component={Home}/>
        <bButton.Screen name='Browse' component={Browse} />
        <bButton.Screen name='Channels' component={Channels} />
        <bButton.Screen name='Upload' component={Upload} />
        <bButton.Screen name='Map' component={Map} />
      </bButton.Navigator>
    </NavigationContainer> // 87 - 92 Creates the buttons and sets which page function they call
  ); // options={{tabBarBadge: 0} can be used to set notification nubers
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
});
