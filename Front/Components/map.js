import React from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";

export default function Map() {
    // Map Page
    return (
        <SafeAreaView style={styles.container}>
            <Text>[Map Page]</Text>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
