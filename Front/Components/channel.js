import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";

const Channel = (props) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.Image}
                source={require("../assets/icon.png")}
            />
            <View style={styles.containerCol}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.info}>Followers</Text>
                <Text style={styles.info}>Pics</Text>
                <Text style={styles.info}>Score</Text>
            </View>
        </View>
    );
};
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
