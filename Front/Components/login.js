import React from "react"
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Button,
} from "react-native"
import Image from "react-native-scalable-image"

export default function Home(props) {
    const Pictohunt = "Pictohunt"
    const byforthtek = "By ForthTek"
    const logint = "Login"
    const email = "Email:"
    const password = "Password:"
    const [value, onChangeText] = React.useState("")
    const [value2, onChangeText2] = React.useState("")
    const guest = "Proceed as Guest"
    const forgot = "Forgot Password"
    const create = "Create an Account"

    const apiCall = () => {}

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    margin: "0%",
                    marginLeft: "30%",
                }}
            >
                <Image source={require("../assets/ForthTek.png")} width={160} />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            ></View>

            <Text style={styles.Pictohunt}>{Pictohunt}</Text>
            <Text style={styles.byforthtek}>{byforthtek}</Text>
            <Text style={styles.logint}>{logint}</Text>

            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Text style={styles.email}>{email}</Text>

                <TextInput
                    style={styles.input2}
                    onChangeText={(text) => onChangeText(text)}
                    value={value}
                />
            </View>

            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Text style={styles.password}>{password}</Text>

                <TextInput
                    style={styles.input2}
                    onChangeText={(text) => onChangeText2(text)}
                    value={value2}
                />
            </View>

            <Button
                style={styles.button}
                onPress={props.login}
                title='Login'
            ></Button>

            <Text style={styles.guest}>{guest}</Text>

            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Text style={styles.forgot}>{forgot}</Text>
                <Text style={styles.create}>{create}</Text>
            </View>
        </SafeAreaView>
    )
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
})
