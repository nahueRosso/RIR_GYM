import { NavBar, Button, Image } from "antd-mobile";
import { NavigationProp } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import React from "react";
import db from "../db.json";
import OptimizedImage from "../components/OptimizedImage";
import { Dimensions } from "react-native";
import Svg, { Polygon } from "react-native-svg";

const imageBk = require("../assets/fotoPortada.jpg");

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  console.log(
    "windowWidth: ",
    windowWidth,
    "windowHeight: ",
    windowHeight,
    "screenWidth: ",
    screenWidth,
    "screenHeight: ",
    screenHeight
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button
          color="primary"
          onClick={() => navigation.navigate("Routines")}
          style={styles.button}
        >
          Ir a las rutinas
        </Button>

        {/* <Button
          color="primary"
          onClick={() => navigation.navigate("CreateRoutine")}
          style={styles.button}
        >
          CreateRoutine
        </Button>

        <Button
          color="primary"
          onClick={() => navigation.navigate("DelateRoutine")}
          style={styles.button}
        >
          DelateRoutine
        </Button> */}

        <View style={styles.box}>
          <Image src={imageBk.uri} style={styles.image} />

          {/* <View style={styles.boxImage}></View> */}
          <View style={styles.boxOut}>
            <Svg
              height="100%"
              width={windowWidth}
              viewBox="0 0 100 100"
              style={{ position: "absolute" }}
            >
              <Polygon points="150,0 150,100 -50,100 -50,20" fill="black" />
              {/* <Polygon points="100,0 100,100 0,100 0,20" fill="black" /> */}
            </Svg>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: screenWidth,
    height: screenHeight,
    backfaceVisibility: "hidden",
  },
  content: {
    display:'flex',
    padding: 0,
    backfaceVisibility: "hidden",
    alignContent:'center',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  box: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "red",
    margin: 0,
    padding: 0,
    backfaceVisibility: "hidden",
  },
  image: {
    width: "100%",
    height: screenHeight * 0.75,
    position: "absolute",
    zIndex: 10,
    backfaceVisibility: "hidden",
    alignSelf: "center",
  },
  boxOut: {
    width: screenWidth,
    height: screenHeight * 0.4,
    // backgroundColor:'red',
    zIndex: 100,
    position: "absolute",
    bottom: 0,
  },
  userText: {
    marginBottom: 8,
  },
  button: {
    marginBottom: 20,
    zIndex: 100,
    position:'absolute',
    justifyContent:'space-between',
    alignItems:'center'
  },
});
