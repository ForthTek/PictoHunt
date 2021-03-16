import React, { Component } from "react";
import { Alert, Pressable, StyleSheet, View, Modal, Text } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicon from "react-native-vector-icons/Ionicons";
export default class FiltetBtn extends Component {
    state = {
        modalVisible: false,
    };

    openFilterModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
        console.log("boi");
    };

    render() {
        return (
            <View style={styles.icon}>
                <Pressable onPress={this.openFilterModal}>
                    <FeatherIcon name='sliders' style={styles.icon} />
                </Pressable>

                <Modal
                    visible={this.state.modalVisible}
                    animationType='slide'
                    transparent={true}
                >
                    <View style={styles.center}>
                        <View style={styles.modalView}>
                            <Pressable onPress={this.openFilterModal}>
                                <Ionicon
                                    name='arrow-back-circle-outline'
                                    style={styles.icon}
                                />
                            </Pressable>
                            <Text>Hey</Text>
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
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: "1%",
    },
    icon: {
        fontSize: 32,
        paddingLeft: "1%",
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
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
