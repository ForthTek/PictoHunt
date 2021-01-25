import React from "react";
import { Text, StyleSheet, SafeAreaView, View, FlatList } from "react-native";
import { shouldUseActivityState } from "react-native-screens";
import Post from "./post";

const DATA = [
    { id: "1", title: "Title" },
    { id: "2", title: "Title" },
    { id: "3", title: "Title" },
    { id: "4", title: "Title" },
    { id: "5", title: "Title" },
    { id: "6", title: "Title" },
    { id: "7", title: "Title" },
    { id: "8", title: "Title" },
    { id: "9", title: "Title" },
    { id: "10", title: "Title" },
    { id: "11", title: "Title" },
    { id: "12", title: "Title" },
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
