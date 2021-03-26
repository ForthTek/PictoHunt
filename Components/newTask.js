import React, { Component } from "react";
import ChallengeTask from "./API/ChallengeTask";

import { Text, View, StyleSheet, FlatList, Pressable } from "react-native";
import { Input, SearchBar } from "react-native-elements";
import FeatherIcon from "react-native-vector-icons/Feather";
export default class NewTask extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }
    state = {
        newTask: new ChallengeTask(),
        newTaskDesc: "",
        newTaskChannel: "",
        newTaskLong: "",
        newTaskLat: "",
        newTaskRadius: "",
        searching: false,
        channelDATA: "",
        search: "",
    };

    onChangeSearch = (search) => {
        this.setState({
            search: search,
            searching: true,
        });
        if (search == "") {
            this.setState({ searching: false });
        }

        this.search(search);
    };

    search = async (search) => {
        // User Promise.all to send multiple request at the same time
        this.connection.searchChannels(search).then((res) => {
            this.setState({ channelDATA: res });
        });
    };

    addChannel = (item) => {
        this.setState({ newTaskChannel: item, searching: false });
    };

    render() {
        return (
            <View>
                <View stlye={styles.container}>
                    <Pressable
                        onPress={() => {
                            this.props.close();
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <FeatherIcon
                                name='x-circle'
                                style={{
                                    fontSize: 18,
                                    paddingTop: "1%",
                                }}
                            />
                            <Text style={{ fontSize: 18 }}>Cancel</Text>
                        </View>
                    </Pressable>
                    <Input
                        placeholder='Description'
                        onChangeText={(value) =>
                            this.setState({
                                newTaskDesc: value,
                            })
                        }
                        value={this.state.newTaskDesc}
                        label='Task Description:'
                        labelStyle={{ color: "black" }}
                    />

                    <SearchBar
                        label='Add a channel:'
                        labelStyle={{ color: "black" }}
                        containerStyle={styles.searchCon}
                        inputContainerStyle={styles.inputContainerStyle}
                        value={this.state.search}
                        onChangeText={(text) => this.onChangeSearch(text)}
                        placeholder='Search...'
                        round
                    />
                    {this.state.searching && this.state.search != "" && (
                        <View style={styles.dropDown}>
                            <Text style={styles.ddText}>
                                ------Channels------
                            </Text>
                            <FlatList
                                data={this.state.channelDATA}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            this.addChannel(item);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "white",
                                                paddingLeft: "2%",
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </Pressable>
                                )}
                                keyExtractor={(item) => item}
                            />
                        </View>
                    )}
                    <Text style={styles.text1}>
                        Post must be to Channel: {this.state.newTaskChannel}
                    </Text>

                    <Pressable
                        onPress={() =>
                            this.props.addTask(
                                this.state.newTaskDesc,
                                this.state.newTaskChannel,
                                null,
                                null,
                                null
                            )
                        }
                    >
                        <FeatherIcon
                            name='upload'
                            style={{ fontSize: 32, paddingBottom: "5%" }}
                        />
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
        justifyContent: "space-around",
        alignContent: "space-around",
    },
    container1: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    icon1: {
        fontSize: 32,
        paddingBottom: "5%",
    },
    text: {
        fontSize: 25,
    },
    text1: {
        fontSize: 20,
    },
    searchCon: {
        width: "85%",
        backgroundColor: "white",
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingBottom: "6%",
    },
    inputContainerStyle: {
        height: "5%",
        paddingBottom: "1%",
    },
    dropDown: {
        backgroundColor: "#383d42",
        paddingBottom: "2%",
        borderRadius: 10,
    },
    ddText: {
        fontSize: 20,
        paddingLeft: "2%",
        color: "white",
    },
});
