import React, { Component } from "react";
import { Alert, Pressable, StyleSheet, View, Modal, Text } from "react-native";
import { SearchBar, CheckBox } from "react-native-elements";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicon from "react-native-vector-icons/Ionicons";
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

    onChangeSearch = (search) => {
        this.setState({
            search: search,
        });
    };

    render() {
        return (
            <View style={styles.icon}>
                <View style={styles.container2}>
                    <SearchBar
                        containerStyle={styles.searchCon}
                        inputContainerStyle={styles.inputContainerStyle}
                        value={this.state.search}
                        onChangeText={this.onChurchSearch}
                        placeholder='Search...'
                        round
                    />
                    <View></View>
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
                                <Ionicon
                                    name='arrow-back-circle-outline'
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
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: "1%",
    },
    container1: {
        flexDirection: "row",
    },
    container2: {
        flexDirection: "row",
        // justifyContent: "center",
    },
    searchCon: {
        maxWidth: "85%",
    },
    inputContainerStyle: {
        maxHeight: "15%",
    },
    icon: {
        fontSize: 28,
        paddingLeft: "1%",
        paddingRight: "1%",
        paddingBottom: "1%",
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
