import React from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import Image from "react-native-scalable-image";
export default function Home() {
    // Home page
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={require("../assets/pfp-placeholder.png")}
                    width={160}
                />
                <View>
                    <Text style={{ fontSize: 22, paddingLeft: "3%" }}>
                        [User Name]
                        {"\n"}
                    </Text>
                    <Text style={{ fontSize: 18, paddingLeft: "3%" }}>
                        Joined: [Join Date]
                        {"\n"} {"\n"}
                        Location: [Location]
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
