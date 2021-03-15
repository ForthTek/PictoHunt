import React, { Component } from "react";
import { Text, StyleSheet, View, Image, Pressable, Alert } from "react-native";
import LikeBtn from "./likeBtn";

class Post extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
        this.state = {
            title: this.props.item.title,
            user: this.props.item.user,
            photos: this.props.item.photos,
            score: this.props.item.score,
            postID: this.props.item.ID,
            type: "",
        };
    }

    handleSinglePost = () => {
        let value = this.props.item.ID;
        this.props.onpressable(value);
    };

    updateScore = (id) => {
        this.connection.getPost(id).then(
            (res) => {
                this.setState({ score: res.score });
                console.log(res.score);
            },
            (error) => {
                Alert.alert(error.message);
            }
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <Pressable onPress={this.handleSinglePost}>
                    <Image
                        style={styles.Image}
                        source={{
                            uri: this.state.photos[0],
                        }}
                    />
                </Pressable>
                <View style={styles.containerCol}>
                    <Text style={styles.title} numberOfLines={1}>
                        {this.state.title}
                    </Text>
                    <Text style={styles.postName}>{this.state.user}</Text>
                    <View style={styles.likeCon}>
                        <LikeBtn
                            icon='heart-outline'
                            title='Like'
                            type='like'
                            postID={this.state.postID}
                            onLikeBtnPress={(type, id) => {
                                this.props.onLikeBtnPress(
                                    type,
                                    id,
                                    this.updateScore
                                );
                            }}
                            connection={this.connection}
                        />
                        <Text style={{ fontSize: 22, paddingRight: "2%" }}>
                            {this.state.score}
                        </Text>
                        <LikeBtn
                            icon='heart-dislike-outline'
                            title='Dis-Like'
                            type='dislike'
                            postID={this.state.postID}
                            onLikeBtnPress={(type, id) => {
                                this.props.onLikeBtnPress(
                                    type,
                                    id,
                                    this.updateScore
                                );
                            }}
                            connection={this.connection}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
export default Post;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "row",
    },
    containerCol: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "1%",
    },
    Image: {
        width: 128,
        height: 128,
    },
    title: {
        fontSize: 18,
    },
    postName: {
        fontSize: 12,
        color: "grey",
        paddingBottom: "10%",
    },
    likeCon: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
    },
});
