import React, { Component } from "react";

import { SafeAreaView, StyleSheet, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"; // Can be used instead of 'createBottomTabNavigator' for a different, possibly nicer looking, tabbar.

import Account from "./Screens/account";
import Upload from "./Screens/UploadScreen";
import Map from "./Screens/map";
import Challenges from "./Screens/challenges";
import Home from "./Screens/home";

const bButton = createMaterialBottomTabNavigator(); // Create the bottom tab bar

export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
        //console.log(this.connection);
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <NavigationContainer>
                    <bButton.Navigator // Sets things about the bottom buttons
                        initialRouteName='Home'
                    >

                        <bButton.Screen
                            name='Home'
                            options={{
                                tabBarColor: "blue",
                                tabBarIcon: ({ color }) => (
                                    <Ionicons
                                        name='home'
                                        color={color}
                                        size={22}
                                    />
                                ),
                            }}
                        >
                            {(props) => (
                                <Home {...props} connection={this.connection} />
                            )}
                        </bButton.Screen>

                        <bButton.Screen
                            name='Challenges'
                            options={{
                                tabBarColor: "tomato",
                                tabBarIcon: ({ color }) => (
                                    <Ionicons
                                        name='checkmark-circle-outline'
                                        color={color}
                                        size={22}
                                    />
                                ),
                            }}
                        >
                            {(props) => (
                                <Challenges
                                    {...props}
                                    connection={this.connection}
                                />
                            )}
                        </bButton.Screen>

                        <bButton.Screen
                            name='Upload'
                            options={{
                                tabBarColor: "brown",
                                tabBarIcon: ({ color }) => (
                                    <Ionicons
                                        name='add-circle'
                                        color={color}
                                        size={22}
                                    />
                                ),
                            }}
                        >
                            {(props) => (
                                <Upload
                                    {...props}
                                    connection={this.connection}
                                />
                            )}
                        </bButton.Screen>

                        <bButton.Screen
                            name='Map'
                            options={{
                                tabBarColor: "orange",
                                tabBarIcon: ({ color }) => (
                                    <Ionicons
                                        name='map'
                                        color={color}
                                        size={22}
                                    />
                                ),
                            }}
                        >
                            {(props) => (
                                <Map {...props} connection={this.connection} />
                            )}
                        </bButton.Screen>

                        <bButton.Screen
                            name='Account'
                            options={{
                                tabBarColor: "purple",
                                tabBarIcon: ({ color }) => (
                                    <Ionicons
                                        name='person-circle'
                                        color={color}
                                        size={22}
                                    />
                                ),
                            }}
                        >
                            {(props) => (
                                <Account
                                    {...props}
                                    connection={this.connection}
                                />
                            )}
                        </bButton.Screen>
                    </bButton.Navigator>
                </NavigationContainer>
            </SafeAreaView>
            // Creates the buttons and sets which page function they call
        ); // options={{tabBarBadge: 0} can be used to set notification nubers
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: StatusBar.currentHeight + 12,
    },
});
