import React, { Component } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Text, StyleSheet, View, Modal, Pressable, Alert } from "react-native";
import UserModal from "./userModal";
import ChannelModal from "./channelModal";
export default class SearchItem extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }

    state = {
        type: this.props.type,
        name: this.props.item,
        modalOpen: false,
        DATA: "",
    };

    openModal = () => {
        if (this.state.type == "user") {
            this.connection.getProfile(this.state.name).then(
                (user) => {
                    this.setState({ modalOpen: true, DATA: user });
                },
                (error) => {
                    Alert.alert(error.message);
                }
            );
        }
        if (this.state.type == "channel") {
            this.connection.getChannel(this.state.name).then(
                (channel) => {
                    this.setState({ modalOpen: true, DATA: channel });
                },
                (error) => {
                    Alert.alert(error.message);
                }
            );
        }
    };
    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    render() {
        return (
            <View>
                <Pressable onPress={() => this.openModal()}>
                    <Text style={styles.ddText}>{this.props.item}</Text>
                </Pressable>

                <Modal
                    visible={this.state.modalOpen}
                    animationType='slide'
                    transparent={true}
                >
                    <View style={styles.center}>
                        <View style={styles.modalView}>
                            <Pressable
                                onPress={() => {
                                    this.closeModal();
                                }}
                            >
                                <FeatherIcon
                                    name='x-circle'
                                    style={styles.icon1}
                                />
                            </Pressable>

                            {this.state.type == "user" && (
                                <UserModal
                                    DATA={this.state.DATA}
                                    connection={this.connection}
                                />
                            )}
                            {this.state.type == "channel" && (
                                <ChannelModal
                                    DATA={this.state.DATA}
                                    connection={this.connection}
                                />
                            )}
                        </View>
                    </View>
                </Modal>
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
    ddText: {
        fontSize: 20,
        paddingLeft: "2%",
        color: "white",
    },
    text: {
        fontSize: 20,
        paddingLeft: "2%",
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
});
