import React, { Component } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Alert } from "react-native";
import { Text, StyleSheet, Modal, Pressable, View } from "react-native";
import { Input } from "react-native-elements";
import FeatherIcon from "react-native-vector-icons/Feather";
export default class NewChannel extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }

    state = {
        title: "",
        desc: "",
    };

    createChannel = () => {
        this.connection.createChannel(this.state.title, this.state.desc).then(
            () => {
                Alert.alert("Channel Created");
                this.props.closeModal();
            },
            (error) => Alert.alert(error.message)
        );
    };

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <Modal visible={true} animationType='slide' transparent={true}>
                    <View style={styles.center}>
                        <View style={styles.modalView}>
                            <Pressable
                                onPress={() => {
                                    this.props.closeModal();
                                }}
                            >
                                <FeatherIcon
                                    name='x-circle'
                                    style={styles.icon1}
                                />
                            </Pressable>

                            <Text style={styles.text}>
                                New Channel Creation
                            </Text>
                            <View style={{ paddingBottom: "2%" }} />
                            <Input
                                label='Channel Title'
                                labelStyle={styles.text}
                                placeholder='Title'
                                onChangeText={(text) =>
                                    this.setState({ title: text })
                                }
                            />
                            <Input
                                label='Channel Description'
                                labelStyle={styles.text}
                                multiline
                                maxLength={240}
                                placeholder='Description'
                                onChangeText={(text) =>
                                    this.setState({ desc: text })
                                }
                            />
                            <Pressable onPress={this.createChannel}>
                                <FeatherIcon
                                    name='upload'
                                    style={styles.icon1}
                                />
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container1: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    text: {
        fontSize: 20,
        color: "black",
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
