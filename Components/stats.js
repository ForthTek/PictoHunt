import React, { Component } from "react";
import { Alert } from "react-native";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }

    state = {
        DATA: "",
    };

    componentDidMount() {
        this.connection.getSummaryReport().then(
            (res) => {
                this.setState({ DATA: res });
                console.log(res);
            },
            (error) => {
                Alert.alert(error.message);
                console.log(error.message);
            }
        );
    }

    render() {
        return (
            <View>
                <Modal animationType='slide' transparent={true}>
                    <View style={styles.center}>
                        <View style={styles.modalView}>
                            <Pressable
                                onPress={() => {
                                    this.props.back();
                                }}
                            >
                                <FeatherIcon
                                    name='x-circle'
                                    style={styles.icon1}
                                />
                            </Pressable>

                            <Text style={styles.text}>
                                Number of Users: {this.state.DATA.users}
                            </Text>
                            <Text style={styles.text}>
                                Number of channels: {this.state.DATA.channels}
                            </Text>
                            <Text style={styles.text}>
                                Number of posts:{" "}
                                {this.state.DATA.publicPosts +
                                    this.state.DATA.privatePosts}
                            </Text>
                            <Text style={styles.text}>
                                Number of posts hidden:{" "}
                                {this.state.DATA.privatePosts}
                            </Text>
                            <Text style={styles.text}>
                                Number of public posts:{" "}
                                {this.state.DATA.publicPosts}
                            </Text>
                            <Text style={styles.text}>
                                Number of challenges:{" "}
                                {this.state.DATA.challenges}
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        height: "80%",
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
    text: {
        fontSize: 22,
        paddingLeft: "2%",
        paddingBottom: "5%",
    },
});
