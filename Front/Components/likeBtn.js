import React, { Component } from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

export default class LikeBtn extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    onLikeBtnPress = () => {
        alert("Pressed: " + this.props.title);
    };

    render() {
        return (
            <View>
                <Pressable
                    style={styles.container}
                    onPress={() => this.onLikeBtnPress()}
                >
                    <Ionicon name={this.props.icon} style={styles.icon} />
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: "1%",
    },
    icon: {
        fontSize: 32,
    },
});
