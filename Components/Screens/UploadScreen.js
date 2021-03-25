import React, { Component } from "react";
import {
    View,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Image,
    Text,
    Button,
    Pressable,
    Alert,
} from "react-native";
import Upload from "../upload";
import Ionicon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";

import MapPicker from "../mapPicker";
import { Modal } from "react-native";
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
        lat: null,
        long: null,
    };

    onChangeTitle = (value) => {
        this.setState({ title: value });
    };
    onChangeChannel = async (value) => {
        this.setState({ channel: value });
        console.log(await this.connection.searchChannels(value));
    };

    newImage = (value) => {
        this.setState({ image: value });
        this.setState({ getImage: false });
    };

    handleBack = () => {
        this.setState({ image: null, getImage: true });
    };

    callConnection = async () => {
        Alert.alert("Post Submitted");
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
                <SafeAreaView style={styles.container}>
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
                            <Text style={{ fontSize: 20 }}>Title:</Text>

                            <TextInput
                                style={styles.input}
                                onChangeText={(value) =>
                                    this.onChangeTitle(value)
                                }
                                value={this.state.text}
                                placeholder='Post Title'
                            />
                        </View>
                        <View style={styles.textInputs}>
                            <Text style={{ fontSize: 20 }}>Channels:</Text>

                            <TextInput
                                style={styles.input}
                                onChangeText={(value) =>
                                    this.onChangeChannel(value)
                                }
                                value={this.state.text}
                                placeholder='Channel'
                            />
                        </View>
                        <View style={{ paddingLeft: "2%" }}>
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
                                    <Text style={styles.text}>
                                        Add a location
                                    </Text>
                                    <Ionicon
                                        name='add-circle-outline'
                                        style={styles.icon1}
                                    />
                                </View>
                            </Pressable>

                            <Text style={styles.text}>
                                lat: {this.state.lat}
                            </Text>
                            <Text style={styles.text}>
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
                </SafeAreaView>
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
        alignItems: "center",
    },
    input: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        width: "70%",
        fontSize: 20,
        color: "gray",
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
    },
    text: {
        fontSize: 20,
    },
});
