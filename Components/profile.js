import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Pressable,
    Alert,
    Modal,
} from "react-native";
import Image from "react-native-scalable-image";
import ScoreComp from "./scoreComp";
import Ionicon from "react-native-vector-icons/Ionicons";
import Connection from "./API/Connection";

import FeatherIcon from "react-native-vector-icons/Feather";

export default class Profile extends Component {
    // Profile page

    constructor(props) {
        super(props);
        this.connection = props.connection;
        this.state = {
            otherusername: "",
            otheruserjoin: "",
            otheruserlocation: "",
            otheruserpfp: "",

            userscore: -1,
            userpics: -1,
            userrank: -1,
            otherscore: -1,
            otherpics: -1,
            otherrank: -1,

            scorediff: -1,
            picsdiff: -1,
            rankdiff: -1,

            isLoading: true,
            galleryopen: false,
        };
        this.connection = props.connection;
    }

    async componentDidMount() {
        const connection = new Connection();
        try {
            let user = await connection.getOurProfile();
            let otheruser = await connection.getProfile(this.props.user);
            this.setState({
                otherusername: otheruser.username,
                otheruserjoin: otheruser.timestamp.toString().substring(4, 15),
                otheruserlocation: "TODO",
                otheruserpfp: "../assets/pfp-placeholder.png",

                userscore: user.score,
                userpics: user.posts.length,
                userrank: "TODO",
                otherscore: otheruser.score,
                otherpics: otheruser.posts.length,
                otherrank: "TODO",

                scorediff: otheruser.score - user.score,
                picsdiff: otheruser.posts.length - user.posts.length,
                rankdiff: (0 - 0) * -1,
                // other users rank - your rank
            });
        } catch (e) {
            console.error("Error getting user Profile Info!");
        } finally {
            this.setState({ isLoading: false });
        }
    }

    opengallery = () => {
        this.setState({ galleryopen: true });
    };

    closegallery = () => {
        this.setState({ galleryopen: false });
    };

    followuser = () => {
        Alert.alert("Follow User TODO");
    };

    render() {
        if (this.state.isLoading == true) {
            return (
                <SafeAreaView>
                    <Text>Loading {this.props.user}s Profile...</Text>
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <Modal
                        visible={this.state.galleryopen}
                        animationType='slide'
                        transparent={true}
                    >
                        <View style={styles.center}>
                            <View style={styles.modalView}>
                                <Pressable
                                    onPress={() => {
                                        this.closegallery();
                                    }}
                                >
                                    <FeatherIcon
                                        name='x-circle'
                                        style={styles.icon1}
                                    />
                                </Pressable>

                                <Text>
                                    {" "}
                                    Someone who knows what they're doing insert
                                    a list of all user posts idk what im doing{" "}
                                </Text>
                            </View>
                        </View>
                    </Modal>
                    <Pressable
                        onPress={() => {
                            this.props.back();
                        }}
                    >
                        <Ionicon
                            name='arrow-back-circle-outline'
                            style={styles.icon}
                        />
                    </Pressable>
                    <View style={{ flexDirection: "row", padding: "5%" }}>
                        <Image
                            source={require("../assets/pfp-placeholder.png")}
                            width={160}
                        />
                        <View
                            style={{
                                flexDirection: "column",
                                paddingLeft: "3%",
                                paddingRight: "15%",
                            }}
                        >
                            <Text style={styles.username}>
                                {this.state.otherusername}
                            </Text>
                            <Text style={styles.info}>Joined:</Text>
                            <Text style={styles.info}>
                                {this.state.otheruserjoin}
                            </Text>
                            <Text style={styles.info}>Located:</Text>
                            <Text style={styles.info}>
                                {this.state.otheruserlocation}
                            </Text>
                        </View>
                    </View>
                    <ScoreComp
                        usernumber={this.state.userscore}
                        othernumber={this.state.otherscore}
                        numberdiff={this.state.scorediff}
                        label1='Score'
                        label2='points'
                    />
                    <ScoreComp
                        usernumber={this.state.userpics}
                        othernumber={this.state.otherpics}
                        numberdiff={this.state.picsdiff}
                        label1='Pics'
                        label2='pictures'
                    />
                    <ScoreComp
                        usernumber={this.state.userrank}
                        othernumber={this.state.otherrank}
                        numberdiff={this.state.rankdiff}
                        label1='Rank'
                        label2='ranks'
                    />

                    <Text
                        style={styles.button}
                        onPress={() => {
                            this.followuser();
                        }}
                    >
                        Follow User
                    </Text>

                    <Text
                        style={styles.button}
                        onPress={() => {
                            this.opengallery();
                        }}
                    >
                        See Photo Gallery
                    </Text>
                </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "0%",
    },
    username: {
        fontSize: 22,
        paddingBottom: "10%",
    },
    info: {
        fontSize: 18,
        paddingBottom: "5%",
    },
    icon: {
        fontSize: 32,
    },
    button: {
        fontSize: 28,
        textAlign: "center",
        padding: "3.5%",
    },
    modalView: {
        margin: 5,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
        width: "90%",
        height: "90%",
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
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
