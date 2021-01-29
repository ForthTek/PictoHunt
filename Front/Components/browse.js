import React from "react"
import { Text, StyleSheet, SafeAreaView, View, FlatList } from "react-native"
import { shouldUseActivityState } from "react-native-screens"
import Post from "./post"
import ServerTest from "./ServerTest"

DATA = [
    {
        ID: 9,
        title: "The best doggo!",
        user: "John Smith",
        channel: "Pets",
        score: 1,
        likes: 1,
        dislikes: 0,
        time: 0,
        GPSLatitude: null,
        GPSLongitude: null,
        tags: ["animal", "dog", "pet"],
        photos: [
            "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog3.jpg",
        ],
        comments: [],
    },
    {
        ID: 8,
        title: "He is the cutest boy!",
        user: "John Smith",
        channel: "Pets",
        score: 2,
        likes: 2,
        dislikes: 0,
        time: 0,
        GPSLatitude: null,
        GPSLongitude: null,
        tags: ["animal", "cute", "dog", "pet"],
        photos: [
            "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog2.jpg",
        ],
        comments: [],
    },
    {
        ID: 7,
        title: "What a cutie!",
        user: "John Smith",
        channel: "Pets",
        score: 1,
        likes: 1,
        dislikes: 0,
        time: 0,
        GPSLatitude: null,
        GPSLongitude: null,
        tags: ["animal", "cute", "dog", "pet"],
        photos: [
            "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog1.jpg",
        ],
        comments: [],
    },
    {
        ID: 6,
        title: "Holiday pic from last year",
        user: "Joe Bloggs",
        channel: "Holiday Pictures",
        score: 2,
        likes: 2,
        dislikes: 0,
        time: 0,
        GPSLatitude: 5.466131,
        GPSLongitude: 9.06908,
        tags: ["animal", "holiday"],
        photos: [
            "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e4.jpg",
        ],
        comments: [],
    },
    {
        ID: 3,
        title: "A pic from my holiday in London",
        user: "Joe Bloggs",
        channel: "Holiday Pictures",
        score: 1,
        likes: 1,
        dislikes: 0,
        time: 0,
        GPSLatitude: 51.510357,
        GPSLongitude: -0.116773,
        tags: ["architecture", "city", "historic-architecture", "holiday"],
        photos: [
            "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben3.jpg",
        ],
        comments: [],
    },
    {
        ID: 2,
        title: "Big Ben at night",
        user: "Professional Photography",
        channel: "London",
        score: 2,
        likes: 2,
        dislikes: 0,
        time: 0,
        GPSLatitude: 51.510357,
        GPSLongitude: -0.116773,
        tags: ["architecture", "city", "historic-architecture"],
        photos: [
            "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben4.jpg",
        ],
        comments: [],
    },
    {
        ID: 1,
        title: "Big Ben and the Palace of Westmi",
        user: "Professional Photography",
        channel: "London",
        score: 2,
        likes: 2,
        dislikes: 0,
        time: 0,
        GPSLatitude: 51.510357,
        GPSLongitude: -0.116773,
        tags: ["architecture", "city", "historic-architecture"],
        photos: [
            "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben1.jpg",
            "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben2.jpg",
        ],
        comments: [],
    },
]

const Item = ({ item }) => {
    return (
        <View style={styles.post}>
            <Post url='http://10.0.2.2:5000/api/getUser' />
        </View>
    )
}

export default function Browse() {
    // Browse Page
    const renderItem = ({ item }) => <Item item={item} />
    return (
        <SafeAreaView style={styles.container}>
            {/* <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.ID.toString()}
            /> */}
            <Post url='http://10.0.2.2:5000/api/getBrowse' />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    post: {
        borderColor: "grey",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
})
