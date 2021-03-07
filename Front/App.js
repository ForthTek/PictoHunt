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

    // Add event listener to when the login state changes
    this.connection.addLoginStateListener(this.updateLoginState);
  }

  updateLoginState = () => {
    this.setState({ isLoggedIn: this.connection.isLoggedIn() });
    console.log(`*Updated login status to be ${this.state.isLoggedIn}`);
  };

  render() {
    if (this.state.isLoggedIn) {
      return <Nav connection={this.connection} />;
    } else {
      return <Login connection={this.connection} />;
    }
  }
}
