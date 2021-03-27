import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Button,
    Alert,
    FlatList,
} from "react-native";
import Image from "react-native-scalable-image";
import Score from "../score";
import SettingBtn from "../settingBtn";
import Post from "../post";
import { Pressable } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
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
        postDATA: [],
    };

    onSignOutPress = () => {
        this.connection.logout();
    };

    componentDidMount() {
        this.connection.getOurProfile().then(
            (res) => {
                this.setState({
                    user: res,
                    isLoading: false,
                    postDATA: res.posts,
                });
                //console.log(res);
            },
            (error) => {
                console.log(error);
                Alert.alert(error.message);
            }
        );
    }

    onDelete = (id) => {
        //this.connection.isAdmin().then((x) => console.log(x));
        this.connection.deletePost(id).then(res => {
            Alert.alert(res)
        }).catch(error => Alert.alert(error.message))
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container1}>
                    <Text>Loading Account Page...</Text>
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
                    <View style={{ flexDirection: "row", paddingLeft: "5%" }}>
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
                                {this.state.user.username}
                            </Text>
                            <Text style={styles.info}>Joined:</Text>
                            <Text style={styles.info}>
                                {this.state.user.timestamp
                                    .toString()
                                    .substring(4, 15)}
                            </Text>

                            <SettingBtn
                                label='Log Out'
                                icon='log-out-outline'
                                onPress={() => {
                                    this.onSignOutPress();
                                }}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            paddingBottom: "2%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Score label='Score' number={this.state.user.score} />
                        <Score
                            label='Pics'
                            number={this.state.user.posts.length}
                        />
                        <Score
                            label='Challenge'
                            number={this.state.user.challengeScore}
                        />
                    </View>

                    <FlatList
                        style={styles.list}
                        data={this.state.postDATA}
                        renderItem={({ item }) => (
                            <View style={styles.post}>
                                <Post
                                    item={item}
                                    onpressable={() => {
                                        console.log("nothing happens");
                                    }}
                                    connection={this.connection}
                                    onLikeBtnPress={this.onLikeBtnPress}
                                />
                                <Pressable onPress={() => this.onDelete(item.ID)}>
                                    <FeatherIcon
                                        name='trash-2'
                                        style={{
                                            fontSize: 26,
                                            paddingRight: "1%",
                                        }}
                                    />
                                </Pressable>
                            </View>
                        )}
                        keyExtractor={(item) => item.ID.toString()}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refresh}
                    />
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
    list: {
        height: "45%",
        paddingTop: "5%",
    },
    post: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
});
