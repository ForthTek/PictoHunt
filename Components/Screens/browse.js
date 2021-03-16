import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Button,
  Alert,
  RefreshControl,
} from "react-native";
import Post from "../post";
import SinglePost from "../singlePost";

import Filter from "../API/Filter.js";

export default class Browse extends Component {
  constructor(props) {
    super(props);
    this.connection = props.connection;
  }

  // Browse Page
  state = {
    isLoading: true,
    isPost: false,
    singlePostID: "",
    DATA: "",
    refresh: false,
    filter: new Filter(),
  };

  componentDidMount() {
    // update filter using:
    // e.g. filter.orderBy = Filter.ORDER_BY_SCORE

    this.connection.getBrowse(this.state.filter).then((posts) => {
      this.setState({ DATA: posts });
      this.setState({ isLoading: false });
    });
  }

  getID = (id) => {
    let i = 0;
    for (; i < this.state.DATA.length; i++) {
      if (id == this.state.DATA[i].ID) {
        this.setState({ singlePostID: i });
      }
    }
    this.handleSinglePost();
  };

  handleSinglePost = () => {
    this.setState({ isPost: !this.state.isPost });
  };

  onRefresh = async () => {
    this.setState({ refresh: true, DATA: "" });
    await this.connection.getBrowse(this.state.filter).then(
      (res) => {
        this.setState({ DATA: res });
        this.setState({ refresh: false });
      },
      (error) => {
        Alert.alert(error.message);
        this.setState({ refresh: false });
      }
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
        </View>
      );
    }
    if (this.state.isPost) {
      return (
        <View style={styles.container}>
          <SinglePost
            item={this.state.DATA[this.state.singlePostID]}
            back={this.handleSinglePost}
            connection={this.connection}
          />
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.postCon}>
          {/* <Button title='Refresh' onPress={this.onRefresh} /> */}
          <FlatList
            data={this.state.DATA}
            extraData={this.state.didRefresh}
            renderItem={({ item }) => (
              <View style={styles.post}>
                <Post
                  item={item}
                  onpressable={this.getID}
                  connection={this.connection}
                />
              </View>
            )}
            keyExtractor={(item) => item.ID.toString()}
            onRefresh={this.onRefresh}
            refreshing={this.state.refresh}
          />
        </SafeAreaView>
      );
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
});
