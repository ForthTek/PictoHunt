import React from "react";
import { Text, StyleSheet, SafeAreaView, View, FlatList } from "react-native";
import { shouldUseActivityState } from "react-native-screens";
import Post from "./post";

const DATA = [
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
    { title: "hi" },
];

const Item = ({ title }) => {
    return (
        <View style={styles.post}>
            <Post title={title} />
        </View>
    );
};

export default function Browse() {
    // Browse Page
    const renderItem = ({ item }) => <Item title={item.title} />;
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    post: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
});
