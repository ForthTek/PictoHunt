import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Button,
    Alert,
} from "react-native";
import Image from "react-native-scalable-image";
import SignUp from "./signUp";
import ForgotPass from "./forgotPass";
import * as firebase from "firebase";
// import firestore from "@react-native-firebase/firestore";

export default class Login extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        signUp: false,
        forgotPassword: false,
        email: "",
        password: "",
    };

    onSignUp = (value) => {
        this.setState({ signUp: value });
    };
    forgotPassword = (value) => {
        this.setState({ forgotPassword: value });
    };
    onChangeEmail = (value) => {
        this.setState({ email: value });
    };
    onChangePassword = (value) => {
        this.setState({ password: value });
    };

    onLoginPress = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(
                () => {},
                (error) => {
                    Alert.alert(error.message);
                }
            );
    };

    render() {
        if (this.statesignUp) {
            return (
                <SignUp
                    back={() => {
                        this.onSignUp(false);
                    }}
                />
            );
        }
        if (this.state.forgotPassword) {
            return (
                <ForgotPass
                    back={() => {
                        this.onForgotPassword(false);
                    }}
                />
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.container0}>
                        <Image
                            source={require("../../assets/ForthTek.png")}
                            width={160}
                            style={{ width: 160, height: 160 }}
                        />
                        <Text style={{ fontSize: 35 }}>Pictohunt</Text>
                        <Text style={{ fontSize: 18 }}>By ForthTek</Text>
                    </View>

                    <View style={styles.container1}>
                        <Text
                            style={{
                                fontSize: 30,
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                        >
                            Login:
                        </Text>
                        <View style={styles.loginCon}>
                            <Text style={{ fontSize: 20 }}>Email:</Text>

                            <TextInput
                                style={styles.input}
                                onChangeText={(text) =>
                                    this.onChangeEmail(text)
                                }
                                value={this.state.email}
                                placeholder='Email'
                                autoCapitalize='none'
                                autoCorrect={false}
                                keyboardType='email-address'
                            />
                        </View>

                        <View style={styles.loginCon}>
                            <Text style={{ fontSize: 20 }}>Password:</Text>

                            <TextInput
                                style={styles.input}
                                onChangeText={(text) =>
                                    this.onChangePassword(text)
                                }
                                value={this.state.password}
                                placeholder='Password'
                                secureTextEntry={true}
                                autoCapitalize='none'
                                autoCorrect={false}
                            />
                        </View>
                        <View style={styles.button}>
                            <Button
                                onPress={() => {
                                    this.onLoginPress();
                                }}
                                title='Login'
                            ></Button>
                        </View>
                    </View>

                    <View style={styles.container2}>
                        <Button
                            style={styles.button}
                            onPress={() => {
                                this.forgotPassword(false);
                            }}
                            title='Forgot Password'
                        />
                        <Button
                            style={styles.button}
                            onPress={() => {
                                this.onSignUp(true);
                            }}
                            title='Create Account'
                        />
                    </View>
                </SafeAreaView>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
    },
    container0: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: "12%",
        alignItems: "center",
    },
    container1: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container2: {
        flexDirection: "row",
        padding: "5%",
        justifyContent: "space-between",
    },
    loginCon: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "2%",
    },
    button: {
        maxWidth: "90%",
        paddingLeft: "10%",
        paddingTop: "5%",
    },
    input: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        width: "70%",
        fontSize: 20,
        color: "gray",
    },
});
