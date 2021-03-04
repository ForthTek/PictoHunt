import React, { Component } from "react";

import { SafeAreaView, StyleSheet, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"; // Can be used instead of 'createBottomTabNavigator' for a different, possibly nicer looking, tabbar.

import Home from "./Screens/home";
import Browse from "./Screens/browse";
import Channels from "./Screens/channels";
import Upload from "./Screens/UploadScreen";
import Map from "./Screens/map";

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
                        initialRouteName='Browse'
                    >
                        <bButton.Screen
                            name='Home'
                            component={Home}
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
                            initialParams={{
                                connect: this.connection,
                            }}
                        />
                        <bButton.Screen
                            name='Channels'
                            component={Channels}
                            options={{
                                tabBarColor: "tomato",
                                tabBarIcon: ({ color }) => (
                                    <Ionicons
                                        name='albums'
                                        color={color}
                                        size={22}
                                    />
                                ),
                            }}
                            initialParams={this.connection}
                        />
                        <bButton.Screen
                            name='Browse'
                            component={Browse}
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
                            initialParams={this.connection}
                        />
                        <bButton.Screen
                            name='Upload'
                            component={Upload}
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
                            initialParams={this.connection}
                        />
                        <bButton.Screen
                            name='Map'
                            component={Map}
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
                            initialParams={this.connection}
                        />
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
