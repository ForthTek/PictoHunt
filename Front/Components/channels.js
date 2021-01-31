import React, { Component } from "react"
import { FlatList, StyleSheet, SafeAreaView, View, Text } from "react-native"
import Channel from "./channel"

export default class Channels extends Component {
    // Channel Page

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
                console.log(res)
                console.log(this.state.DATA)
            })
            .catch((err) => console.log(err))
    }

    callApi = async () => {
        const response = await fetch("http://10.0.2.2:5000/api/getChannels")
        //console.log(response);
        const body = await response.json()
        if (response.status !== 200) throw Error(body.message)
        console.log("this is the body: " + body)
        return body
    }

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
                                <Channel item={item} />
                            </View>
                        )}
                        keyExtractor={(item) => item.name}
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
