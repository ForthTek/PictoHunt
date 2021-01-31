import React from "react";
import { Text, View, SafeAreaView, StyleSheet, TextInput, Button} from "react-native";
import Image from "react-native-scalable-image";
import Score from "./score";
export default function Home() {
    

   

    var Pictohunt = "Pictohunt"
    var byforthtek = "By ForthTek"
    var signUp = "Sign Up"
    var email = "Email:"
    var username = "Username:"
    var password = "Password:"
    var cPassword = "Confirm Password:"
    var [value, onChangeText] = React.useState("");
    var [value2, onChangeText] = React.useState("");
    var tc = "I have read and agreed to the terms of service";
    var r = "I have read and agreed to the rules";
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", margin: "0%", marginLeft: "30%"}}>
                
                
            </View>
            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
            </View>

             <Text style={styles.Pictohunt}>{Pictohunt}</Text>
             <Text style={styles.byforthtek}>{byforthtek}</Text>
             <Text style={styles.signUp}>{signUp}</Text>
             
            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                
                    <Text style={styles.email}>{email}</Text>
                    
                    <TextInput 
                    style={styles.input}
                    onChangeText={(text) => onChangeText(text)}
                    value={value}
                     />

                     </View>

             <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                
                    <Text style={styles.username}>{username}</Text>
                    
                    <TextInput 
                    style={styles.input2}
                    onChangeText={(text) => onChangeText(text)}
                    value={value}
                     />

                     </View>

             <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                
                    <Text style={styles.password}>{password}</Text>
                    
                    <TextInput 
                    style={styles.input3}
                    onChangeText={(text) => onChangeText(text)}
                    value={value}
                     />

                     </View>
                     
                    
            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                
                    <Text style={styles.cPassword}>{cPassword}</Text>
                    
                    <TextInput 
                    style={styles.input4}
                    onChangeText={(text) => onChangeText(text)}
                    value={value}
                     />

                     </View>

                     <Text style={styles.tc}>{tc}</Text>
                     <Text style={styles.r}>{r}</Text>
            
                    <Button
                    style={styles.button}

                    onPress={() => this._handlePress()}
                    title="Sign Up"
                    >
                    </Button>

                    

                    <View
                style={{
                    flexDirection: "row",
                    paddingBottom: "5%",
                    justifyContent: "space-between",
                }}
            >
                
        

                </View>


            
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "1%",
    },
    Pictohunt: {
        fontSize: 35,
        paddingBottom: "2%",
        paddingLeft:"30%",

    },
    byforthtek: {
        fontSize: 18,
        paddingBottom: "5%",
        paddingLeft:"36.5%",
    },

    signUp: {
        fontSize: 30,
        paddingBottom: "5%",
        paddingLeft:"1%",
        paddingTop:"10%",
    },
    input: {
        height:45,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: "5%",
        width: "55%",
        fontSize: 20,
        color: "gray",
    },
    input2: {
        height:45,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: "5%",
        width: "55%",
        fontSize: 20,
        color: "gray",
    },
     input3: {
        height:45,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: "5%",
        width: "55%",
        fontSize: 20,
        color: "gray",
    },
     input4: {
        height:45,
        borderColor: "gray",
        borderWidth: 1,
        marginRight: "0%",
        width: "55%",
        fontSize: 20,
        color: "gray",
    },
    email: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight:"30%",
        paddingTop:"0%",

    },
    username: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight:"19.5%",
        paddingTop:"0%",

    },
    password: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight:"19.5%",
        paddingTop:"0%",

    },
    cPassword: {
        fontSize: 20,
        paddingBottom: "10%",
        paddingRight:"1%",
        paddingTop:"0%",

    },
    button: {
        fontSize: 18,
        paddingTop: "5%",
        color:"red",

    },
    tc: {
        fontSize: 15,
        color: "black",
        paddingBottom: "1%",
        paddingLeft:"10%",
        paddingTop:"1%",
        textDecorationLine:"underline",
    },
    r: {
        fontSize: 15,
        color: "black",
        paddingBottom: "11%",
        paddingLeft:"20%",
        paddingTop:"1%",
        textDecorationLine:"underline",
    },
  
});

