import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";

class ServerTest extends Component {
    state = {
        response: "",
        post: "",
        responseToPost: "",
    };

    componentDidMount() {
        console.log("Mounted");
        this.callApi()
            .then((res) => this.setState({ response: res.express }))
            .catch((err) => console.log(err));
    }

    callApi = async () => {
        const response = await fetch("http://10.0.2.2:5000/api/hello");
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <View>
                <Text style={this.styles.text}>
                    Getting data : {this.state.response}
                </Text>
            </View>
        );
    }

    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        text: {
            fontSize: 32,
        },
    });
}

export default ServerTest;
