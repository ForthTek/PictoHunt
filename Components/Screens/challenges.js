import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import ActivityRings from "react-activity-rings"

export default class challenges extends Component {
    constructor(props) {
        super(props);
        this.connection = props.connection;
    }

    state = {
        isLoading: true,
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
                        <ActivityRings data={activityData} config={activityConfig} /> 
                        <text>Daily Challenges</text>
                        <ActivityRings data={activityData} config={activityConfig} />
                    </view>
                </SafeAreaView>
            );
        }
    }
}

const progressRing = () => {
 
    const activityData = [ 
      { value: 0.8 }, 
    ];
    
    const activityConfig = { 
      width: 150,  
      height: 150
    };
}

const activityData = [
    {
      value: 0.8, // ring will use color from theme
    },
  ];

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

const activityConfig = {
    width: 150,
    height: 150,
    radius: 32,
    ringSize: 14,
  }