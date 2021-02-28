import React, { useState, Component } from "react";
import { StyleSheet, StatusBar } from "react-native";

import Login from "./Components/Login/login";
import Nav from "./Components/nav";

import Auth from "./Components/Auth";
import * as firebase from "firebase";

//auth = new Auth();

const config = {
    apiKey: "AIzaSyCvQv_waR8vtFZIrmHlgVexp0VrrGNwGBE",
    authDomain: "picto-hunt.firebaseapp.com",
    projectId: "picto-hunt",
    storageBucket: "picto-hunt.appspot.com",
    messagingSenderId: "762056308518",
    appId: "1:762056308518:web:ec820ae748f1191699b3e7",
    measurementId: "G-HDTRBXWKV1",
};
export default class App extends Component {
    // Main app function
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isAuthReady: false,
        };
        // auth = new Auth();
        // console.log(auth);
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    }

    onAuthStateChanged = (user) => {
        if (firebase.auth().currentUser) {
            console.log(firebase.auth().currentUser.email);
        }
        this.setState({ isAuthReady: true });
        this.setState({ isLoggedIn: !!user });
    };

    render() {
        if (this.state.isLoggedIn) {
            return <Nav />;
        } else {
            return (
                <Login
                    login={() => {
                        this.setState({ isLoggedIn: true });
                    }}
                />
            );
        }
    }
}
