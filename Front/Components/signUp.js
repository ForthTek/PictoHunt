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
import * as firebase from "firebase";

export default function Home(props) {
    var [email, onChangeEmail] = React.useState("");
    var [username, onChangeName] = React.useState("");
    var [password, onChangePassword] = React.useState("");
    var [passwordCon, onChangePasswordCon] = React.useState("");

    const onSignUp = () => {
        if (password !== passwordCon) {
            Alert.alert("Passwords do not match");
            return;
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(
                () => {},
                (error) => {
                    Alert.alert(error.message);
                }
            );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    margin: "0%",
                    marginLeft: "30%",
                }}
            ></View>
            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            ></View>

            <Text style={styles.Pictohunt}>Pictohunt</Text>
            <Text style={styles.byforthtek}>By ForthTek</Text>
            <Text style={styles.signUp}>Sign Up</Text>

            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Text style={styles.email}>Email:</Text>

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

            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Text style={styles.username}>Username:</Text>

                <TextInput
                    style={styles.input2}
                    onChangeText={(text) => onChangeName(text)}
                    value={username}
                    placeholder='UserName'
                    autoCapitalize='none'
                    autoCorrect={false}
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
                    style={styles.input3}
                    onChangeText={(text) => onChangePassword(text)}
                    value={password}
                    placeholder='Password'
                    secureTextEntry={true}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>

            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Text style={styles.cPassword}>Confirm Password:</Text>

                <TextInput
                    style={styles.input4}
                    onChangeText={(text) => onChangePasswordCon(text)}
                    value={passwordCon}
                    placeholder='Password Confirm'
                    secureTextEntry={true}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>

            <Text style={styles.tc}>
                I have read and agreed to the terms of service
            </Text>
            <Text style={styles.r}>I have read and agreed to the rules</Text>

            <Button
                style={styles.button}
                onPress={onSignUp}
                title='Sign Up'
            ></Button>

            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Button title='back' onPress={props.back} />
            </View>
        </SafeAreaView>
    );
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

    signUp: {
        fontSize: 30,
        paddingBottom: "5%",
        paddingLeft: "1%",
        paddingTop: "10%",
    },
    input: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: "5%",
        width: "55%",
        fontSize: 20,
        color: "gray",
    },
    input2: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: "5%",
        width: "55%",
        fontSize: 20,
        color: "gray",
    },
    input3: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: "5%",
        width: "55%",
        fontSize: 20,
        color: "gray",
    },
    input4: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: "0%",
        width: "55%",
        fontSize: 20,
        color: "gray",
    },
    email: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight: "30%",
        paddingTop: "0%",
    },
    username: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight: "19.5%",
        paddingTop: "0%",
    },
    password: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight: "19.5%",
        paddingTop: "0%",
    },
    cPassword: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight: "1%",
        paddingTop: "0%",
    },
    button: {
        fontSize: 18,
        paddingTop: "5%",
        color: "red",
    },
    tc: {
        fontSize: 15,
        color: "black",
        paddingBottom: "1%",
        paddingLeft: "10%",
        paddingTop: "1%",
        textDecorationLine: "underline",
    },
    r: {
        fontSize: 15,
        color: "black",
        paddingBottom: "11%",
        paddingLeft: "20%",
        paddingTop: "1%",
        textDecorationLine: "underline",
    },
});
