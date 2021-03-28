import React, { Component } from "react";

import {
    Text,
    View,
    StyleSheet,
    Alert,
    FlatList,
    Pressable,
    Modal,
    KeyboardAvoidingView,
} from "react-native";
import { Input } from "react-native-elements";
import Challenge from "../challenge";
import IonIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import NewTask from "../newTask";

import SearchUser from "../searchUsers";
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
        date: new Date(),
        datePicker: false,
        mode: "date",
        tasks: [],
        taskDD: false,
        scoreBonus: 25,
        userDD: false,
        users: [],
    };

    componentDidMount() {
        this.connection.getChallenges().then(
            (data) => {
                this.setState({ DATA: data, isLoading: false });
                //console.log(this.state.DATA[0]);
            },
            (error) => {
                console.log(error);
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
                console.log(error);
                Alert.alert(error.message);
                this.setState({ refresh: false });
            }
        );
    };

    onDelete = (challengeID) => {
        //console.log("delete");
        this.connection.deleteChallenge(challengeID).then(() => {
            Alert.alert("Challenge Deleted");
            this.onRefresh();
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

    taskDropdownOpen = () => {
        this.setState({ taskDD: true });
    };

    taskDropdownClose = () => {
        this.setState({ taskDD: false });
    };

    userDropdownOpen = () => {
        this.setState({ userDD: true });
    };

    userDropdownClose = () => {
        this.setState({ userDD: false });
    };

    addTask = (chan, long, lat, rad) => {
        const taskArrays = this.state.tasks;
        taskArrays[taskArrays.length] = {
            channel: chan,
            latitude: lat,
            longitude: long,
            radius: rad,
        };
        this.setState({ tasks: taskArrays, taskDD: false });
        console.log(this.state.tasks);
    };

    addUsers = (newUsers) => {
        this.setState({ users: newUsers, userDD: false });
        console.log(this.state.users.toString());
    };

    newChallenge = () => {
        this.connection
            .createChallenge(
                this.state.modalDesc,
                this.state.date,
                this.state.tasks
            )
            .then(
                (res) => {
                    this.setState({ modal: false });
                    this.connection.inviteUsersToChallenge(
                        res,
                        this.state.users
                    );
                },
                (error) => Alert.alert(error.message)
            );
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
                </View>
            );
        } else {
            return (
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
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
                        <KeyboardAvoidingView
                            style={styles.center}
                            behavior={
                                Platform.OS === "ios" ? "padding" : "height"
                            }
                        >
                            <View style={styles.modalView}>
                                <View style={styles.container1}>
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
                                    <Pressable
                                        onPress={() => {
                                            this.newChallenge();
                                        }}
                                    >
                                        <FeatherIcon
                                            name='upload'
                                            style={styles.icon1}
                                        />
                                    </Pressable>
                                </View>
                                <Text style={styles.text}>New Challenge</Text>

                                <View style={styles.container1}>
                                    <Pressable onPress={this.openDatePicker}>
                                        <Text style={styles.pickText}>
                                            Pick Deadline Date
                                        </Text>
                                    </Pressable>
                                    <Pressable onPress={this.openTimePicker}>
                                        <Text style={styles.pickText}>
                                            Pick Deadline Time
                                        </Text>
                                    </Pressable>
                                </View>
                                <Text style={{ textAlign: "center" }}>
                                    Deadline:{" "}
                                    {this.state.date
                                        .toString()
                                        .substring(16, 21)}{" "}
                                    {this.state.date
                                        .toString()
                                        .substring(4, 16)}
                                </Text>
                                <Input
                                    placeholder='Description'
                                    onChangeText={(value) =>
                                        this.setState({ modalDesc: value })
                                    }
                                    label='Challenge Description:'
                                    labelStyle={{ color: "black" }}
                                    containerStyle={{ paddingTop: "2%" }}
                                />
                                <Text style={styles.text1}>
                                    Added Tasks: {this.state.tasks.length}
                                </Text>
                                <Text style={styles.text1}>
                                    Challenged Users:{" "}
                                    {this.state.users.toString()}
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        this.taskDropdownOpen();
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                        }}
                                    >
                                        <IonIcon
                                            name='add-circle-outline'
                                            style={styles.icon1}
                                        />
                                        <Text style={styles.text1}>Tasks</Text>
                                    </View>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        this.userDropdownOpen();
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                        }}
                                    >
                                        <IonIcon
                                            name='add-circle-outline'
                                            style={styles.icon1}
                                        />
                                        <Text style={styles.text1}>
                                            Challenge Users
                                        </Text>
                                    </View>
                                </Pressable>
                                {this.state.taskDD && (
                                    <NewTask
                                        connection={this.connection}
                                        close={this.taskDropdownClose}
                                        addTask={this.addTask}
                                    />
                                )}

                                {this.state.userDD && !this.state.taskDD && (
                                    <SearchUser
                                        connection={this.connection}
                                        close={this.userDropdownClose}
                                        addUsers={this.addUsers}
                                    />
                                )}
                            </View>
                        </KeyboardAvoidingView>
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
                </KeyboardAvoidingView>
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
        justifyContent: "space-between",
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
        height: "95%",
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
        paddingBottom: "1%",
    },
    text: {
        fontSize: 25,
    },
    text1: {
        fontSize: 20,
        paddingTop: "1%",
    },
    pickText: {
        fontSize: 15,
    },
});
