import React from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import Image from "react-native-scalable-image";
export default function Home() {
    // Home page
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", paddingBottom: "5%" }}>
                <Image
                    source={require("../assets/pfp-placeholder.png")}
                    width={160}
                />
                <View style={{ flexDirection: "column", paddingLeft: "3%" }}>
                    <Text style={styles.username}>[User Name]</Text>
                    <Text style={styles.info}>Joined: [Join Date]</Text>
                    <Text style={styles.info}>Location: [Location]</Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Text style={styles.info}>Score</Text>
                <Text style={styles.info}>Pics</Text>
                <Text style={styles.info}>Rank</Text>
            </View>
            <View style={styles.container}>
                <Text
                    style={styles.info}
                    onPress={() => {
                        alert("Touch");
                    }}
                >
                    Achievements/ Challenges
                </Text>
                <Text style={styles.info}>Your Profile</Text>
                <Text style={styles.info}>Following</Text>
                <Text style={styles.info}>Leader Board</Text>
                <Text style={styles.info}>Settings</Text>
                <Text style={styles.info}>Log Out</Text>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingLeft: "2%",
    },
    username: {
        fontSize: 22,
        paddingBottom: "10%",
    },
    info: {
        fontSize: 18,
        paddingBottom: "5%",
    },
});
