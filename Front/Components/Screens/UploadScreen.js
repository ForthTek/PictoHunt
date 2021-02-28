import React from "react";
import { View, StyleSheet, SafeAreaView, TextInput } from "react-native";
import Upload from "../upload";
export default function UploadScreen() {
    const [value, onChangeText] = React.useState("Useless Placeholder");

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Upload />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => onChangeText(text)}
                    value={value}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: "5%",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingBottom: "5%",
    },
});
