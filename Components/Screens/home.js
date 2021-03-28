import React, { Component } from "react";
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Alert,
    KeyboardAvoidingView,
    Modal,
} from "react-native";
import Post from "../post";
import SinglePost from "../singlePost";
import FilterBtn from "../filterBtn";
import Filter from "../API/Filter";
import { SearchBar } from "react-native-elements";
import SearchItem from "../searchItem";
import { Pressable } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import NewChannel from "../newChannel";
import FeatherIcon from "react-native-vector-icons/Feather";
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
        search: "",
        channelDATA: "",
        userDATA: "",

        newChannel: false,
        isAdmin: false,
        isHidden: false,
    };

    componentDidMount() {
        this.state.filter.orderBy = Filter.ORDER_BY_TIME;
        this.state.filter.followedChannels = false;
        this.state.filter.followedUsers = false;
        this.connection.isAdmin().then(
            (res) => {
                this.setState({ isAdmin: res });
                console.log(res);
            },
            (error) => Alert.alert(error.message)
        );
        this.connection.getBrowse(this.state.filter).then(
            (posts) => {
                this.setState({ DATA: posts });
                this.setState({ isLoading: false });

                this.connection.loadChannelsSearch();
                this.connection.loadUsersSearch();
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
        this.setState({ isPost: true });
    };
    handleSinglePostClose = () => {
        this.setState({ isPost: false });
        this.onRefresh();
    };

    onRefresh = () => {
        this.setState({ refresh: true, DATA: "" });
        if (!this.state.isHidden) {
            this.connection.getBrowse(this.state.filter).then(
                (res) => {
                    this.setState({ DATA: res });
                    this.setState({ refresh: false });

                    this.connection.loadChannelsSearch();
                    this.connection.loadUsersSearch();
                },
                (error) => {
                    Alert.alert(error.message);
                    this.setState({ refresh: false });
                }
            );
        } else {
            this.getHiddenPosts();
        }
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

    updateFilter = (
        byTime,
        byScore,
        usersFollowed,
        channelsFollowed,
        anyChanged,
        hiddenPosts
    ) => {
        //console.log(byTime, byScore, usersFollowed, channelsFollowed);
        this.state.isHidden = hiddenPosts;
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

    getHiddenPosts = () => {
        this.connection.getAllReportedPosts().then(
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

    onChangeSearch = (search) => {
        this.setState({
            search: search,
            searching: true,
        });
        if (search == "") {
            this.setState({ searching: false });
        }

        this.setState({
            userDATA: this.connection.searchUsers(search),
            channelDATA: this.connection.searchChannels(search),
        });
    };

    openNewChannel = () => {
        console.log("newChannel");
        this.setState({ newChannel: true });
    };

    closeNewChannel = () => {
        console.log("newChannel");
        this.setState({ newChannel: false });
    };

    // onDelete = (id) => {
    //     //this.connection.isAdmin().then((x) => console.log(x));

    //     Alert.alert(
    //         "Admin Delete",
    //         "This will delete this post forever. Are you sure you want to continue?",
    //         [
    //             {
    //                 text: "Cancel",
    //                 onPress: () => {
    //                     return;
    //                 },
    //             },
    //             {
    //                 text: "Delete Post",
    //                 onPress: () => {
    //                     this.connection
    //                         .deletePost(id)
    //                         .then((res) => {
    //                             Alert.alert(res);
    //                         })
    //                         .catch((error) => {
    //                             Alert.alert(error.message);
    //                         });
    //                 },
    //             },
    //         ]
    //     );
    // };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading Home Page...</Text>
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
                            onChangeText={(text) => this.onChangeSearch(text)}
                            placeholder='Search...'
                            round
                        />
                        <FilterBtn
                            updateFilter={this.updateFilter}
                            isAdmin={this.state.isAdmin}
                        />
                    </View>
                    {this.state.searching && this.state.search != "" && (
                        <View style={styles.dropDown}>
                            <Text style={styles.ddText}>------Users------</Text>
                            <FlatList
                                data={this.state.userDATA}
                                renderItem={({ item }) => (
                                    <SearchItem
                                        type='user'
                                        item={item}
                                        connection={this.connection}
                                    />
                                )}
                                keyExtractor={(item) => item}
                            />
                            <Text style={styles.ddText}>
                                ------Channels------
                            </Text>
                            <Pressable onPress={this.openNewChannel}>
                                <View style={{ padingLeft: "5%" }}>
                                    <IonIcon
                                        name='add-circle-outline'
                                        style={{
                                            fontSize: 28,
                                            color: "white",
                                        }}
                                    />
                                </View>
                            </Pressable>

                            {this.state.newChannel && (
                                <NewChannel
                                    connection={this.connection}
                                    closeModal={this.closeNewChannel}
                                />
                            )}
                            <FlatList
                                data={this.state.channelDATA}
                                renderItem={({ item }) => (
                                    <SearchItem
                                        type='channel'
                                        item={item}
                                        connection={this.connection}
                                    />
                                )}
                                keyExtractor={(item) => item}
                            />
                        </View>
                    )}
                    <FlatList
                        data={this.state.DATA}
                        renderItem={({ item }) => (
                            <View style={styles.post}>
                                <Post
                                    item={item}
                                    onpressable={this.getID}
                                    connection={this.connection}
                                    onLikeBtnPress={this.onLikeBtnPress}
                                />
                                {/* {this.state.isAdmin && (
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
                                )} */}
                            </View>
                        )}
                        keyExtractor={(item) => item.ID.toString()}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refresh}
                    />

                    <Modal
                        visible={this.state.isPost}
                        animationType='slide'
                        transparent={true}
                    >
                        <View style={styles.center}>
                            <View style={styles.modalView}>
                                <SinglePost
                                    item={
                                        this.state.DATA[this.state.singlePostID]
                                    }
                                    back={this.handleSinglePostClose}
                                    connection={this.connection}
                                    onLikeBtnPress={this.onLikeBtnPress}
                                    isHidden={this.state.isHidden}
                                />
                            </View>
                        </View>
                    </Modal>
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
        backgroundColor: "white",
    },
    postCon: {
        flex: 1,
        backgroundColor: "#fff",
    },
    post: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    searchCon: {
        width: "85%",
        backgroundColor: "white",
        borderTopWidth: 0,
        borderBottomWidth: 0,
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
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalView: {
        margin: 5,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
        width: "90%",
        height: "85%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    icon1: {
        fontSize: 32,
        paddingBottom: "5%",
    },
});
