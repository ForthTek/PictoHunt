import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import LikeBtn from "./likeBtn";

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
                <View style={styles.likeCon}>
                    <LikeBtn icon='heart-outline' title='Like' />
                    <Text style={{ fontSize: 22, paddingRight: "2%" }}>0</Text>
                    <LikeBtn icon='heart-dislike-outline' title='Dis-Like' />
                </View>
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
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
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
        paddingBottom: "10%",
    },
    likeCon: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
    },
});
