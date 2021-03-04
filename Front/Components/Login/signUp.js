import React from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    Image,
} from "react-native";
import * as firebase from "firebase";

export default class SignUp {
    constructor(props) {
        this.connection = props.connection;
    }

    state = {
        email: "",
        username: "",
        password: "",
        passwordCon: "",
    };

    onChangeEmail = (value) => {
        this.setState({ email: value });
    };

    onChangeUsername = (value) => {
        this.setState({ username: value });
    };

    onChangePassword = (value) => {
        this.setState({ password: value });
    };

    onChangePasswordCon = (value) => {
        this.setState({ passwordCon: value });
    };

    onSignUp = () => {
        if (password !== passwordCon) {
            Alert.alert("Passwords do not match");
            return;
        }
        return;
    };
    render() {
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
                    <View style={styles.loginCon}>
                        <Text style={styles.text}>Email:</Text>

                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.onChangeEmail(text)}
                            value={this.state.email}
                            placeholder='Email'
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='email-address'
                        />
                    </View>

                    <View style={styles.loginCon}>
                        <Text style={styles.text}>Username:</Text>

                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.onChangeName(text)}
                            value={this.state.username}
                            placeholder='UserName'
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.loginCon}>
                        <Text style={styles.text}>Password:</Text>

                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.onChangePassword(text)}
                            value={this.state.password}
                            placeholder='Password'
                            secureTextEntry={true}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.loginCon}>
                        <Text style={styles.text}>Password:</Text>

                        <TextInput
                            style={styles.input}
                            onChangeText={(text) =>
                                this.onChangePasswordCon(text)
                            }
                            value={this.state.passwordCon}
                            placeholder='Re-type Password'
                            secureTextEntry={true}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.button}>
                        <Button
                            onPress={this.onSignUp()}
                            title='Sign Up'
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
        paddingTop: "12%",
        alignItems: "center",
    },
    container1: {
        flex: 1,
        backgroundColor: "#fff",
    },

    loginCon: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "2%",
    },
    text: {
        fontSize: 20,
    },
    button: {
        maxWidth: "90%",
        paddingLeft: "5%",
        paddingTop: "5%",
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
        width: "70%",
        fontSize: 20,
        color: "gray",
    },
});
