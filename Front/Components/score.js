import React from "react";
import { Text, View, StyleSheet } from "react-native";
const Score = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.label}</Text>
            <Text style={styles.text}>{props.number}</Text>
        </View>
    );
};
export default Score;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "2%",
        alignItems: "center",
    },
    text: {
        fontSize: 22,
    },
});
