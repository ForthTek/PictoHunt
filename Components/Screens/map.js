// Imports all the stuff needed
import React, { Component } from "react";
import {
    Text,
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Alert,
    Modal,
    Pressable,
    FlatList,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicon from "react-native-vector-icons/Ionicons";
import { PROVIDER_GOOGLE } from "react-native-maps";
import SinglePost from "../singlePost";
import { CheckBox } from "react-native-elements";
import { SearchBar } from "react-native-elements";
import SearchItem from "../searchItem";

// NOTE: internal commentary dosn't have spell check, sorry

export default class Map extends Component {
    // Constructor that inits some variables
    constructor(props) {
        super(props);
        // Inits the state object
        this.state = {
            // Inits the users coords to default 0, 0 and as zoomed out as possible
            latitude: 0,
            longitude: 0,
            latitudeDelta: 200,
            longitudeDelta: 200,
            // The location has not been set so this defaults to false
            locationset: false,
            // Empty set for the map markers to be put in
            MarkerArray: [],
            // The current post being displayed as a single post
            singlePostOpen: false,
            currentSinglePost: [],
            refresh: false,

            filterOpen: false,
            filteringScore: false,
            filterPositive: false,
            filter5: false,
            filter10: false,
            filter20: false,
            filterNo: -1,

            search: "",
            searching: false,
            userDATA:[],
            filteringUser: false,
            filteredUser: "",
        };

        this.connection = props.connection;
    }

    opensinglepost = (id) => {
        this.setState({ singlePostOpen: true, currentSinglePost: id });
    };

    closesinglepost = () => {
        this.setState({ singlePostOpen: false, currentSinglePost: [] });
        this.onRefresh();
    };

    openFilterModal = () => {
        this.setState({ filterOpen: true });
    };

    closeFilterModal = () => {
        this.setState({ filterOpen: false });
        this.onRefresh();
    };

    onLikeBtnPress = (type, id, updateScore) => {
        if (type === "like") {
            this.connection.likePost(id).then(
                () => {
                    updateScore(id);
                },
                (error) => {
                    Alert.alert(error.message);
                }
            );
        }
        if (type === "dislike") {
            this.connection
                .dislikePost(id)
                .then(
                    () => {
                        updateScore(id);
                    },
                    (error) => {
                        Alert.alert(error.message);
                    }
                )
                .catch((error) => {
                    Alert.alert(error.message);
                });
        }
        if (type === "remove") {
            this.connection.removeInteractionFromPost(id).then(
                () => {
                    updateScore(id);
                },
                (error) => {
                    Alert.alert(error.message);
                }
            );
        }
    };

    async componentDidMount() {
        try {
            // Asks the user for permission
            let { status } = await Location.requestPermissionsAsync();
            // If permission is not given an alert is given
            if (status !== "granted") {
                console.log("Location Premission Not Granted!");
                this.setState({ locationset: true });
                Alert.alert(
                    "Location Premission Not Granted!",
                    "To have this screen default to your location please enable location services for this app."
                );
                return;
            }

            // Gets the last known location of the user
            let location = await Location.getLastKnownPositionAsync();
            //console.log({ location });
            // Saves it in the state varable
            if (location == null) {
                Alert.alert("'user location = null' error!");
                this.setState({ locationset: true });
            } else if (location.coords == null) {
                Alert.alert("'user coords = null' error!");
                this.setState({ locationset: true });
            } else if (
                location.coords.latitude == null ||
                location.coords.longitude == null
            ) {
                Alert.alert("'user latitude or longitude = null' error!");
                this.setState({ locationset: true });
            } else {
                this.setState({ latitude: location.coords.latitude });
                this.setState({ longitude: location.coords.longitude });
                this.setState({ latitudeDelta: 0.2 });
                this.setState({ longitudeDelta: 0.2 });
                this.setState({ locationset: true });
            }
            // If an error occurs, such as the emulator not have a location set it is caught and an alert is made.
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error reading location!",
                "If using an Emulator please ensure a location is selected in the emulator options."
            );
            this.setState({ locationset: true });
        }

        // Gets the array of markers with locations
        // Converts to json
        // Puts in the state variable MarkerArray
        // Catches any arror with the marker obtaining and makes an alert
        this.onRefresh();
    }

    onRefresh = () => {
        // Please use a Filter object here as a parameter
        // use these as the options:
        // .postsByMe 
        // .postsByUser + .username
        // .positiveScore
        // could also use .followedUsers and .followedChannels but you'll need to tell
        // me so I can implement that

        this.connection
            .getMap()
            .then((response) => {
                this.setState({ MarkerArray: response });
            })
            .catch((error) => {
                Alert.alert(
                    "Error loading pictures!",
                    "Could not load the markers from the server."
                );
                console.log("Error loading pictures!");
            });
    };

    onChangeSearch = (search) => {
        this.setState({
            search: search,
            searching: true,
        });
        if (search == "") {
            this.setState({ searching: false });
        }

        this.setState({
            userDATA: this.connection.searchUsers(search),
        });
    };

    render() {
        // Unexplained thing, possibly due to the async being used above the app would ignore the componentDidMount() at first,
        // it would be run later but this would result in the map being generated with defualt values, this stops it by not allowing the map to be
        // genereated untill the users location has been atempted to be obtained, thats why this.state.locationset is used

        // Generates the map using the user location as its inital region, then a function adds all the markers from the MarkerArray
        if (this.state.locationset == true) {
            return (
                <SafeAreaView style={styles.container}>
                  <View style={{ zIndex: 1000, alignSelf: "flex-end" }}>
                      <Pressable onPress={() => this.onRefresh()}>
                          <Ionicon
                              name='refresh-circle-outline'
                              style={{ fontSize: 32 }}
                          />
                      </Pressable>
                  </View>
                    <View style={{ zIndex: 1000, alignSelf: "flex-end" }}>
                        <Pressable onPress={this.openFilterModal}>
                            <FeatherIcon name='sliders' style={{ fontSize: 30 }} />
                        </Pressable>
                    </View>

                    <Modal
                        visible={this.state.singlePostOpen}
                        animationType='slide'
                        transparent={true}
                    >
                        <View style={styles.center}>
                            <View style={styles.modalView}>
                                <SinglePost
                                    item={this.state.currentSinglePost}
                                    back={this.closesinglepost}
                                    connection={this.connection}
                                    onLikeBtnPress={this.onLikeBtnPress}
                                />
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={this.state.filterOpen}
                        animationType='slide'
                        transparent={true}
                    >
                        <View style={styles.center}>
                            <View style={styles.modalView}>
                                <Pressable
                                    onPress={this.closeFilterModal}
                                >
                                    <FeatherIcon
                                        name='x-circle'
                                        style={styles.icon1}
                                    />
                                </Pressable>
                                <View style={styles.container1}>
                                    <CheckBox
                                        title='Show only Postitve Score Posts'
                                        iconType='material'
                                        checkedIcon='clear'
                                        uncheckedIcon='add'
                                        onPress={() =>
                                            {if(this.state.filterPositive == false){
                                              this.setState({
                                                  filterPositive: true,
                                                  filter5: false,
                                                  filter10: false,
                                                  filter20: false,
                                                  filterNo: 0,
                                                  filteringScore: true,
                                              })
                                            } else if (this.state.filterPositive == true) {
                                              this.setState({
                                                  filterPositive: false,
                                                  filterNo: -1,
                                                  filteringScore: false,
                                              })
                                            }
                                        }
                                      }
                                      checked={this.state.filterPositive}
                                    />
                                </View>
                                <View style={styles.container1}>
                                    <CheckBox
                                        title='Show only Posts with Score > 5'
                                        iconType='material'
                                        checkedIcon='clear'
                                        uncheckedIcon='add'
                                        onPress={() =>
                                            {if(this.state.filter5 == false){
                                              this.setState({
                                                  filterPositive: false,
                                                  filter5: true,
                                                  filter10: false,
                                                  filter20: false,
                                                  filterNo: 5,
                                                  filteringScore: true,
                                              })
                                            } else {
                                              this.setState({
                                                  filter5: false,
                                                  filterNo: -1,
                                                  filteringScore: false,
                                              })
                                            }
                                        }
                                      }
                                      checked={this.state.filter5}
                                    />
                                </View>
                                <View style={styles.container1}>
                                    <CheckBox
                                        title='Show only Posts with Score > 10'
                                        iconType='material'
                                        checkedIcon='clear'
                                        uncheckedIcon='add'
                                        onPress={() =>
                                            {if(this.state.filter10 == false){
                                              this.setState({
                                                  filterPositive: false,
                                                  filter5: false,
                                                  filter10: true,
                                                  filter20: false,
                                                  filterNo: 10,
                                                  filteringScore: true,
                                              })
                                            } else {
                                              this.setState({
                                                  filter10: false,
                                                  filterNo: -1,
                                                  filteringScore: false,
                                              })
                                            }
                                        }
                                      }
                                      checked={this.state.filter10}
                                    />
                                </View>
                                <View style={styles.container1}>
                                    <CheckBox
                                        title='Show only Posts with Score > 20'
                                        iconType='material'
                                        checkedIcon='clear'
                                        uncheckedIcon='add'
                                        onPress={() =>
                                            {if(this.state.filter20 == false){
                                              this.setState({
                                                  filterPositive: false,
                                                  filter5: false,
                                                  filter10: false,
                                                  filter20: true,
                                                  filterNo: 20,
                                                  filteringScore: true,
                                              })
                                            } else {
                                              this.setState({
                                                  filter20: false,
                                                  filterNo: -1,
                                                  filteringScore: false,
                                              })
                                            }
                                        }
                                      }
                                      checked={this.state.filter20}
                                    />
                                </View>
                                <Text>Only showing posts by: {this.state.filteredUser}</Text>
                                <Pressable onPress={() => {this.setState({filteredUser: "", filteringUser: false})}}>
                                  <Text>Clear User Filter</Text>
                                </Pressable>
                                <SearchBar
                                    containerStyle={styles.searchCon}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    value={this.state.search}
                                    onChangeText={(text) => this.onChangeSearch(text)}
                                    placeholder='Search...'
                                    round
                                />
                                {this.state.searching && this.state.search != "" && (
                                    <View style={styles.dropDown}>
                                      <Text style={styles.ddText}> ------Users------ </Text>
                                        <FlatList
                                            data={this.state.userDATA}
                                            renderItem={({ item }) => (
                                                <Pressable onPress={() => {this.setState({filteredUser: item, filteringUser: true})}}>
                                                  <Text style={styles.ddText}>
                                                    { item }
                                                  </Text>
                                                </Pressable>
                                            )}
                                            keyExtractor={(item) => item}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    </Modal>

                    <MapView
                        style={StyleSheet.absoluteFillObject}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: this.state.latitudeDelta,
                            longitudeDelta: this.state.longitudeDelta,
                        }}
                        mapType='standard'
                    >
                        {this.state.MarkerArray.map((m) => {
                            //console.log(m); // for testing, prints all posts
                            if(this.state.filteringScore == false || m.score > this.state.filterNo){
                              if(this.state.filteringUser == false || m.user == this.state.filteredUser){

                                return (
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: m.GPS.latitude,
                                            longitude: m.GPS.longitude,
                                        }}
                                        key={m.ID}
                                        onPress={() => this.opensinglepost(m)}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "column",
                                                flex: 1,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Image
                                                source={{ uri: m.photos[0] }}
                                                style={{ width: 80, height: 80 }}
                                            />
                                            <Text
                                                style={{
                                                    backgroundColor: "#fff",
                                                    fontSize: 11,
                                                }}
                                            >
                                                {" "}
                                                {m.title}{" "}
                                            </Text>
                                            <Text
                                                style={{
                                                    backgroundColor: "#fff",
                                                    fontSize: 8,
                                                }}
                                            >
                                                {" "}
                                                {m.photos.length} post(s){" "}
                                            </Text>
                                        </View>
                                    </MapView.Marker>
                                );
                            }
                          }
                      }
                    )
                  }
                    </MapView>
                </SafeAreaView>
            );
        } else {
            // In case the program hasnt attempted to get the user location
            return (
                <SafeAreaView>
                    <Text>Loading Map...</Text>
                </SafeAreaView>
            );
        }
    }
}
// css style stuff
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    modalView: {
        margin: 5,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
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
        fontSize: 32,
        paddingBottom: "5%",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    searchCon: {
        width: "85%",
        backgroundColor: "white",
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    inputContainerStyle: {
        height: "5%",
        paddingBottom: "1%",
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
});
