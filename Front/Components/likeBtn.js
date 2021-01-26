import React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

const LikeBtn = (props) => {
    return (
        <View>
            <Pressable
                style={styles.container}
                onPress={() => alert("Pressed: " + props.title)}
            >
                <Ionicon name={props.icon} style={styles.icon} />
            </Pressable>
        </View>
    );
};
export default LikeBtn;

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
