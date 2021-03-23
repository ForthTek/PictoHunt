import React, { Component } from "react";
import Score from "./score";

import { Text, StyleSheet, View } from "react-native";
export default class UserModal extends Component {
    constructor(props) {
        super(props);
        this.connection = this.props.connection;
    }

    state = {
        DATA: this.props.DATA,
        postDATA: "",
        posts: false,
    };

    // componentDidMount() {
    //     this.connection
    //         .getPostsByUser(this.state.DATA.username)
    //         .then((posts) => {
    //             this.setState({ postDATA: posts, posts: true });
    //         });
    // }

    render() {
        return (
            <View>
                <Text style={styles.text}>{this.state.DATA.username}</Text>
                <View
                    style={{
                        flexDirection: "row",
                        paddingBottom: "5%",
                        justifyContent: "space-between",
                    }}
                >
                    <Score label='Score' number={this.state.DATA.score} />
                    <Score label='Pics' number={this.state.DATA.totalPosts} />
                    <Score label='Rank' number={5} />
                </View>
                {this.state.posts && (
                    <FlatList
                        data={this.state.postDATA}
                        renderItem={({ item }) => (
                            <View style={styles.post}>
                                <Post
                                    item={item}
                                    onpressable={this.getID}
                                    connection={this.connection}
                                    onLikeBtnPress={this.onLikeBtnPress}
                                />
                            </View>
                        )}
                        keyExtractor={(item) => item.ID.toString()}
                    />
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 32,
        paddingLeft: "2%",
    },
});
