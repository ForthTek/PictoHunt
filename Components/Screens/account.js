import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Button,
    Alert,
} from "react-native";
import Image from "react-native-scalable-image";
import Score from "../score";
import SettingBtn from "../settingBtn";

class Account extends Component {
    constructor(props) {
        super(props);
        // console.log(props.route);
        this.connection = props.connection;
    }

    // Account Page

    state = {
        isLoading: true,
        DATA: "",
        user: null,
    };

    onSignOutPress = () => {
        this.connection.logout();
    };

    componentDidMount() {
        this.connection.getOurProfile().then(
            (res) => {
                this.setState({ user: res, isLoading: false });
                console.log(res);
            },
            (error) => {
                console.log(error);
                Alert.alert(error.message);
            }
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container1}>
                    <Text>Loading...</Text>
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
                          source={require('../../assets/pfp-placeholder.png')}
                          width={160}
                      />
                      <View style={{ flexDirection: "column", paddingLeft: "3%" }}>
                          <Text style={styles.username}>{this.state.user.username}</Text>
                          <Text style={styles.info}>Joined:</Text>
                          <Text style={styles.info}>{this.state.user.timestamp.toString().substring(4, 15)}</Text>
                          <Text style={styles.info}>Located:</Text>
                          <Text style={styles.info}>[TODO]</Text>
                      </View>
                  </View>
                    <View
                        style={{
                            flexDirection: "row",
                            paddingBottom: "5%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Score label='Score' number={this.state.user.score} />
                        <Score
                            label='Pics'
                            number={this.state.user.posts.length}
                        />
                      <Score label='Rank' number={"[TODO]"}/>
                    </View>
                    <View style={styles.container}>
                        <SettingBtn
                            label='Achievements/ Challenges'
                            icon='trophy-outline'
                            onPress={() => {
                                this.onSignOutPress();
                            }}
                        />
                        <SettingBtn
                            label='Your Profile'
                            icon='person-outline'
                            onPress={() => {
                                this.onSignOutPress();
                            }}
                        />
                        <SettingBtn
                            label='Following'
                            icon='people-outline'
                            onPress={() => {
                                this.onSignOutPress();
                            }}
                        />
                        <SettingBtn
                            label='Leader Board'
                            icon='bar-chart-outline'
                            onPress={() => {
                                this.onSignOutPress();
                            }}
                        />
                        <SettingBtn
                            label='Settings'
                            icon='settings-outline'
                            onPress={() => {
                                this.onSignOutPress();
                            }}
                        />
                        <SettingBtn
                            label='Log Out'
                            icon='log-out-outline'
                            onPress={() => {
                                this.onSignOutPress();
                            }}
                        />
                    </View>
                </SafeAreaView>
            );
        }
    }
}
export default Account;

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
