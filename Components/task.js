import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
export default class Challenge extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }

    state = {
        DATA: this.props.data,
        isComplete: this.props.data.completed,
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.DATA.description}</Text>
                <FeatherIcon
                    name={this.state.isComplete ? "check" : "x"}
                    style={
                        this.state.isComplete
                            ? { fontSize: 16, color: "green" }
                            : { fontSize: 16, color: "red" }
                    }
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: "3%",
    },
});
