import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import Channel from "../channel";

export default class challenges extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    state = {
        isLoading: false,
        DATA: "",
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
                </View>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <Text>HELLO</Text>
                </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    postCon: {
        flex: 1,
        backgroundColor: "#fff",
    },
    post: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});