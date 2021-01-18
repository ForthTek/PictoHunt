import React from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";

export default function Channels() {
    // Channels Page
    return (
        <SafeAreaView style={styles.container}>
            <Text>[Channels Page]</Text>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
