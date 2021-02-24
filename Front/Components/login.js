import React from "react";
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

export default function Home(props) {
    const [signUp, onSignUp] = React.useState(false);
    const [forgotPassword, onForgotPassword] = React.useState(false);
    const [email, onChangeEmail] = React.useState("");
    const [password, onChangePassword] = React.useState("");

    const onLoginPress = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(
                () => {},
                (error) => {
                    Alert.alert(error.message);
                }
            );
    };

    if (signUp) {
        return (
            <SignUp
                back={() => {
                    onSignUp(false);
                }}
            />
        );
    }
    if (forgotPassword) {
        return (
            <ForgotPass
                back={() => {
                    onForgotPassword(false);
                }}
            />
        );
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        flexDirection: "row",
                        margin: "0%",
                        marginLeft: "30%",
                    }}
                >
                    <Image
                        source={require("../assets/ForthTek.png")}
                        width={160}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        paddingBottom: "5%",
                        justifyContent: "space-between",
                    }}
                ></View>

                <Text style={styles.Pictohunt}>Pictohunt</Text>
                <Text style={styles.byforthtek}>By ForthTek</Text>
                <Text style={styles.logint}>Login</Text>

                <View
                    style={{
                        flexDirection: "row",
                        paddingBottom: "5%",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={styles.email}>Email:</Text>

                    <TextInput
                        style={styles.input2}
                        onChangeText={(text) => onChangeEmail(text)}
                        value={email}
                        placeholder='Email'
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='email-address'
                    />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        paddingBottom: "5%",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={styles.password}>Password:</Text>

                    <TextInput
                        style={styles.input2}
                        onChangeText={(text) => onChangePassword(text)}
                        value={password}
                        placeholder='Password'
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>

                <Button
                    style={styles.button}
                    onPress={onLoginPress}
                    title='Login'
                ></Button>

                <Text style={styles.guest}>Proceed as Guest</Text>

                <View
                    style={{
                        flexDirection: "row",
                        paddingBottom: "5%",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        style={styles.button}
                        onPress={onForgotPassword}
                        title='Forgot Password'
                    />
                    <Button
                        style={styles.button}
                        onPress={onSignUp}
                        title='Create Account'
                    />
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "1%",
    },
    Pictohunt: {
        fontSize: 35,
        paddingBottom: "2%",
        paddingLeft: "30%",
    },
    byforthtek: {
        fontSize: 18,
        paddingBottom: "5%",
        paddingLeft: "36.5%",
    },

    logint: {
        fontSize: 30,
        paddingBottom: "5%",
        paddingLeft: "40%",
        paddingTop: "10%",
    },
    input: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: "0%",
        width: "80%",
        fontSize: 20,
        color: "gray",
    },
    input2: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: "0%",
        width: "70%",
        fontSize: 20,
        color: "gray",
    },
    email: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight: "16.6%",
        paddingTop: "0%",
    },
    password: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingLeft: "0%",
        paddingTop: "0%",
    },
    button: {
        fontSize: 18,
        paddingTop: "5%",
        color: "red",
    },
    guest: {
        fontSize: 15,
        color: "blue",
        paddingBottom: "10%",
        paddingLeft: "35%",
        paddingTop: "15%",
        textDecorationLine: "underline",
    },
    forgot: {
        fontSize: 15,
        color: "blue",
        paddingBottom: "10%",
        paddingLeft: "12%",
        paddingTop: "5%",
        textDecorationLine: "underline",
    },
    create: {
        fontSize: 15,
        color: "blue",
        paddingBottom: "10%",
        paddingRight: "12%",
        paddingTop: "5%",
        textDecorationLine: "underline",
    },
});
