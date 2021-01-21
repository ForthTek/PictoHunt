import React from "react";
import { Text, StyleSheet, SafeAreaView, View, FlatList } from "react-native";
import { shouldUseActivityState } from "react-native-screens";
import Post from "./post";

const DATA = [
    { id: 1, title: "hi" },
    { id: 2, title: "hi" },
    { id: 3, title: "hi" },
    { id: 4, title: "hi" },
    { id: 5, title: "hi" },
    { id: 6, title: "hi" },
    { id: 7, title: "hi" },
    { id: 8, title: "hi" },
    { id: 9, title: "hi" },
    { id: 10, title: "hi" },
    { id: 11, title: "hi" },
    { id: 12, title: "hi" },
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
