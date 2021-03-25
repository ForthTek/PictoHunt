import React, { Component } from "react";
import Score from "./score";
import Post from "./post";
import SinglePost from "./singlePost";
import { Text, StyleSheet, View, FlatList, Pressable, Alert } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
export default class UserModal extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }

    state = {
        DATA: this.props.DATA,
        postDATA: this.props.DATA.posts,

        singlePost: false,
        singlePostID: "",

        justFollowed: false,
    };

    getID = (id) => {
        let i = 0;
        for (; i < this.state.postDATA.length; i++) {
            if (id == this.state.postDATA[i].ID) {
                this.setState({ singlePostID: i });
            }
        }
        this.handleSinglePost();
    };

    handleSinglePost = () => {
        this.setState({ singlePost: true });
    };
    handleSinglePostClose = () => {
        this.setState({ singlePost: false });
        this.onRefresh();
    };

    getUser = (as) => {
      Alert.alert("aaa");
    }

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

    onFollow = () => {
        if (this.state.DATA.isFollowing) {
            this.connection
                .followChannel(this.state.DATA.name, false)
                .then(() => {
                    this.setState({ justFollowed: true });
                });
        } else {
            this.connection
                .followChannel(this.state.DATA.name, true)
                .then(() => {
                    this.setState({ justFollowed: true });
                });
        }
    };



    render() {
        return (
            <View style={styles.bigCon}>
                <View style={styles.container}>
                  <Text style={styles.text}>{this.state.DATA.name}</Text>
                  <Text>{this.state.DATA.description}</Text>
                    {!this.state.DATA.isFollowing && (
                          <Pressable onPress={this.onFollow}>
                              <FeatherIcon
                                  name={
                                      this.state.justFollowed
                                          ? "user-check"
                                          : "user-plus"
                                  }
                                  style={{ fontSize: 32, paddingRight: "5%" }}
                              />
                          </Pressable>
                      )}
                      {this.state.DATA.isFollowing && (
                          <Pressable onPress={this.onFollow}>
                              <FeatherIcon
                                  name={
                                      this.state.justFollowed
                                          ? "user-x"
                                          : "user-minus"
                                  }
                                  style={{ fontSize: 32, paddingRight: "5%" }}
                              />
                          </Pressable>
                      )}
                </View>
                <Text>{this.state.DATA.description}</Text>
                {!this.state.singlePost && (
                    <FlatList
                        style={styles.list}
                        data={this.state.postDATA}
                        renderItem={({ item }) => (
                            <View style={styles.post}>
                                <Post
                                    item={item}
                                    onpressable={this.getID}
                                    connection={this.connection}
                                    onLikeBtnPress={this.onLikeBtnPress}
                                    onProfilePress={this.getUser}
                                />
                            </View>
                        )}
                        keyExtractor={(item) => item.ID.toString()}
                    />
                )}
                {this.state.singlePost && (
                    <View style={styles.singleView}>
                        <SinglePost
                            item={this.state.postDATA[this.state.singlePostID]}
                            back={this.handleSinglePostClose}
                            connection={this.connection}
                            onLikeBtnPress={this.onLikeBtnPress}
                            onProfilePress={this.getUser}
                        />
                    </View>
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flexDirection: "row",

      justifyContent: "space-between",
    },
    bigCon: {
        height: "90%",
    },
    text: {
        fontSize: 32,
        paddingLeft: "2%",
    },
    post: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    list: {
        height: "80%",
        paddingTop: "5%",
    },
    singleView: {
        flex: 1,

        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
