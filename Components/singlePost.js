import React, { Component } from "react";
import {
    Text,
    StyleSheet,
    SafeAreaView,
    View,
    Pressable,
    Image,
    FlatList,
    Alert,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import Ionicon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import LikeBtn from "./likeBtn";

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
            comments: this.props.item.comments,
            score: this.props.item.score,
            postID: this.props.item.ID,
            isLiked: this.props.item.liked,
            isDisliked: this.props.item.disliked,
        };
        this.connection = this.props.connection;
    }
    handleBack = () => {
        this.props.back();
    };

    getuserprofile = () => {
        let val = this.props.item.user;
        this.props.onProfilePress(val);
    };

    _renderItem({ item, index }) {
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
                <Image style={styles.Image} source={{ uri: item }} />
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
        const renderComments = ({ item }) => (
            <View style={{ maxHeight: 50 }}>
                <Text style={styles.info} numberOfLines={1}>
                    {item.text}
                </Text>
                <Text style={styles.postName}>{item.user}</Text>
            </View>
        );

        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
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
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: "white",
                        paddingTop: 30,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <Carousel
                            layout={"tinder"}
                            ref={(ref) => (this.carousel = ref)}
                            data={this.state.photos}
                            sliderWidth={300}
                            itemWidth={300}
                            renderItem={this._renderItem}
                            firstItem={this.state.photos.length - 1}
                            onSnapToItem={(index) =>
                                this.setState({ activeIndex: index })
                            }
                        />
                    </View>
                    <View style={styles.container}>
                        <View style={styles.likeCon}>
                            <View>
                                <Text style={styles.title} numberOfLines={1}>
                                    {this.state.title}
                                </Text>
                                <Pressable onPress={this.getuserprofile}>
                                    <Text style={styles.postName}>
                                        {this.state.user}
                                    </Text>
                                </Pressable>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <LikeBtn
                                    icon={
                                        this.state.isLiked
                                            ? "heart"
                                            : "heart-outline"
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
                                <Text
                                    style={{ fontSize: 22, paddingRight: "2%" }}
                                >
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
                        <View style={styles.comments}>
                            <FlatList
                                data={this.state.comments}
                                renderItem={renderComments}
                                keyExtractor={(item) => item.time}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        paddingBottom: "10%",
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
