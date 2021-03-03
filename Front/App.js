import React, { useState, Component } from "react";
import { StyleSheet, StatusBar } from "react-native";

import Login from "./Components/Login/login";
import Nav from "./Components/nav";

import Connection from "./Components/API/Connection.js";

export default class App extends Component {
  // Main app function
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isAuthReady: false,
    };

    this.connection = new Connection();
    this.connection.onSignedOut.addEventListener();
    this.connection.onSignedIn.addEventListener();
  }

  signIn = () => {
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
