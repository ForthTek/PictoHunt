import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet, Button } from "react-native";
import Image from "react-native-scalable-image";
import Score from "../score";
import SettingBtn from "../settingBtn";

class Home extends Component {
    constructor(props) {
        super(props);
        console.log(props.route);
        this.connection = props.route.params.connect;
    }

    // Home page

    state = {
        isLoading: true,
        DATA: "",
    };

    componentDidMount() {
        console.log(this.connection);
        // this.connection.getOurProfile().then((profile) => {
        //     this.setState({ DATA: profile });
        //     this.setState({ isLoading: false });
        // });
    }

    onSignOutPress = () => {
        this.connection.logout();
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
