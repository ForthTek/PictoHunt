import React, { useState, Component } from "react";
import { StyleSheet, StatusBar } from "react-native";

import Login from "./Components/Login/login";
import Nav from "./Components/nav";

import Connection from "./Components/API/Connection.js";

export default class App extends Component {
    // Main app function
    constructor(props) {
        super(props);
        this.connection = new Connection();
        this.state = {
            isLoggedIn: this.connection.isLoggedIn(),
        };
        this.connection.addStateUpdateListener(this.updateLogin);
        // this.connection.onSignedOut.addEventListener();
        // this.connection.onSignedIn.addEventListener();
        // Need to do something like this to force the correct page
        // When log out should force sign in page
        // User can then either sign in or continue as guest - if guest need to generate anonymous auth token TODO
    }

    onSignOut = () => {};

    updateLogin = () => {
        console.log("hi");
        this.setState({ isLoggedIn: this.connection.isLoggedIn() });
    };

    render() {
        if (this.state.isLoggedIn) {
            return <Nav connection={this.connection} />;
        } else {
            return <Login />;
        }
    }
}
