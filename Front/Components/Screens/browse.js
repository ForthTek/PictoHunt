import React, { Component } from "react";
import { Text, StyleSheet, SafeAreaView, View, FlatList } from "react-native";
import Post from "../post";
import SinglePost from "../singlePost";

export default class Browse extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    // Browse Page
    state = {
        isLoading: true,
        isPost: false,
        singlePostID: "",
        DATA: "",
    };

    componentDidMount() {
        //console.log(this.connection);
        this.connection.getBrowse().then((posts) => {
            this.setState({ DATA: posts });
            this.setState({ isLoading: false });
        });
    }

    getID = (id) => {
        let i = 0;
        for (; i < this.state.DATA.length; i++) {
            if (id == this.state.DATA[i].ID) {
                this.setState({ singlePostID: i });
            }
        }
        this.handleSinglePost();
    };

    handleSinglePost = () => {
        this.setState({ isPost: !this.state.isPost });
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
                </View>
            );
        }
        if (this.state.isPost) {
            return (
                <View style={styles.container}>
                    <SinglePost
                        item={this.state.DATA[this.state.singlePostID]}
                        back={this.handleSinglePost}
                    />
                </View>
            );
        } else {
            return (
                <SafeAreaView style={styles.postCon}>
                    <FlatList
                        data={this.state.DATA}
                        renderItem={({ item }) => (
                            <View style={styles.post}>
                                <Post item={item} onpressable={this.getID} />
                            </View>
                        )}
                        keyExtractor={(item) => item.ID.toString()}
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
        alignItems: "center",
        justifyContent: "center",
    },
    postCon: {
        flex: 1,
        backgroundColor: "#fff",
    },
    post: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
});
