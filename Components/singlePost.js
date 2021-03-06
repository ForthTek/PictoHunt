import React, { Component } from "react";
import { Text, StyleSheet, View, Pressable, Image, Alert } from "react-native";
import Carousel from "react-native-snap-carousel";
import Ionicon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import LikeBtn from "./likeBtn";
import CachedImage from "react-native-expo-cached-image";

export default class SinglePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.item.title,
            user: this.props.item.user,
            likes: this.props.item.likes,
            dislikes: this.props.item.dislikes,
            photos: this.props.item.photos,
            activeIndex: 0,

            score: this.props.item.score,
            postID: this.props.item.ID,
            isLiked: this.props.item.liked,
            isDisliked: this.props.item.disliked,
            channel: this.props.item.channel,
        };
        this.connection = this.props.connection;
    }
    handleBack = () => {
        this.props.back();
    };

    _renderItem({ item, index }) {
        console.log(item);
        return (
            <View
                style={{
                    backgroundColor: "grey",
                    borderRadius: 5,
                    height: 250,
                    marginLeft: 25,
                    marginRight: 25,
                }}
            >
                <CachedImage style={styles.Image} source={{ uri: item }} />
            </View>
        );
    }

    updateScore = (id) => {
        this.connection.getPost(id).then(
            (res) => {
                this.setState({
                    score: res.score,
                    isLiked: res.liked,
                    isDisliked: res.disliked,
                });
                //console.log(res.score);
            },
            (error) => {
                Alert.alert(error.message);
            }
        );
    };

    handleReport = () => {
        this.connection.reportPost(this.state.postID).then(
            () => Alert.alert("Post Reported"),
            (error) => Alert.alert(error.message)
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container1}>
                    <Pressable onPress={this.handleBack}>
                        <Ionicon
                            name='arrow-back-circle-outline'
                            style={styles.icon}
                        />
                    </Pressable>
                    <Pressable onPress={this.handleReport}>
                        <FeatherIcon name='flag' style={styles.icon} />
                    </Pressable>
                </View>
                <View style={styles.container3}>
                    <Carousel
                        layout={"tinder"}
                        ref={(ref) => (this.carousel = ref)}
                        data={this.state.photos}
                        layoutCardOffset={15}
                        sliderWidth={300}
                        itemWidth={300}
                        renderItem={this._renderItem}
                        firstItem={0}
                        onSnapToItem={(index) =>
                            this.setState({ activeIndex: index })
                        }
                    />
                </View>

                <View style={styles.container2}>
                    <View style={{ maxWidth: "70%" }}>
                        <Text style={styles.title} numberOfLines={3}>
                            {this.state.title}
                        </Text>

                        <Text style={styles.postName}>
                            {this.state.channel}
                        </Text>
                        <Text style={styles.postName}>{this.state.user}</Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <LikeBtn
                            icon={
                                this.state.isLiked ? "heart" : "heart-outline"
                            }
                            title='Like'
                            type='like'
                            postID={this.state.postID}
                            onLikeBtnPress={(type, id) => {
                                if (this.state.isLiked) {
                                    this.props.onLikeBtnPress(
                                        "remove",
                                        id,
                                        this.updateScore
                                    );
                                } else {
                                    this.props.onLikeBtnPress(
                                        type,
                                        id,
                                        this.updateScore
                                    );
                                }
                            }}
                            connection={this.connection}
                        />
                        <Text style={{ fontSize: 22, paddingRight: "2%" }}>
                            {this.state.score}
                        </Text>
                        <LikeBtn
                            icon={
                                this.state.isDisliked
                                    ? "heart-dislike"
                                    : "heart-dislike-outline"
                            }
                            title='Dis-Like'
                            type='dislike'
                            postID={this.state.postID}
                            onLikeBtnPress={(type, id) => {
                                if (this.state.isDisliked) {
                                    this.props.onLikeBtnPress(
                                        "remove",
                                        id,
                                        this.updateScore
                                    );
                                } else {
                                    this.props.onLikeBtnPress(
                                        type,
                                        id,
                                        this.updateScore
                                    );
                                }
                            }}
                            connection={this.connection}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        width: "95%",
        maxWidth: "95%",
        alignItems: "center",
        // backgroundColor: "blue",
    },
    container1: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: "5%",
        // backgroundColor: "green",
        width: "100%",
    },
    container2: {
        // backgroundColor: "red",
        width: "100%",
        paddingTop: "1%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    container3: {
        maxHeight: "40%",
    },
    Image: {
        width: 250,
        height: 250,
    },
    icon: {
        fontSize: 32,
    },
    title: {
        fontSize: 22,
    },
    info: {
        fontSize: 18,
    },
    postName: {
        fontSize: 12,
        color: "grey",
    },
    likeCon: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        maxHeight: 100,
    },
    comments: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
