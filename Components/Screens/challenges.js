import React, { Component } from "react";

import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Alert,
    FlatList,
    Pressable,
    Modal,
} from "react-native";
import { Input } from "react-native-elements";
import Challenge from "../challenge";
import IonIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";

export default class challenges extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    state = {
        isLoading: true,
        DATA: "",
        refresh: false,
        modal: false,
        modalDisc: "",
        date: new Date(1598051730000),
        datePicker: false,
        mode: "date",
    };

    componentDidMount() {
        this.connection.getChallenges().then(
            (data) => {
                this.setState({ DATA: data, isLoading: false });
                console.log(this.state.DATA[0]);
            },
            (error) => {
                Alert.alert(error.message);
            }
        );
    }

    onRefresh = async () => {
        this.setState({ refresh: true, DATA: "" });
        this.connection.getChallenges().then(
            (res) => {
                this.setState({ DATA: res });
                this.setState({ refresh: false });
            },
            (error) => {
                Alert.alert(error.message);
                this.setState({ refresh: false });
            }
        );
    };

    onDelete = (challengeID) => {
        console.log("delete");
        this.connection.deleteChallenge(challengeID).then(() => {
            Alert.alert("Challenge Deleted");
        });
    };

    openModal = () => {
        this.setState({ modal: true });
    };

    closeModal = () => {
        this.setState({ modal: false });
    };

    openDatePicker = () => {
        this.setState({ mode: "date", datePicker: true, modal: false });
    };
    openTimePicker = () => {
        this.setState({ mode: "time", datePicker: true, modal: false });
    };

    newChallenge = () => {};

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
                </View>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <Pressable onPress={this.openModal}>
                        <IonIcon
                            name='add-circle-outline'
                            style={{ fontSize: 32 }}
                        />
                    </Pressable>
                    <Modal
                        visible={this.state.modal}
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
                                <Text style={styles.text}>New Challenge</Text>
                                <Input
                                    placeholder='Description'
                                    onChangeText={(value) =>
                                        this.setState({ modalDisc: value })
                                    }
                                    label='Challenge Description:'
                                    containerStyle={{ paddingTop: "5%" }}
                                />
                                <View style={styles.container1}>
                                    <Pressable onPress={this.openDatePicker}>
                                        <Text>Pick Deadline Date</Text>
                                    </Pressable>
                                    <Pressable onPress={this.openTimePicker}>
                                        <Text>Pick Deadline Time</Text>
                                    </Pressable>
                                </View>
                                <Text>
                                    Deadline:{" "}
                                    {this.state.date
                                        .toString()
                                        .substring(16, 21)}{" "}
                                    {this.state.date
                                        .toString()
                                        .substring(4, 16)}
                                </Text>
                            </View>
                        </View>
                    </Modal>

                    {this.state.datePicker && (
                        <DateTimePicker
                            testID='dateTimePicker'
                            value={this.state.date}
                            mode={this.state.mode}
                            is24Hour={true}
                            display='default'
                            onChange={(event, res) => {
                                const dateNew = res || this.state.date;
                                this.setState({
                                    date: dateNew,
                                    modal: true,
                                    datePicker: false,
                                });
                            }}
                        />
                    )}

                    <FlatList
                        data={this.state.DATA}
                        renderItem={({ item }) => (
                            <Challenge
                                connection={this.connection}
                                data={item}
                                delete={this.onDelete}
                            />
                        )}
                        keyExtractor={(item) => item.ID.toString()}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refresh}
                    />
                </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingLeft: "3%",
    },
    container1: {
        flexDirection: "row",
        justifyContent: "space-around",
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
    text: {
        fontSize: 25,
    },
});
