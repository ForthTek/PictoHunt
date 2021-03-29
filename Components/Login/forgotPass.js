import React, { Component } from "react";
import {
    Text,
    Button,
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    Alert,
} from "react-native";

export default class ForgotPass extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    state = {
        email: "",
    };

    onChangeEmail = (value) => {
        this.setState({ email: value });
    };

    onResetPassword = () => {
        this.connection.resetPassword(this.state.email).then(
            () => {
                Alert.alert("Password reset email has been sent!");
            },
            (error) => {
                Alert.alert(error.message);
            }
        );
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
              <View style={{paddingTop: "12%"}}>
                  <Text style={{ fontSize: 35, textAlign: "center" }}>Pictohunt</Text>
                  <Text style={{ fontSize: 18, textAlign: "center"  }}>By ForthTek</Text>
                <Text style={{ fontSize: 30, textAlign: "center", paddingTop: "6%" }}>Forgot Password</Text>
              </View>
                <View style={styles.container0}>
                    <Text style={{ fontSize: 20 }}>Email:</Text>

                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.onChangeEmail(text)}
                        value={this.state.email}
                        placeholder='Email'
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='email-address'
                    />
                    <View style={styles.button}>
                        <Button
                            onPress={() => {
                                this.onResetPassword();
                            }}
                            title='Send Password Reset Email'
                        ></Button>
                    </View>
                </View>
                <View style={styles.button0}>
                    <Button title='back' onPress={this.props.back} />
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: "10%",
        justifyContent: "space-between",
        alignContent: "space-around",
    },
    container0: {
        flex: 1,
        backgroundColor: "#fff",
        paddingLeft: "10%",
        justifyContent: "center",
        maxWidth: "90%",
    },
    button: {
        paddingTop: "5%",
        paddingBottom: "5%",
    },
    button0: {
        maxWidth: "90%",
        paddingLeft: "10%",
        paddingTop: "5%",
        paddingBottom: "5%",
    },
    input: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        fontSize: 20,
        color: "gray",
    },
});
