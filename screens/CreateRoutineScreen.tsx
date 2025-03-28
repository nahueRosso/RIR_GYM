import React, { useState, useEffect } from "react";
import { Text, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavBar, Button, Input, Dialog } from "antd-mobile";
import { NavigationProp } from "@react-navigation/native";
import { DeleteOutline, AddOutline, LeftOutline } from "antd-mobile-icons";


interface CreateRoutineScreenProps {
  navigation: NavigationProp<any>;
}

const CreateRoutineScreen = ({ navigation }: CreateRoutineScreenProps) => {
  const [routineName, setRoutineName] = useState("");
  const [routinesCount, setRoutinesCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadRoutinesCount = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routines = storedData ? JSON.parse(storedData) : [];
        setRoutinesCount(routines.length);
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };
    loadRoutinesCount();
  }, []);

  const saveRoutine = async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      let routines = storedData ? JSON.parse(storedData) : [];

      if (!Array.isArray(routines)) {
        console.error("Error: routines no es un array", routines);
        routines = [];
      }

      if (routines.length >= 7) {
        setVisible(true);
        Alert.alert("Error", "No puedes crear más de 7 rutinas.");
        return;
      }
      if (!routineName.trim()) {
        Alert.alert("Error", "El nombre de la rutina no puede estar vacío.");
        return;
      }

      const newRoutine = {
        id: Date.now().toString(),
        name: routineName,
      };

      const updatedRoutines = [...routines, newRoutine];

      await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
      setRoutinesCount(updatedRoutines.length);

      Alert.alert("Éxito", "Rutina guardada");
      setRoutineName("");
      navigation.navigate("CreateDays", { routineName });
    } catch (error) {
      console.error("Error al guardar rutina:", error);
      Alert.alert("Error", "Hubo un problema al guardar la rutina.");
    }
  };

  const goDelate = () => {
    navigation.navigate("DelateRoutine");
    setVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#161618" }}>
      <Text
        style={{
          color: "white",
          fontSize: 25,
          fontFamily: "Cochin",
          textAlign: "center",
          marginTop: 20,
          marginBottom: 40,
          fontWeight: "light",
        }}
      >
        AGREGAR RUTINA
      </Text>
      <View style={{ padding: 16 }}>
        <Input
          placeholder="Nombre de la rutina"
          value={routineName}
          onChange={setRoutineName}
          style={{ marginBottom: 16,margin: 20,marginLeft:38,'--color':'#ffffff',"--placeholder-color":'#888' }}
        />

        <Button
          onClick={saveRoutine}
          style={{
            fontFamily: "Cochin",
            fontWeight: "lighter",
            fontSize: 17,
            color: "#ffffff",
            borderColor: "#28282A",
            backgroundColor: "#28282A",
            textTransform: "capitalize",
            margin: 10,
            width: "80%",
            maxWidth: 300,
            borderStyle: "solid",
            borderRadius: 10,
            alignSelf: "center",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 17,
              margin: 3,
              fontFamily: "Cochin",
              textAlign: "center",
              fontWeight: "light",
            }}
          >
            Guardar rutina
          </Text>

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
            <Text
              style={{
                color: "blanco",
                fontSize: 15,
                marginLeft: 30,
                fontFamily: "Cochin",
                textAlign: "right",
                fontWeight: "light",
              }}
            >
              {/* {day.name.slice(0, 3)} */}
            </Text>
          </View>

          <View
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              right: -60,
              bottom: -20,
              borderRadius: 10,
              backgroundColor: "#BCFD0E",
              transform: [{ rotate: "25deg" }],
            }}
          />
        </Button>


        {/* Dialog reemplaza el Portal/Dialog de Paper */}
        <Dialog
          visible={visible && routinesCount >= 7}
          content={
            <View>
              <Text>¡Llegaste al máximo de rutinas (7)!</Text>
            </View>
          }
          actions={[
            {
              key: "delete",
              text: "DelateRoutine",
              onClick: () => {
                navigation.navigate("DelateRoutine");
                setVisible(false);
              },
            },
          ]}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 80,
          left: 40,
          display: "flex",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          color="success"
          style={{
            fontSize: 17,
            color: "#161618",
            borderColor: "#A1D70F",
            backgroundColor: "#BCFD0E",
            width: 40,
            height: 40,
            maxWidth: 300,
            borderStyle: "solid",
            borderRadius: 30,
          }}
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
    </View>
  );
};

export default CreateRoutineScreen;
