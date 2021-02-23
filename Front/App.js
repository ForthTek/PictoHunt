import React, { useState } from "react"
import { StyleSheet, SafeAreaView, StatusBar, View } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Ionicons from "react-native-vector-icons/Ionicons"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs" // Can be used instead of 'createBottomTabNavigator' for a different, possibly nicer looking, tabbar.

import Home from "./Components/home"
import Browse from "./Components/browse"
import Channels from "./Components/channels"
import Upload from "./Components/UploadScreen"
import Map from "./Components/map"
import Login from "./Components/login"

import Auth from './Auth';


// componentDidMount = () => {
//     const auth = new Auth();
// }

const bButton = createMaterialBottomTabNavigator() // Create the bottom tab bar

export default function App() {
    // Main app function
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    if (isLoggedIn) {
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
                                tabBarColor: "black",
                                tabBarIcon: ({ color }) => (
                                    <Ionicons
                                        name='person-circle'
                                        color={color}
                                        size={22}
                                    />
                                ),
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
                        />
                    </bButton.Navigator>
                </NavigationContainer>
            </SafeAreaView>
            // Creates the buttons and sets which page function they call
        ) // options={{tabBarBadge: 0} can be used to set notification nubers
    } else {
        return (
            <Login
                login={() => {
                    setIsLoggedIn(true)
                    console.log("login")
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: StatusBar.currentHeight + 12,
    },
})
