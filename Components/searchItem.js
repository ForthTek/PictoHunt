import React, { Component } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Text, StyleSheet, View, Modal, Pressable } from "react-native";
export default class SearchItem extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        modalOpen: false,
    };

    openModal = () => {
        this.setState({ modalOpen: true });
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
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
