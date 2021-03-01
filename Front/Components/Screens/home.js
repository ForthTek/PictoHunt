import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet, Button } from "react-native";
import Image from "react-native-scalable-image";
import Score from "../score";
import SettingBtn from "../settingBtn";
import * as firebase from "firebase";
class Home extends Component {
    // Home page

    // var username = "User Name";
    // var userjoin = "01/01/1900";
    // var userlocation = "place";

    // var userscore = 5;
    // var userpics = 5;
    // var userrank = 5;

    state = {
        isLoading: true,
        DATA: "",
    };

    componentDidMount() {
        this.callApi()
            .then((res) => {
                this.setState({ DATA: res });
                this.setState({ isLoading: false });
            })
            .catch((err) => console.log(err));
    }

    callApi = async () => {
        const response = await fetch("http://10.0.2.2:5000/api/getUser");

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    onSignOutPress = () => {
        firebase.auth().signOut();
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container1}>
                    <Text>Loading</Text>
                    <Button
                        title='Sign out'
                        onPress={this.onSignOutPress}
                        style={{ fontSize: 18, paddingTop: "5%", color: "red" }}
                    ></Button>
                </View>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={{ flexDirection: "row", padding: "5%" }}>
                        <Image
                            source={require("../../assets/pfp-placeholder.png")}
                            width={160}
                        />
                        <View
                            style={{
                                flexDirection: "column",
                                paddingLeft: "3%",
                            }}
                        >
                            <Text style={styles.username}>
                                {this.state.DATA.username}
                            </Text>
                            <Text style={styles.info}>
                                Joined:{" "}
                                {this.state.DATA.joined.substring(0, 10)}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            paddingBottom: "5%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Score label='Score' number={this.state.DATA.score} />
                        <Score
                            label='Pics'
                            number={this.state.DATA.posts.length}
                        />
                        <Score label='Rank' number={5} />
                    </View>
                    <View style={styles.container}>
                        <SettingBtn
                            label='Achievements/ Challenges'
                            icon='trophy-outline'
                        />
                        <SettingBtn
                            label='Your Profile'
                            icon='person-outline'
                        />
                        <SettingBtn label='Following' icon='people-outline' />
                        <SettingBtn
                            label='Leader Board'
                            icon='bar-chart-outline'
                        />
                        <SettingBtn label='Settings' icon='settings-outline' />
                        <SettingBtn label='Log Out' icon='log-out-outline' />
                    </View>
                </SafeAreaView>
            );
        }
    }
}
export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "1%",
    },
    username: {
        fontSize: 22,
        paddingBottom: "10%",
        maxWidth: 200,
    },
    info: {
        fontSize: 18,
        paddingBottom: "5%",
    },
    loadCon: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    container1: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
