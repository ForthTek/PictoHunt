import React from "react";
import { FlatList, StyleSheet, SafeAreaView, View } from "react-native";
import Channel from "./channel";

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
        <View style={styles.channel}>
            <Channel title={title} />
        </View>
    );
};
export default function Channels() {
    // Channels Page
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
    channel: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
});
