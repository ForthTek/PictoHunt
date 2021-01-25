import React from "react";
import { Text, View, StyleSheet } from "react-native";

const ScoreComp = (props) => {

  let word;

  if(props.numberdiff > 0){
    word = 'ahead';
  } else {
    word = 'behind';
  }

    return (

      <View style={styles.text}>
        <Text style={{fontSize: 26,}}>
          {props.label1}   {props.othernumber}
        </Text>
        <Text style={{fontSize: 18,}}>
          ({props.numberdiff} {props.label2} {word} of you, {props.usernumber})
        </Text>
      </View>

    );
};
export default ScoreComp;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "2%",
        alignItems: "center",
    },
    text: {
      paddingBottom: "5%",
      paddingLeft: "3%",
    },
});
