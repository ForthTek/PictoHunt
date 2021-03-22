import React, { Component } from "react";
import { Pressable, StyleSheet, View, Modal } from "react-native";
import { CheckBox } from "react-native-elements";
import FeatherIcon from "react-native-vector-icons/Feather";

//import CheckBox from "react-native-check-box";
export default class FilterBtn extends Component {
    state = {
        modalVisible: false,
        orderByTimeCheck: true,
        orderByScoreCheck: false,
        onlyFollowedUsersCheck: false,
        onlyFollowedChannelsCheck: false,
        anyChanged: false,
        search: "",
    };

    openFilterModal = () => {
        this.setState({ modalVisible: true, anyChanged: false });
    };
    closeFilterModal = () => {
        this.setState({ modalVisible: false });
    };

    render() {
        return (
            <View style={styles.icon}>
                <View style={styles.container2}>
                    <Pressable onPress={this.openFilterModal}>
                        <FeatherIcon name='sliders' style={styles.icon} />
                    </Pressable>
                </View>

                <Modal
                    visible={this.state.modalVisible}
                    animationType='slide'
                    transparent={true}
                >
                    <View style={styles.center}>
                        <View style={styles.modalView}>
                            <Pressable
                                onPress={() => {
                                    this.closeFilterModal();
                                    this.props.updateFilter(
                                        this.state.orderByTimeCheck,
                                        this.state.orderByScoreCheck,
                                        this.state.onlyFollowedUsersCheck,
                                        this.state.onlyFollowedChannelsCheck,
                                        this.state.anyChanged
                                    );
                                }}
                            >
                                <FeatherIcon
                                    name='x-circle'
                                    style={styles.icon1}
                                />
                            </Pressable>
                            <View style={styles.container1}>
                                <CheckBox
                                    title='Order by most recent'
                                    iconType='material'
                                    checkedIcon='clear'
                                    uncheckedIcon='add'
                                    onPress={() =>
                                        this.setState({
                                            orderByTimeCheck: !this.state
                                                .orderByTimeCheck,
                                            orderByScoreCheck: !this.state
                                                .orderByScoreCheck,
                                            anyChanged: true,
                                        })
                                    }
                                    checked={this.state.orderByTimeCheck}
                                />
                            </View>
                            <View style={styles.container1}>
                                <CheckBox
                                    title='Order by highest score'
                                    iconType='material'
                                    checkedIcon='clear'
                                    uncheckedIcon='add'
                                    onPress={() =>
                                        this.setState({
                                            orderByTimeCheck: !this.state
                                                .orderByTimeCheck,
                                            orderByScoreCheck: !this.state
                                                .orderByScoreCheck,
                                            anyChanged: true,
                                        })
                                    }
                                    checked={this.state.orderByScoreCheck}
                                />
                            </View>
                            <View style={styles.container1}>
                                <CheckBox
                                    title='Only posts by followed users'
                                    iconType='material'
                                    checkedIcon='clear'
                                    uncheckedIcon='add'
                                    onPress={() =>
                                        this.setState({
                                            onlyFollowedUsersCheck: !this.state
                                                .onlyFollowedUsersCheck,
                                            anyChanged: true,
                                        })
                                    }
                                    checked={this.state.onlyFollowedUsersCheck}
                                />
                            </View>
                            <View style={styles.container1}>
                                <CheckBox
                                    title='Only posts by followed channels'
                                    iconType='material'
                                    checkedIcon='clear'
                                    uncheckedIcon='add'
                                    onPress={() =>
                                        this.setState({
                                            onlyFollowedChannelsCheck: !this
                                                .state
                                                .onlyFollowedChannelsCheck,
                                            anyChanged: true,
                                        })
                                    }
                                    checked={
                                        this.state.onlyFollowedChannelsCheck
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container1: {
        flexDirection: "row",
    },
    container2: {
        flexDirection: "row",
    },
    icon: {
        fontSize: 32,
        paddingTop: "1%",
        paddingLeft: "1%",
        color: "#919191",
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
