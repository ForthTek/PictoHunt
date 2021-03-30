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
import Stats from "../stats";
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
        refresh: false,
        isAdmin: false,
        stats: false,
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
                console.log(res);
            },
            (error) => {
                console.log(error);
                Alert.alert(error.message);
            }
        );
        this.connection.isAdmin().then(
            (res) => {
                this.setState({ isAdmin: res });
                console.log(res);
            },
            (error) => Alert.alert(error.message)
        );
    }

    onRefresh = () => {
        this.setState({ refresh: true, postDATA: [] });
        this.connection.getOurProfile().then(
            (res) => {
                this.setState({
                    DATA: res,
                    postDATA: res.posts,
                    refresh: false,
                });
                //console.log(res);
            },
            (error) => {
                console.log(error.message);
                Alert.alert(error.message);
                this.setState({ refresh: false });
            }
        );
    };

    onDelete = (id) => {
        //this.connection.isAdmin().then((x) => console.log(x));
        this.connection
            .deletePost(id)
            .then((res) => {
                Alert.alert(res);
            })
            .catch((error) => {
                Alert.alert(error.message);
            });
    };

    onLikeBtnPress = (type, id, updateScore) => {
        if (type === "like") {
            this.connection.likePost(id).then(
                () => {
                    updateScore(id);
                },
                (error) => {
                    Alert.alert(error.message);
                }
            );
        }
        if (type === "dislike") {
            this.connection
                .dislikePost(id)
                .then(
                    () => {
                        updateScore(id);
                    },
                    (error) => {
                        Alert.alert(error.message);
                    }
                )
                .catch((error) => {
                    Alert.alert(error.message);
                });
        }
        if (type === "remove") {
            this.connection.removeInteractionFromPost(id).then(
                () => {
                    updateScore(id);
                },
                (error) => {
                    Alert.alert(error.message);
                }
            );
        }
    };

    openStats = () => {
        console.log("stats");
        this.setState({ stats: true });
    };
    closeStats = () => {
        this.setState({ stats: false });
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
                    <Text style={styles.username}>
                        {this.state.user.username}
                    </Text>
                    <Text style={styles.info}>
                        Joined:{" "}
                        {this.state.user.timestamp.toString().substring(4, 15)}
                    </Text>
                    <View
                        style={{
                            paddingLeft: "5%",
                            flexDirection: "row",
                            flex: 0.4,
                        }}
                    >
                        {this.state.isAdmin && (
                            <SettingBtn
                                label='App Stats'
                                icon='stats-chart-outline'
                                onPress={() => {
                                    this.openStats();
                                }}
                            />
                        )}
                        <SettingBtn
                            label='Log Out'
                            icon='log-out-outline'
                            onPress={() => {
                                this.onSignOutPress();
                            }}
                        />
                        {this.state.stats && (
                            <Stats
                                back={this.closeStats}
                                connection={this.connection}
                            />
                        )}
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
                            label='Posts'
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
                                <Pressable
                                    onPress={() => this.onDelete(item.ID)}
                                >
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
        fontSize: 34,
        maxWidth: 400,
        paddingLeft: "5%",
        paddingBottom: "2%",
    },
    info: {
        fontSize: 18,
        paddingLeft: "5%",
        paddingBottom: "4%",
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
