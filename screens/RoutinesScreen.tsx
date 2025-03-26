import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavBar, Button } from "antd-mobile";
import { IconOutline } from "@ant-design/icons-react-native";
import { NavigationProp } from "@react-navigation/native";
import { AddOutline, AntOutline } from "antd-mobile-icons";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
// import { NavBar, Button, Image } from "antd-mobile";
// import { NavigationProp } from "@react-navigation/native";
import { DeleteOutline, LeftOutline } from "antd-mobile-icons";
{
  /* <DeleteOutline /> */
}

interface RoutinesScreenProps {
  navigation: NavigationProp<any>;
}

interface Routine {
  id: number;
  name: string;
}

const RoutineScreen = ({ navigation }: RoutinesScreenProps) => {
  const [routines, setRoutines] = useState<Routine[]>([]); // ⬅ Define el tipo

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList: Routine[] = storedData
          ? JSON.parse(storedData)
          : [];
        setRoutines(routinesList);
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };

    fetchRoutines();
  }, []);

  console.log(routines);
  console.log(routines[routines.length - 1]);

  return (
    <View style={styles.container}>
      <Text style={styles.textH2}>MIS RUTINAS</Text>

      {routines.map((item: any, index: any) => {
        return (
          <Button
            key={index}
            onClick={() =>
              navigation.navigate("RoutinesDay", {
                routineID: item.id,
                routineName: item.name,
              })
            }
            style={{
              fontFamily: "Cochin",
              fontWeight: "lighter",
              fontSize: 17,
              color: "#ffffff",
              borderColor: "#28282A",
              backgroundColor: "#28282A",
              textTransform: "uppercase",
              margin: 10,
              width: "80%", // Usar porcentaje para mejor responsividad
              maxWidth: 300,
              borderStyle: "solid",
              borderRadius: 30,
              alignSelf: "center", // Centrar cada botón individualmente
            }}
          >
            {item.name}
          </Button>
        );
      })}
      <Button
        color="success"
        onClick={() => navigation.navigate("CreateRoutine")}
        style={{
          fontFamily: "Cochin",
          fontWeight: "lighter",
          fontSize: 17,
          color: "white", // Hace el texto transparente
          borderColor: "#28282A",
          backgroundColor: "#28282A",
          textTransform: "uppercase",
          marginTop: 10,
          width: "80%",
          height: 100,
          maxWidth: 300,
          borderStyle: "solid",
          borderRadius: 30,
          alignSelf: "center",
          overflow: "hidden", // Importante para contener el View absoluto
          position: "relative",
          display: "flex",
        }}
      >
        <View
          style={{
            position: "absolute",
            // backgroundColor: "red",
            top: 0,
            left: 0,
            zIndex: 100,
            width: "70%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.textP}>CREATE NEW</Text>
          <Text style={styles.textP}>ROUTINE</Text>
        </View>

        <View
          style={{
            position: "absolute",
            // backgroundColor: "yellow",
            top: 0,
            right: 0,
            zIndex: 100,
            height: "100%",
            width: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AddOutline
            style={{
              fontSize: 24, // Tamaño del icono (puedes ajustar este valor)
              color: "#000", // Color negro
              // Las siguientes propiedades eliminan cualquier borde:
              borderWidth: 0,
              borderColor: "transparent",
            }}
          />
        </View>
        {/* <Text style={{ opacity: 0 }}>CreateRoutine</Text> */}

        <View
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            right: -15,
            bottom: 0,
            borderRadius: 10,
            backgroundColor: "#BCFD0E",
            transform: [{ rotate: "35deg" }],
          }}
        />
      </Button>

      <View style={styles.buttonBackContainer}>
        <Button
          color="success"
          style={styles.buttonBack}
          onClick={() => navigation.goBack()}
          // style={styles.button}
        >
          <LeftOutline
            style={{
              position: "absolute",
              right: 12,
              top: 10,
              color: "#161618",
              fontWeight: "bold",
            }}
          />
        </Button>
      </View>

      <View style={styles.buttonDeleteContainer}>
        <Button
          color="success"
          style={styles.buttonDelete}
          onClick={() => navigation.navigate("DelateRoutine")}
          // style={styles.button}
        >
          <DeleteOutline
            style={{
              position: "absolute",
              right: 11,
              top: 10,
              color: "#161618",
              fontWeight: "bold",
            }}
          />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
  },
  // textH1: {
  //   color: "white",
  //   fontSize: 25,
  //   fontFamily: "Cochin",
  //   // lineHeight: 84,
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   backgroundColor: "#000000c0",
  // },
  textP: {
    color: "white",
    fontSize: 20,
    margin: 3,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "light",
  },
  textH2: {
    color: "white",
    fontSize: 25,
    fontFamily: "Cochin",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
    fontWeight: "light",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  button: {
    fontFamily: "Cochin",
    fontWeight: "bold",
    fontSize: 17,
    color: "#161618",
    borderColor: "#A1D70F",
    backgroundColor: "#BCFD0E",
    width: "80%",
    maxWidth: 300,
    borderStyle: "solid",
    borderRadius: 30,
  },
  buttonBackContainer: {
    position: "absolute",
    bottom: 80,
    left: 40,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  buttonBack: {
    fontSize: 17,
    color: "#161618",
    borderColor: "#A1D70F",
    backgroundColor: "#BCFD0E",
    width: 40,
    height: 40,
    maxWidth: 300,
    borderStyle: "solid",
    borderRadius: 30,
  },
  buttonDeleteContainer: {
    position: "absolute",
    bottom: 80,
    right: 40,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  buttonDelete: {
    fontSize: 17,
    color: "#161618",
    borderColor: "#A90000",
    backgroundColor: "#C70000",
    width: 40,
    height: 40,
    maxWidth: 300,
    borderStyle: "solid",
    borderRadius: 30,
  },
});

export default RoutineScreen;
