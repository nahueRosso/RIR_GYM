
import React from 'react';
import { View, Dimensions, StyleSheet, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationProp } from "@react-navigation/native";

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
            <TouchableOpacity
              onPress={() => navigation.navigate("Routines")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>EMPEZAR</Text>
            </TouchableOpacity>
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
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  svg:{
    position:'absolute',
    right:20,
    top:10,
    color:'#161618',
    marginLeft:10,
    fontWeight: 'bold',
  }, 
    buttonText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    fontSize: 17,
    height:40,
    color: '#161618',
    marginTop:15,
    // display:'flex',
    // justifyContent:'center',
    // alignItems:'center',
  },
});