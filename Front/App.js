import React from "react";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "./Components/home";
import Browse from "./Components/browse";
import Channels from "./Components/channels";
import Upload from "./Components/upload";
import Map from "./Components/map";

const bButton = createBottomTabNavigator(); // Create the bottom tab bar

export default function App() {
    // Main app function
    return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer>
                <bButton.Navigator // Sets things about the bottom buttons
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === "Home") {
                                // Such as the icons
                                iconName = focused ? "home" : "home-outline";
                            } else if (route.name === "Browse") {
                                iconName = focused ? "list" : "list-outline";
                            } else if (route.name === "Channels") {
                                iconName = focused
                                    ? "albums"
                                    : "albums-outline";
                            } else if (route.name === "Upload") {
                                iconName = focused
                                    ? "add-circle"
                                    : "add-circle-outline";
                            } else if (route.name === "Map") {
                                iconName = focused ? "map" : "map-outline";
                            }

                            return (
                                <Ionicons
                                    name={iconName}
                                    size={size}
                                    color={color}
                                />
                            );
                        },
                    })}
                    tabBarOptions={{
                        activeTintColor: "blue", // Colour of the bar
                        inactiveTintColor: "gray",
                    }}
                >
                    <bButton.Screen name='Home' component={Home} />
                    <bButton.Screen name='Browse' component={Browse} />
                    <bButton.Screen name='Channels' component={Channels} />
                    <bButton.Screen name='Upload' component={Upload} />
                    <bButton.Screen name='Map' component={Map} />
                </bButton.Navigator>
            </NavigationContainer>
        </SafeAreaView> // 87 - 92 Creates the buttons and sets which page function they call
    ); // options={{tabBarBadge: 0} can be used to set notification nubers
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: StatusBar.currentHeight,
    },
});
