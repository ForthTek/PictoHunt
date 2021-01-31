import React, { Component } from "react"
import { Text, StyleSheet, SafeAreaView, View, FlatList } from "react-native"
import Post from "./post"

export default class Browse extends Component {
    // Browse Page

    state = {
        isLoading: true,
        DATA: "",
    }

    componentDidMount() {
        console.log("Mounted")
        this.callApi()
            .then((res) => {
                this.setState({ DATA: res })
                this.setState({ isLoading: false })
            })
            .catch((err) => console.log(err))
    }

    callApi = async () => {
        const response = await fetch("http://10.0.2.2:5000/api/getBrowse")
        const body = await response.json()
        if (response.status !== 200) throw Error(body.message)
        return body
    }

    renderItem = ({ item }) => <ListItem item={item} />
    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
                </View>
            )
        } else {
            return (
                <SafeAreaView style={styles.postCon}>
                    <FlatList
                        data={this.state.DATA}
                        renderItem={({ item }) => (
                            <View style={styles.post}>
                                <Post item={item} />
                            </View>
                        )}
                        keyExtractor={(item) => item.ID.toString()}
                    />
                </SafeAreaView>
            )
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
})
