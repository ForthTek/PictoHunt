import React from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";

export default function Browse() {
    // Browse Page
    return (
        <SafeAreaView style={styles.container}>
            <Text>[Browse Page]</Text>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
