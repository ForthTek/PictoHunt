import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import LikeBtn from "./likeBtn";

const Post = (props) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.Image}
                source={{
                    uri: props.item.photos[0],
                }}
            />
            <View style={styles.containerCol}>
                <Text style={styles.title} numberOfLines={1}>
                    {props.item.title}
                </Text>
                <Text style={styles.postName}>{props.item.user}</Text>
                <View style={styles.likeCon}>
                    <LikeBtn icon='heart-outline' title='Like' />
                    <Text style={{ fontSize: 22, paddingRight: "2%" }}>
                        {props.item.likes + props.item.dislikes}
                    </Text>
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
        padding: "1%",
    },
    Image: {
        width: 128,
        height: 128,
    },
    title: {
        fontSize: 18,
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
