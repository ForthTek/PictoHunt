import React, { Component } from "react"
import { Text, StyleSheet, View, Image } from "react-native"
import LikeBtn from "./likeBtn"
import ServerTest from "./ServerTest"

class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: this.props.url,
            title: "",
            user: "",
            likes: "",
            dislikes: "",
            photos: "",
        }
    }

    componentDidMount() {
        return fetch(this.props.url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    title: responseJson[0].title,
                    user: responseJson[0].user,
                    likes: responseJson[0].likes,
                    dislikes: responseJson[0].dislikes,
                    photos: responseJson[0].photos,
                })
                console.log(responseJson[0].photos)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <ServerTest />
                <Image
                    style={styles.Image}
                    source={{
                        uri: this.state.photos[0],
                    }}
                />
                <View style={styles.containerCol}>
                    <Text style={styles.title} numberOfLines={1}>
                        {this.state.title}
                    </Text>
                    <Text style={styles.postName}>{this.state.user}</Text>
                    <View style={styles.likeCon}>
                        <LikeBtn icon='heart-outline' title='Like' />
                        <Text style={{ fontSize: 22, paddingRight: "2%" }}>
                            {this.state.likes + this.state.dislikes}
                        </Text>
                        <LikeBtn
                            icon='heart-dislike-outline'
                            title='Dis-Like'
                        />
                    </View>
                </View>
            </View>
        )
    }
}
export default Post

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "row",
    },
    containerCol: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "1%",
    },
    Image: {
        width: 128,
        height: 128,
    },
    title: {
        fontSize: 18,
    },
    postName: {
        fontSize: 12,
        color: "grey",
        paddingBottom: "10%",
    },
    likeCon: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
    },
})
