import React, { Component } from "react"
import { Text, StyleSheet, SafeAreaView, View, FlatList } from "react-native"
import { shouldUseActivityState } from "react-native-screens"
import Post from "./post"
import ServerTest from "./ServerTest"

export default class Browse extends Component {
    // Browse Page

    state = {
        isLoading: true,
        DATA: "",
    }

    ListItem = ({ item }) => {
        console.log("item")
        return (
            <View style={styles.post}>
                <Post item={item} />
            </View>
        )
    }

    // componentDidMount() {

    //         return fetch("http://10.0.2.2:5000/api/getBrowse")
    //         const responseJson = await response.json()
    //         this.setState({ DATA: responseJson.map((post) => post) })
    //         console.log(DATA)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

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
        const response = await fetch("http://10.0.2.2:5000/api/getBrowse")
        //console.log(response);
        const body = await response.json()
        if (response.status !== 200) throw Error(body.message)
        console.log("this is the body: " + body)
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
