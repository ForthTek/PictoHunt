import React, { Component } from "react";
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Alert,
    KeyboardAvoidingView,
} from "react-native";
import Post from "../post";
import SinglePost from "../singlePost";
import FilterBtn from "../filterBtn";
import Filter from "../API/Filter";
import { SearchBar } from "react-native-elements";
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    // Homepage
    state = {
        isLoading: true,
        isPost: false,
        singlePostID: "",
        DATA: "",
        refresh: false,
        filter: new Filter(),
        searching: false,
        channelDATA: "",
        userDATA: "",
    };

    componentDidMount() {
        // update filter using:
        // filter.orderBy = Filter.ORDER_BY_SCORE or filter.orderBy = Filter.ORDER_BY_TIME
        // Probs want to keep direction desc
        // filter.followedUsers = true and filter.followedChannels = true
        this.state.filter.orderBy = Filter.ORDER_BY_TIME;
        this.state.filter.followedChannels = false;
        this.state.filter.followedUsers = false;

        this.connection.getBrowse(this.state.filter).then(
            (posts) => {
                this.setState({ DATA: posts });
                this.setState({ isLoading: false });
            },
            (error) => {
                Alert.alert(error.message);
            }
        );
    }

    getID = (id) => {
        let i = 0;
        for (; i < this.state.DATA.length; i++) {
            if (id == this.state.DATA[i].ID) {
                this.setState({ singlePostID: i });
            }
        }
        this.handleSinglePost();
    };

    handleSinglePost = () => {
        this.setState({ isPost: !this.state.isPost });
    };

    onRefresh = async () => {
        this.setState({ refresh: true, DATA: "" });
        await this.connection.getBrowse(this.state.filter).then(
            (res) => {
                this.setState({ DATA: res });
                this.setState({ refresh: false });
            },
            (error) => {
                Alert.alert(error.message);
                this.setState({ refresh: false });
            }
        );
    };

    onLikeBtnPress = (type, id, updateScore) => {
        if (type === "like") {
            alert("Pressed: " + type);
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
            alert("Pressed: " + type);
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
            alert("Pressed: " + type);
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

    updateFilter = (
        byTime,
        byScore,
        usersFollowed,
        channelsFollowed,
        anyChanged
    ) => {
        //console.log(byTime, byScore, usersFollowed, channelsFollowed);
        this.state.filter.followedChannels = channelsFollowed;
        this.state.filter.followedUsers = usersFollowed;
        if (byTime) {
            this.state.filter.orderBy = Filter.ORDER_BY_TIME;
        }
        if (byScore) {
            this.state.filter.orderBy = Filter.ORDER_BY_SCORE;
        }
        if (anyChanged) {
            this.onRefresh();
        }
    };

    onChangeSearch = (search) => {
        this.setState({
            search: search,
            searching: true,
        });
        if (this.state.search != "") {
        }
        this.connection.searchUsers(search).then(
            (userData) => {
                this.setState({ userDATA: userData });
            },
            (error) => {
                Alert.alert(error.message);
            }
        );
        this.connection.searchChannels(search).then(
            (channelData) => {
                this.setState({ channelDATA: channelData });
            },
            (error) => {
                Alert.alert(error.message);
            }
        );
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
                </View>
            );
        }
        if (this.state.isPost) {
            return (
                <View style={styles.container}>
                    <SinglePost
                        item={this.state.DATA[this.state.singlePostID]}
                        back={this.handleSinglePost}
                        connection={this.connection}
                        onLikeBtnPress={this.onLikeBtnPress}
                    />
                </View>
            );
        } else {
            return (
                <KeyboardAvoidingView
                    style={styles.postCon}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.container1}>
                        <SearchBar
                            containerStyle={styles.searchCon}
                            inputContainerStyle={styles.inputContainerStyle}
                            value={this.state.search}
                            onChangeText={this.onChangeSearch}
                            placeholder='Search...'
                            round
                        />
                        <FilterBtn updateFilter={this.updateFilter} />
                    </View>
                    {this.state.searching && this.state.search != "" && (
                        <View style={styles.dropDown}>
                            <Text style={styles.ddText}>------Users------</Text>
                            <FlatList
                                data={this.state.userDATA}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text style={styles.ddText}>
                                            {item}
                                        </Text>
                                    </View>
                                )}
                                keyExtractor={(item) => item}
                            />
                            <Text style={styles.ddText}>
                                ------Channels------
                            </Text>
                            <FlatList
                                data={this.state.channelDATA}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text style={styles.ddText}>
                                            {item}
                                        </Text>
                                    </View>
                                )}
                                keyExtractor={(item) => item}
                            />
                        </View>
                    )}
                    <FlatList
                        data={this.state.DATA}
                        extraData={this.state.didRefresh}
                        renderItem={({ item }) => (
                            <View style={styles.post}>
                                <Post
                                    item={item}
                                    onpressable={this.getID}
                                    connection={this.connection}
                                    onLikeBtnPress={this.onLikeBtnPress}
                                />
                            </View>
                        )}
                        keyExtractor={(item) => item.ID.toString()}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refresh}
                    />
                </KeyboardAvoidingView>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    container1: {
        flexDirection: "row",
        backgroundColor: "#383d42",
        borderColor: "black",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    postCon: {
        flex: 1,
        backgroundColor: "#fff",
    },
    post: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    searchCon: {
        width: "85%",
        borderColor: "black",
        borderTopWidth: 0.2,
        borderBottomWidth: 0.1,
    },
    inputContainerStyle: {
        height: "5%",
        paddingBottom: "1%",
    },
    dropDown: {
        backgroundColor: "#383d42",
        paddingBottom: "2%",
    },
    ddText: {
        fontSize: 20,
        paddingLeft: "2%",
        color: "white",
    },
});
