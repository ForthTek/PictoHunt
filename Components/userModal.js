import React, { Component } from "react";
import Score from "./score";
import Post from "./post";
import SinglePost from "./singlePost";
import { Text, StyleSheet, View, FlatList } from "react-native";
export default class UserModal extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }

    state = {
        DATA: this.props.DATA,
        postDATA: this.props.DATA.posts,
        hasPosts: true,
        singlePost: false,
        singlePostID: "",
    };

    // componentDidMount() {
    //     this.connection
    //         .getPostsByUser(this.state.DATA.username)
    //         .then((posts) => {
    //             this.setState({ postDATA: posts, posts: true });
    //         });
    // }

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
        this.setState({ singlePost: !this.state.singlePost });
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

    render() {
        return (
            <View style={styles.bigCon}>
                <Text style={styles.text}>{this.state.DATA.username}</Text>
                <View
                    style={{
                        flexDirection: "row",
                        paddingBottom: "5%",
                        justifyContent: "space-between",
                    }}
                >
                    <Score label='Score' number={this.state.DATA.score} />
                    <Score label='Pics' number={this.state.postDATA.length} />
                    <Score label='Rank' number={5} />
                </View>
                {this.state.hasPosts && !this.state.singlePost && (
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
                                />
                            </View>
                        )}
                        keyExtractor={(item) => item.ID.toString()}
                    />
                )}
                {this.state.hasPosts && this.state.singlePost && (
                    <View style={styles.singleView}>
                        <SinglePost
                            item={this.state.postDATA[this.state.singlePostID]}
                            back={this.handleSinglePost}
                            connection={this.connection}
                            onLikeBtnPress={this.onLikeBtnPress}
                        />
                    </View>
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
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
    },
    singleView: {
        flex: 1,

        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
