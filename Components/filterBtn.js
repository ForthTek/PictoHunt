import React, { Component } from "react";
import { Alert, Pressable, StyleSheet, View, Modal, Text } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicon from "react-native-vector-icons/Ionicons";
import CheckBox from "react-native-check-box";
export default class FilterBtn extends Component {
    state = {
        modalVisible: false,
        orderByTimeCheck: true,
        orderByScoreCheck: false,
        onlyFollowedUsersCheck: false,
        onlyFollowedChannelsCheck: false,
    };

    openFilterModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
        // if (!this.state.modalVisible) {
        //     this.props.updateFilter(
        //         this.state.orderByTimeCheck,
        //         this.state.orderByScoreCheck,
        //         this.state.onlyFollowedUsersCheck,
        //         this.state.onlyFollowedChannelsCheck
        //     );
        // }
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
                            <Pressable
                                onPress={() => {
                                    this.openFilterModal();
                                    this.props.updateFilter(
                                        this.state.orderByTimeCheck,
                                        this.state.orderByScoreCheck,
                                        this.state.onlyFollowedUsersCheck,
                                        this.state.onlyFollowedChannelsCheck
                                    );
                                }}
                            >
                                <Ionicon
                                    name='arrow-back-circle-outline'
                                    style={styles.icon1}
                                />
                            </Pressable>
                            <View style={styles.container1}>
                                <CheckBox
                                    onClick={() =>
                                        this.setState({
                                            orderByTimeCheck: !this.state
                                                .orderByTimeCheck,
                                            orderByScoreCheck: !this.state
                                                .orderByScoreCheck,
                                        })
                                    }
                                    isChecked={this.state.orderByTimeCheck}
                                />
                                <Text>Order by newest post</Text>
                            </View>
                            <View style={styles.container1}>
                                <CheckBox
                                    onClick={() =>
                                        this.setState({
                                            orderByTimeCheck: !this.state
                                                .orderByTimeCheck,
                                            orderByScoreCheck: !this.state
                                                .orderByScoreCheck,
                                        })
                                    }
                                    isChecked={this.state.orderByScoreCheck}
                                />
                                <Text>Order by highest score</Text>
                            </View>
                            <View style={styles.container1}>
                                <CheckBox
                                    onClick={() =>
                                        this.setState({
                                            onlyFollowedUsersCheck: !this.state
                                                .onlyFollowedUsersCheck,
                                        })
                                    }
                                    isChecked={
                                        this.state.onlyFollowedUsersCheck
                                    }
                                />
                                <Text>Only see posts by followed users</Text>
                            </View>
                            <View style={styles.container1}>
                                <CheckBox
                                    onClick={() =>
                                        this.setState({
                                            onlyFollowedChannelsCheck: !this
                                                .state
                                                .onlyFollowedChannelsCheck,
                                        })
                                    }
                                    isChecked={
                                        this.state.onlyFollowedChannelsCheck
                                    }
                                />
                                <Text>Only see posts by followed channels</Text>
                            </View>
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
    container1: {
        flexDirection: "row",
    },
    icon: {
        fontSize: 32,
        paddingLeft: "1%",
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
});
