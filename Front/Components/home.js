import React from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import Image from "react-native-scalable-image";
import Score from "./score";
import SettingBtn from "./settingBtn";

export default function Home() {
    // Home page
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", padding: "5%" }}>
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
                <Score label='Score' number={5} />
                <Score label='Pics' number={5} />
                <Score label='Rank' number={5} />
            </View>
            <View style={styles.container}>
                <SettingBtn
                    label='Achievements/ Challenges'
                    icon='trophy-outline'
                />
                <SettingBtn label='Your Profile' icon='trophy-outline' />
                <SettingBtn label='Following' icon='trophy-outline' />
                <SettingBtn label='Leader Board' icon='trophy-outline' />
                <SettingBtn label='Settings' icon='trophy-outline' />
                <SettingBtn label='Log Out' icon='trophy-outline' />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "1%",
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
