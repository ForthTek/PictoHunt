import React from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import Image from "react-native-scalable-image";
import Score from "./score";
import SettingBtn from "./settingBtn";
import ScoreComp from "./scoreComp";

export default function Profile() {
    // Profile page

    var otherusername = 'User Name'
    var otheruserjoin = '01/01/1900'
    var otheruserlocation = 'place'
    var otheruserpfp = '../assets/pfp-placeholder.png'

    var userscore = 5;
    var userpics = 5;
    var userrank = 5;
    var otherscore = 8;
    var otherpics = 2;
    var otherrank = 7;

    const scorediff = otherscore - userscore;
    const picsdiff = otherpics - userpics;
    const rankdiff = (otherrank - userrank) * -1;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", padding: "5%" }}>
                <Image
                    source={require('../assets/pfp-placeholder.png')}
                    width={160}
                />
                <View style={{ flexDirection: "column", paddingLeft: "3%" }}>
                    <Text style={styles.username}>{otherusername}</Text>
                    <Text style={styles.info}>Joined {otheruserjoin}</Text>
                    <Text style={styles.info}>Located in {otheruserlocation}</Text>
                </View>
            </View>

        <ScoreComp
          usernumber={userscore} othernumber={otherscore} numberdiff={scorediff}
          label1='Score' label2='points'
        />
        <ScoreComp
          usernumber={userpics} othernumber={otherpics} numberdiff={picsdiff}
          label1='Pics' label2='pictures'
        />
        <ScoreComp
          usernumber={userrank} othernumber={otherrank} numberdiff={rankdiff}
          label1='Rank' label2='ranks'
        />

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
