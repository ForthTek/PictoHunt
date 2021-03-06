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
import Ionicons from "react-native-vector-icons/Ionicons";
import { AssetsSelector } from "expo-images-picker";
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
    };

    onChangeTitle = (value) => {
        this.setState({ title: value });
    };
    onChangeChannel = (value) => {
        this.setState({ channel: value });
    };

    newImage = (value) => {
        this.setState({ image: value });
        // console.log(this.state.image.base64);
        this.setState({ getImage: false });
    };

    handleBack = () => {
        this.setState({ image: null, getImage: true });
    };

    callConnection = async () => {
        const res = await fetch(this.state.image.uri);
        const blob = await res.blob();

        this.connection
            .createPost(this.state.title, this.state.channel, null, [], [blob])
            .then(
                (key) => {
                    console.log(key);
                },
                (error) => {
                    console.log(error.message);
                }
            );
    };

    render() {
        if (this.state.getImage) {
            return (
                <SafeAreaView style={styles.container}>
                    {/* <Upload
                        newImage={(image) => {
                            this.newImage(image);
                        }}
                    /> */}
                    <AssetsSelector
                        options={{
                            manipulate: {
                                width: 512,
                                compress: 0.7,
                                base64: false,
                                saveTo: "jpeg",
                            },
                            assetsType: ["photo"],
                            maxSelections: 3,
                            margin: 3,
                            portraitCols: 4,
                            landscapeCols: 5,
                            widgetWidth: 100,
                            widgetBgColor: bgColor,
                            selectedBgColor: mainColor,
                            spinnerColor: mainColor,
                            videoIcon: {
                                Component: Ionicons,
                                iconName: "ios-videocam",
                                color: "white",
                                size: 20,
                            },
                            selectedIcon: {
                                Component: Ionicons,
                                iconName: "ios-checkmark-circle-outline",
                                color: "white",
                                bg: "white",
                                size: 20,
                            },
                            defaultTopNavigator: {
                                continueText: "Finish",
                                goBackText: "Back",
                                buttonStyle: validViewStyleObject,
                                textStyle: validTextStyleObject,
                                backFunction: goBack,
                                doneFunction: (data) => onDone(data),
                            },
                            noAssets: {
                                Component: CustomNoAssetsComponent,
                            },
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
                    </View>
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
});
