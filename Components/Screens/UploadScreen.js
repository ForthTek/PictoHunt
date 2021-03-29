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

import { AssetsSelector } from "expo-images-picker";
import Carousel from "react-native-snap-carousel";

export default class UploadScreen extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    state = {
        getImage: true,
        title: "",
        channel: "",
        image: [],
        res: null,
        modalVisible: false,
        lat: null,
        long: null,
        search: "",
        searching: false,
        channelDATA: [],
        imageSelector: false,
        activeIndex: 0,
        uris: [],
        PRESSED: false,
    };

    onChangeTitle = (value) => {
        this.setState({ title: value });
    };

    newImage = (value) => {
        console.log(value);
        this.setState({ image: value });
        let newuris = [];
        for (let i = 0; i < this.state.image.length; i++) {
            newuris[i] = this.state.image[i].uri;
        }
        this.setState({ getImage: false, uris: newuris });
    };

    handleBack = () => {
        this.setState({ image: null, getImage: true });
    };

    onChangeSearch = (search) => {
        this.setState({
            search: search,
            searching: true,
        });

        this.setState({
            channelDATA: this.connection.searchChannels(search),
        });
    };

    addChannel = (name) => {
        this.setState({ channel: name });
    };

    callConnection = async () => {
        let images = [];
        for (let i = 0; i < this.state.uris.length; i++) {
            const res = await fetch(this.state.uris[i]);
            const blob = await res.blob();
            images[i] = blob;
        }

        // const res = await fetch(this.state.image.uri);

        // const blob = await res.blob();

        this.connection
            .createPost(
                this.state.title,
                this.state.channel,
                this.state.lat,
                this.state.long,
                images // [blob]
            )
            .then(
                (key) => {
                    // Maybe go to single post view now?
                    //console.log(key);
                    this.setState({
                        title: "",
                        channel: "",
                        image: [],
                        res: null,
                        modalVisible: false,
                        lat: null,
                        long: null,
                        search: "",
                        searching: false,
                        channelDATA: [],
                        imageSelector: false,
                        activeIndex: 0,
                        uris: [],
                        PRESSED: false,
                    });
                    this.handleBack();
                    Alert.alert("Post Submitted: ", key.message);
                },
                (error) => {
                    console.log(error);
                    Alert.alert(error.message);
                    this.setState({ PRESSED: false });
                }
            );
    };

    handleSubmit = (lat, long) => {
        this.setState({ lat: lat[0], long: long[0], modalVisible: false });
    };

    openImageSelector = () => {
        this.setState({ imageSelector: true });

        // Load all channels
        this.connection.loadChannelsSearch();
    };

    closeImageSelector = () => {
        this.setState({ imageSelector: false });
    };

    _renderItem({ item, index }) {
        console.log(item);
        return (
            <View
                style={{
                    backgroundColor: "grey",
                    borderRadius: 5,
                    height: 250,
                    width: 250,
                    marginLeft: 25,
                    marginRight: 25,
                }}
            >
                <Image
                    style={{ width: 250, height: 250 }}
                    source={{ uri: item }}
                />
            </View>
        );
    }

    render() {
        if (this.state.getImage) {
            return (
                <SafeAreaView style={styles.container}>
                    {/* <Upload
                        newImage={(image) => {
                            this.newImage(image);
                        }}
                    /> */}
                    {!this.state.imageSelector && (
                        <View
                            style={{
                                paddingLeft: "20%",
                                paddingTop: "50%",
                                width: "80%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                title='Get an image from your library'
                                onPress={this.openImageSelector}
                            />
                        </View>
                    )}
                    {this.state.imageSelector && (
                        <AssetsSelector
                            options={{
                                manipulate: {
                                    width: 512,
                                    compress: 0.7,
                                    base64: false,
                                    saveTo: "jpeg",
                                },
                                assetsType: "photo",
                                maxSelections: 5,
                                margin: 3,
                                portraitCols: 4,
                                landscapeCols: 5,
                                widgetWidth: 100,
                                widgetBgColor: "white",
                                selectedBgColor: "blue",
                                spinnerColor: "blue",
                                videoIcon: {
                                    Component: Ionicon,
                                    iconName: "ios-videocam",
                                    color: "white",
                                    size: 20,
                                },
                                selectedIcon: {
                                    Component: Ionicon,
                                    iconName: "ios-checkmark-circle-outline",
                                    color: "tomato",
                                    bg: "grey",
                                    size: 20,
                                },
                                defaultTopNavigator: {
                                    continueText: "Finish",
                                    goBackText: "Back",
                                    backFunction: this.closeImageSelector,
                                    doneFunction: (data) => this.newImage(data),
                                },
                                noAssets: {
                                    Component: () => <Text>No images</Text>,
                                },
                            }}
                        />
                    )}
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

                    {/* <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: this.state.image.uri }}
                            style={{ width: 200, height: 200 }}
                        />
                    </View> */}

                    <View style={styles.container3}>
                        <Carousel
                            layoutCardOffset={15}
                            layout={"tinder"}
                            ref={(ref) => (this.carousel = ref)}
                            data={this.state.uris}
                            layoutCardOffset={20}
                            sliderWidth={300}
                            itemWidth={300}
                            renderItem={this._renderItem}
                            firstItem={this.state.uris.length - 1}
                            onSnapToItem={(index) =>
                                this.setState({ activeIndex: index })
                            }
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
                                {this.state.searching &&
                                    this.state.search != "" && (
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
                        {!this.state.PRESSED && (
                            <Button
                                title='SUBMIT'
                                onPress={() => {
                                    this.setState({ PRESSED: true });
                                    this.callConnection();
                                }}
                            />
                        )}
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
    container3: {
        height: "40%",
        alignSelf: "center",
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
    Image: {
        width: 250,
        height: 250,
    },
});
