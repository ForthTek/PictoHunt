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
        <SafeAreaView style={{ paddingTop: "50%" }}>
            <Text style={{ paddingBottom: "20%" }}>Forgot Password</Text>

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
            <Button
                style={styles.button}
                onPress={onResetPassword}
                title='Send Password Reset Email'
            ></Button>
            <Button title='back' onPress={props.back} style={styles.button} />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "1%",
    },
    email: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight: "16.6%",
        paddingTop: "0%",
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
    button: {
        fontSize: 18,
        paddingTop: "5%",
        paddingBottom: "10%",
        color: "red",
    },
});
