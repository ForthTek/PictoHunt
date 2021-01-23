import React from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import Image from "react-native-scalable-image";
import Score from "./score";
import SettingBtn from "./settingBtn";

export default function Home() {
    // Home page

    var username = "User Name";
    var userjoin = "01/01/1900";
    var userlocation = "place";

    var userscore = 5;
    var userpics = 5;
    var userrank = 5;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", padding: "5%" }}>
                <Image
                    source={require("../assets/pfp-placeholder.png")}
                    width={160}
                />
                <View style={{ flexDirection: "column", paddingLeft: "3%" }}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.info}>Joined {userjoin}</Text>
                    <Text style={styles.info}>Located in {userlocation}</Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                <Score label='Score' number={userscore} />
                <Score label='Pics' number={userpics} />
                <Score label='Rank' number={userrank} />
            </View>
            <View style={styles.container}>
                <SettingBtn
                    label='Achievements/ Challenges'
                    icon='trophy-outline'
                />
                <SettingBtn label='Your Profile' icon='person-outline' />
                <SettingBtn label='Following' icon='people-outline' />
                <SettingBtn label='Leader Board' icon='bar-chart-outline' />
                <SettingBtn label='Settings' icon='settings-outline' />
                <SettingBtn label='Log Out' icon='log-out-outline' />
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
