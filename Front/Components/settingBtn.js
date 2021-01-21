import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

const SettingBtn = (props) => {
    return (
        <View style={styles.container}>
            <Ionicon name={props.icon} style={styles.icon} />
            <Text style={styles.text}>{props.label}</Text>
        </View>
    );
};
export default SettingBtn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: "1%",
    },
    text: {
        fontSize: 20,
    },
    icon: { fontSize: 28, paddingRight: "2%" },
});
