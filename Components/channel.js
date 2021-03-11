import React, { Component } from "react";
import { Text, StyleSheet, View, Image } from "react-native";

class Channel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.item.name,
            description: this.props.item.description,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.Image}
                    source={require("../assets/icon.png")}
                />
                <View style={styles.containerCol}>
                    <Text style={styles.title}>{this.state.name}</Text>
                    <Text style={styles.info}>{this.state.description}</Text>
                </View>
            </View>
        );
    }
}
export default Channel;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "row",
    },
    containerCol: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "column",
        paddingLeft: "2%",
    },
    Image: {
        width: 128,
        height: 128,
    },
    title: {
        fontSize: 22,
        paddingBottom: "5%",
    },
    info: {
        fontSize: 15,
        paddingBottom: "3%",
    },
});
