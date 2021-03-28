import React, { Component } from "react";
import Score from "./score";
import ScoreComp from "./scoreComp";
import Post from "./post";
import SinglePost from "./singlePost";
import Connection from "./API/Connection";
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Pressable,
    Alert,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

export default class UserModal extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
        if (this.props.DATA.posts.length == 0) {
            this.state = {
                DATA: this.props.DATA,
                postDATA: this.props.DATA.posts,

                userScore: "",
                userPosts: "",
                userChallenges: "",

                scorediff: "",
                picsdiff: "",
                challangediff: "",

                isLoading: true,

                singlePost: false,
                singlePostID: "",

                justFollowed: false,
                refresh: false,
                noPosts: true,
            };
        } else {
            this.state = {
                DATA: this.props.DATA,
                postDATA: this.props.DATA.posts,

                userScore: "",
                userPosts: "",
                userChallenges: "",

                scorediff: "",
                picsdiff: "",
                challangediff: "",

                isLoading: true,

                singlePost: false,
                singlePostID: "",

                justFollowed: false,
                refresh: false,
                noPosts: false,
            };
        }
    }

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
        this.setState({ singlePost: true });
    };
    handleSinglePostClose = () => {
        this.setState({ singlePost: false });
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

    onFollow = () => {
        if (this.state.DATA.isFollowing) {
            this.connection
                .followUser(this.state.DATA.username, false)
                .then(() => {
                    this.setState({ justFollowed: true });
                });
        } else {
            this.connection
                .followUser(this.state.DATA.username, true)
                .then(() => {
                    this.setState({ justFollowed: true });
                });
        }
    };

    async componentDidMount() {
      const connection = new Connection();
      try {
        let user = await connection.getOurProfile();
        this.setState({
          userScore: user.score,
          userPosts: user.posts.length,
          userChallenges: user.challengeScore,

          scorediff: this.state.DATA.score - user.score,
          picsdiff: this.state.postDATA.length - user.posts.length,
          challangediff: this.state.DATA.challengeScore - user.challengeScore,
        });

      } catch (e) {
          console.error("Error getting user Profile Info!");
      } finally {
          this.setState({ isLoading: false });
      }

    }

    render() {
      if(this.state.isLoading == true){
        return  <Text> Loading {this.state.DATA.username}'s Profile... </Text>
      } else {
        return (
            <View style={styles.bigCon}>
                <View style={styles.container}>
                    <Text style={styles.text}>{this.state.DATA.username}</Text>
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
                <ScoreComp
                    usernumber={this.state.userScore}
                    othernumber={this.state.DATA.score}
                    numberdiff={this.state.scorediff}
                    label1='Score'
                    label2='points'
                />
                <ScoreComp
                    usernumber={this.state.userPosts}
                    othernumber={this.state.postDATA.length}
                    numberdiff={this.state.picsdiff}
                    label1='Posts'
                    label2='posts'
                />
                <ScoreComp
                    usernumber={this.state.userChallenges}
                    othernumber={this.state.DATA.challengeScore}
                    numberdiff={this.state.challangediff}
                    label1='Challenge'
                    label2='challenge points'
                />

                {this.state.noPosts && (
                    <Text style={styles.text1}>
                        This user hasn't posted yet :/
                    </Text>
                )}
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
                        />
                    </View>
                )}
            </View>
        );
    }
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
    text1: {
        color: "grey",
        fontSize: 24,
        paddingLeft: "2%",
        paddingTop: "5%",
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
