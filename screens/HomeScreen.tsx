// import { NavBar, Button, Image } from "antd-mobile";
// import { NavigationProp } from "@react-navigation/native";
// import { View, Text, StyleSheet, Dimensions, ImageBackground } from "react-native";
// import React from "react";
// import db from "../db.json";
// import OptimizedImage from "../components/OptimizedImage";
// import Svg, { Polygon } from "react-native-svg";

// const imageBk = require("../assets/fotoPortada_full.jpg");

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;
// const screenWidth = Dimensions.get("screen").width;
// const screenHeight = Dimensions.get("screen").height;

// interface HomeScreenProps {
//   navigation: NavigationProp<any>;
// }

// export default function HomeScreen({ navigation }: HomeScreenProps) {
//   console.log(
//     "windowWidth: ",
//     windowWidth,
//     "windowHeight: ",
//     windowHeight,
//     "screenWidth: ",
//     screenWidth,
//     "screenHeight: ",
//     screenHeight
//   );

//   return (
//     <ImageBackground 
//       source={imageBk} 
//       style={styles.backgroundImage}
//       resizeMode="cover"
      
//     >
//       <View style={styles.container}>
//         <View style={styles.content}>
//           <Button
//             color="primary"
//             onClick={() => navigation.navigate("Routines")}
//             style={styles.button}
//           >
//             Ir a las rutinas
//           </Button>

         
//         </View>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   container: {
//     flex: 1,
//     width: screenWidth,
//     height: screenHeight,
//   },
//   content: {
//     display:'flex',
//     padding: 0,
//     backfaceVisibility: "hidden",
//     alignContent:'center',
//     alignItems:'center',
//     justifyContent:'flex-end'
//   },
//   box: {
//     width: screenWidth,
//     height: screenHeight,
//     margin: 0,
//     padding: 0,
//     backfaceVisibility: "hidden",
//   },
//   boxOut: {
//     width: screenWidth,
//     height: screenHeight * 0.4,
//     zIndex: 100,
//     position: "absolute",
//     bottom: 0,
//   },
//   button: {
//     marginBottom: 20,
//     zIndex: 100,
//     position:'absolute',
//     justifyContent:'space-between',
//     alignItems:'center'
//   },
// });

import React from 'react';
import {View, Dimensions, StyleSheet, Text, ImageBackground } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { NavBar, Button, Image } from "antd-mobile";
import { NavigationProp } from "@react-navigation/native";
import {RightOutline } from "antd-mobile-icons"

const imageBk = require("../assets/fotoPortada_full.jpg");

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ImageBackground 
          source={imageBk} 
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.textContainer}>
          <Text style={styles.textH2}>CREATE A WORKOUT PLAN</Text>
          <Text style={styles.textH1}>TO STAY FIT</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              // color="danger"
              onClick={() => navigation.navigate("Routines")}
              style={styles.button}
            >
              {`EMPEZAR  `}
              <RightOutline style={styles.svg}/>
            </Button>
          </View>

        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  textContainer:{
    position: 'absolute',
    bottom: 180, // Ajusta este valor según necesites
    left: 0,
    right: 0,
    alignItems: 'center', // Centra horizontalmente
  },
  textH1: {
    color: 'white',
    fontSize: 25,
    fontFamily:'Cochin',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textH2: {
    color: 'white',
    fontSize: 25,
    fontFamily:'Cochin',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80, 
    left: 0,
    right: 0,
    display:'flex',
    alignContent:'center',
    alignItems: 'center', 
  },
  button: {
    fontFamily:'Cochin',
    fontWeight: 'bold',
    fontSize: 17,
    color:'#161618',
    borderColor:'#A1D70F',
    backgroundColor:'#BCFD0E',
    width: '80%',
    maxWidth: 300,
    borderStyle:'solid',
    borderRadius:30,
  },
  svg:{
    position:'absolute',
    right:20,
    top:10,
    color:'#161618',
    marginLeft:10,
    fontWeight: 'bold',
  },
});