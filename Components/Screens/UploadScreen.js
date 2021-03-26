import React, { Component } from "react";
import {
    View,
    StyleSheet,
    SafeAreaView,
    Image,
    Text,
    Button,
    Pressable,
    Alert,
    FlatList,
} from "react-native";
import Upload from "../upload";
import Ionicon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import { SearchBar, Input } from "react-native-elements";

import MapPicker from "../mapPicker";
import { Modal } from "react-native";
import { KeyboardAvoidingView } from "react-native";
export default class UploadScreen extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    state = {
        getImage: true,
        title: "",
        channel: "",
        image: null,
        res: null,
        modalVisible: false,
        lat: [],
        long: [],
        search: "",
        searching: false,
        channelDATA: [],
    };

    onChangeTitle = (value) => {
        this.setState({ title: value });
    };
    onChangeChannel = (value) => {
        this.setState({ channel: value });
        this.connection
            .searchChannels(value)
            .then((res) => this.setState({ search: res }));
    };

    newImage = (value) => {
        this.setState({ image: value });
        this.setState({ getImage: false });
    };

    handleBack = () => {
        this.setState({ image: null, getImage: true });
    };

    onChangeSearch = (search) => {
        this.setState({
            search: search,
            searching: true,
        });

        this.search(search);
    };

    search = async (search) => {
        // User Promise.all to send multiple request at the same time
        this.connection.searchChannels(search).then((res) => {
            this.setState({
                channelDATA: res,
            });
        });
    };

    addChannel = (name) => {
        this.setState({ channel: name });
    };

    callConnection = async () => {
        const res = await fetch(this.state.image.uri);
        const blob = await res.blob();

        this.connection
            .createPost(
                this.state.title,
                this.state.channel,
                this.state.lat,
                this.state.long,
                [blob]
            )
            .then(
                (key) => {
                    // Maybe go to single post view now?
                    //console.log(key);
                    this.setState({ lat: [], long: [] });
                    this.handleBack();
                    Alert.alert("Post Submitted");
                },
                (error) => {
                    console.log(error);
                    Alert.alert(error.message);
                }
            );
    };

    handleSubmit = (lat, long) => {
        this.setState({ lat: lat[0], long: long[0], modalVisible: false });
    };

    render() {
        if (this.state.getImage) {
            return (
                <SafeAreaView style={styles.container}>
                    <Upload
                        newImage={(image) => {
                            this.newImage(image);
                        }}
                    />
                </SafeAreaView>
            );
        } else {
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <Pressable onPress={this.handleBack}>
                        <Ionicon
                            name='arrow-back-circle-outline'
                            style={styles.icon}
                        />
                    </Pressable>

                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: this.state.image.uri }}
                            style={{ width: 200, height: 200 }}
                        />
                    </View>
                    <View style={styles.allInputContainer}>
                        <View style={styles.textInputs}>
                            <Text style={{ fontSize: 20, paddingTop: "2%" }}>
                                Title:
                            </Text>

                            <Input
                                containerStyle={styles.input}
                                onChangeText={(value) =>
                                    this.onChangeTitle(value)
                                }
                                value={this.state.title}
                                placeholder='Post Title'
                            />
                        </View>
                        <View
                            style={{ flexDirection: "row", paddingLeft: "1%" }}
                        >
                            <Text style={{ fontSize: 20 }}>Channel:</Text>
                            <Text style={styles.text}>
                                {this.state.channel}
                            </Text>
                        </View>
                        <View style={styles.textInputs}>
                            <Text style={{ fontSize: 20, paddingTop: "2%" }}>
                                Channels:
                            </Text>
                            <View style={styles.searchBox}>
                                <SearchBar
                                    containerStyle={styles.searchCon}
                                    inputContainerStyle={
                                        styles.inputContainerStyle
                                    }
                                    value={this.state.search}
                                    onChangeText={(text) =>
                                        this.onChangeSearch(text)
                                    }
                                    placeholder='Search...'
                                    round
                                />
                                {this.state.searching && (
                                    <View style={styles.dropDown}>
                                        <Text style={styles.ddText}>
                                            ------Channels------
                                        </Text>
                                        <FlatList
                                            data={this.state.channelDATA}
                                            renderItem={({ item }) => (
                                                <View>
                                                    <Pressable
                                                        onPress={() =>
                                                            this.addChannel(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.ddText
                                                            }
                                                        >
                                                            {item}
                                                        </Text>
                                                    </Pressable>
                                                </View>
                                            )}
                                            keyExtractor={(item) => item}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={{ paddingLeft: "1%" }}>
                            <Pressable
                                onPress={() => {
                                    this.setState({ modalVisible: true });
                                    console.log("modal");
                                }}
                            >
                                <View
                                    style={{
                                        width: "50%",
                                        alignItems: "center",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text style={{ fontSize: 20 }}>
                                        Add a location
                                    </Text>
                                    <Ionicon
                                        name='add-circle-outline'
                                        style={styles.icon1}
                                    />
                                </View>
                            </Pressable>

                            <Text style={{ fontSize: 20 }}>
                                lat: {this.state.lat}
                            </Text>
                            <Text style={{ fontSize: 20 }}>
                                long: {this.state.long}
                            </Text>
                        </View>
                    </View>
                    <Modal
                        visible={this.state.modalVisible}
                        animationType='slide'
                        transparent={true}
                    >
                        <View style={styles.center}>
                            <View style={styles.modalView}>
                                <Pressable
                                    onPress={() => {
                                        this.setState({ modalVisible: false });
                                        console.log("modal");
                                    }}
                                >
                                    <FeatherIcon
                                        name='x-circle'
                                        style={styles.icon}
                                    />
                                </Pressable>
                                <MapPicker onSubmit={this.handleSubmit} />
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.button}>
                        <Button
                            title='SUBMIT'
                            onPress={() => {
                                this.callConnection();
                            }}
                        />
                    </View>
                </KeyboardAvoidingView>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
    },
    imageContainer: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    allInputContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    textInputs: {
        flexDirection: "row",
        padding: "1%",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    input: {
        height: 45,
        width: "70%",
        fontSize: 20,
    },
    button: {
        maxWidth: "20%",
        paddingLeft: "2%",
        paddingBottom: "5%",
    },
    icon: {
        fontSize: 32,
        paddingLeft: "2%",
        paddingBottom: "2%",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width: "90%",
        height: "90%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    icon1: {
        fontSize: 24,
        paddingLeft: "2%",
    },
    text: {
        fontSize: 20,
        paddingLeft: "10%",
    },
    searchCon: {
        backgroundColor: "white",
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingBottom: "12%",
    },
    inputContainerStyle: {
        height: "5%",
    },
    dropDown: {
        backgroundColor: "#383d42",
        paddingBottom: "2%",
    },
    ddText: {
        fontSize: 20,
        paddingLeft: "2%",
        color: "white",
    },
    searchBox: {
        width: "70%",
        paddingBottom: "5%",
    },
});
