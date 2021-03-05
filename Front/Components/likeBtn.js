import React, { Component } from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

export default class LikeBtn extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    onLikeBtnPress = () => {
        if (this.props.type === "like") {
            alert("Pressed: " + this.props.type);
            this.connection
                .interactWithPost(
                    this.props.postID,
                    this.connection.PostInteractionType.like
                )
                .catch((error) => {
                    Alert.alert(error.message);
                });
        }
        if (this.props.type === "dislike") {
            alert("Pressed: " + this.props.type);
            this.connection
                .interactWithPost(
                    this.props.postID,
                    this.connection.PostInteractionType.dislike
                )
                .catch((error) => {
                    Alert.alert(error.message);
                });
        }
        if (this.props.type === "remove") {
            alert("Pressed: " + this.props.type);
            this.connection
                .interactWithPost(
                    this.props.postID,
                    this.connection.PostInteractionType.remove
                )
                .catch((error) => {
                    Alert.alert(error.message);
                });
        }
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
