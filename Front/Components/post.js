import { useLinkProps } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";

const Post = (props) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.Image}
                source={require("../assets/icon.png")}
            />
            <View style={styles.containerCol}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.postName}>Account Name</Text>
                <Text numberOfLines={3}>
                    This is a description of the image next to this text :)
                    There should only be three lines and nothign more. if there
                    is more than 3 i fucked it
                </Text>
            </View>
        </View>
    );
};
export default Post;

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
    },
    postName: {
        fontSize: 12,
        color: "grey",
        paddingBottom: "3%",
    },
});
