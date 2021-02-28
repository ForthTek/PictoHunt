import React, { useState } from "react";
import {
    Text,
    Button,
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    Alert,
} from "react-native";
import * as firebase from "firebase";

export default function ForgotPass(props) {
    const [email, onChangeEmail] = useState("");

    const onResetPassword = () => {
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(
                () => {
                    Alert.alert("Password reset email has been sent!");
                },
                (error) => {
                    Alert.alert(error.message);
                }
            );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 30 }}>Forgot Password</Text>

            <View style={styles.container0}>
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
                <View style={styles.button}>
                    <Button
                        onPress={onResetPassword}
                        title='Send Password Reset Email'
                    ></Button>
                </View>
            </View>
            <View style={styles.button0}>
                <Button title='back' onPress={props.back} />
            </View>
        </SafeAreaView>
    );
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
