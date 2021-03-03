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
                            onChangeText={(text) => onChangeEmail(text)}
                            value={email}
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
                            onChangeText={(text) => onChangePassword(text)}
                            value={password}
                            placeholder='Password'
                            secureTextEntry={true}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>
                    <View style={styles.button}>
                        <Button onPress={onLoginPress} title='Login'></Button>
                    </View>
                </View>

                <View style={styles.container2}>
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