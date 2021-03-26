import React, { Component } from "react";

import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Pressable,
} from "react-native";
import { SearchBar } from "react-native-elements";
import FeatherIcon from "react-native-vector-icons/Feather";
export default class NewTask extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }
    state = {
        newUsers: [],
        searching: false,
        userDATA: "",
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

        this.connection.searchUsers(search).then((result) => {
            this.setState({ userDATA: result });
        });
    };

    addUser = (item) => {
        const users = this.state.newUsers;
        users[users.length] = item;
        this.setState({ newUsers: users, searching: false });
    };

    render() {
        return (
            <View>
                <View>
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

                    <SearchBar
                        label='Challenge a User:'
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
                            <Text style={styles.ddText}>------Users------</Text>
                            <FlatList
                                data={this.state.userDATA}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            this.addUser(item);
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
                        Added Users: {this.state.newUsers.toString()}
                    </Text>

                    <Pressable
                        onPress={() => this.props.addUsers(this.state.newUsers)}
                    >
                        <FeatherIcon name='upload' style={{ fontSize: 32 }} />
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
        paddingLeft: "3%",
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
        paddingTop: "1%",
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
