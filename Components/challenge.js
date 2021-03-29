import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import Task from "./task";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Pressable } from "react-native";
export default class Challenge extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
        console.log(this.props.data);
    }

    state = {
        DATA: this.props.data,
        dropDown: false,
    };

    handleDropDown = () => {
        this.setState({ dropDown: !this.state.dropDown });
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container1}>
                    <Text style={styles.text}>
                        {this.state.DATA.description}
                    </Text>
                    <Text style={{ fontSize: 15 }}>
                        Deadline:{" "}
                        {this.state.DATA.deadline.toString().substring(16, 21)}{" "}
                        {this.state.DATA.deadline.toString().substring(4, 16)}
                    </Text>
                    <Text style={{ fontSize: 15 }}>
                        Score Bonus: +{this.state.DATA.score}
                    </Text>
                    <View style={styles.container2}>
                        <Text style={{ fontSize: 15, paddingRight: "1%" }}>
                            Tasks
                        </Text>
                        <Pressable onPress={this.handleDropDown}>
                            <FeatherIcon
                                name={
                                    this.state.dropDown
                                        ? "arrow-up"
                                        : "arrow-down"
                                }
                                style={styles.text}
                            />
                        </Pressable>
                    </View>
                    {this.state.dropDown && (
                        <View style={styles.listCon}>
                            <FlatList
                                style={styles.list}
                                data={this.state.DATA.tasks}
                                renderItem={({ item }) => (
                                    <Task
                                        data={item}
                                        connection={this.connection}
                                    />
                                )}
                                keyExtractor={(item) => item.ID}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.container3}>
                    <Pressable
                        onPress={() => this.props.delete(this.state.DATA.ID)}
                    >
                        <FeatherIcon name='trash-2' style={styles.icon} />
                    </Pressable>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between",
    },
    container1: {
        backgroundColor: "#fff",
    },
    container2: {
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    container3: {
        backgroundColor: "#fff",
        paddingRight: "3%",
        paddingTop: "2%",
    },
    listCon: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 5,
        width: "100%",
    },
    text: {
        fontSize: 20,
    },
    list: {
        paddingLeft: "2%",
    },
    icon: {
        fontSize: 28,
    },
});
