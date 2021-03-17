import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import ProgressChart from "react-native-chart-kit";

export default class challenges extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    state = {
        isLoading: false,
        DATA: "",
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
                </View>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <view>
                        <text>Weekly Challenge</text>
                        <View style={{flexDirection:"row"}}>
                            <View style={{flex:1}}>
                                <text style={{justifyContent: 'flex-start,'}}>Photograph and post a cat dog and bird</text>
                            </View>
                            <View style={{flex:1}}>
                                <ProgressChart
                                    data={data}
                                    width={100}
                                    height={220}
                                    strokeWidth={16}
                                    radius={32}
                                    chartConfig={chartConfig}
                                    hideLegend={false}
                                    style={{justifyContent: 'flex-end,'}}
                                />
                            </View>
                        </View> 
                        <text>Daily Challenges</text>
                        <View style={{flexDirection:"row"}}>
                            <View style={{flex:2}}>
                                <text style={{justifyContent: 'flex-start,'}}>Photograph and post a dog</text>
                            </View>
                            <View style={{flex:2}}> 
                                <ProgressChart
                                    data={data}
                                    width={100}
                                    height={220}
                                    strokeWidth={16}
                                    radius={32}
                                    chartConfig={chartConfig}
                                    hideLegend={false}
                                    style={{justifyContent: 'flex-end,'}}
                                />
                            </View>
                        </View> 
                    </view>
                </SafeAreaView>
            );
        }
    }
}

const data = {
    labels: ["Cat", "Dog", "Bird"], // optional
    data: [0.4, 0.6, 0.8]
  };
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
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});