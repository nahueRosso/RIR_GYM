import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavBar, Button } from "antd-mobile";
import { NavigationProp } from "@react-navigation/native";
import { DeleteOutline, AddOutline, LeftOutline } from "antd-mobile-icons";

interface DaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Routine {
  id: number;
  name: string;
  days: any;
}

const RoutineScreen = ({ navigation, route }: DaysScreenProps) => {
  const [routines, setRoutines] = useState<Routine[]>([]); // ⬅ Define el tipo
  const { routineID, routineName } = route.params;

  console.log("routineName: ", routineName);

  // const [routineName, setRoutineName] = useState('');
  // const [routinesCount, setRoutinesCount] = useState(0); // Estado para contar las rutinas
  //  const [visible, setVisible] = useState<boolean>(true);
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

    // 1️⃣ Agregar el listener para el evento 'focus'
    const unsubscribe = navigation.addListener("focus", fetchRoutines);

    // 2️⃣ Ejecutar la carga inicial
    fetchRoutines();

    // 3️⃣ Limpiar el listener al desmontar
    return unsubscribe;
  }, [navigation]); // ⬅️ Asegúrate de incluir navigation en las dependencias

  const goAddDays = async () => {
    navigation.navigate("CreateDays", { routineName: routineName });
  };

  console.log(routines);

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
        AGREGAR DIAS
      </Text>

      {routines
        .filter((item) => item.id === routineID) // Filtra solo la rutina actual
        .map((item) =>
          Object.values(item.days).map((day: any, index) => (
            <Button
              key={index}
              onClick={() =>
                navigation.navigate("RoutineExercises", {
                  dayID: day.id,
                  dayName: day.name,
                  routineID: routineID,
                  routineName: routineName,
                })
              }
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
                {day.priorityExercises[0]}{" "}
                {day.priorityExercises[1]
                  ? `- ${day.priorityExercises[1]}`
                  : ""}
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
                  {day.name.slice(0, 3)}
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
          ))
        )}

      <Button
        onClick={goAddDays}
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
          borderRadius: 10,
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
          <Text
            style={{
              color: "white",
              fontSize: 20,
              margin: 3,
              fontFamily: "Cochin",
              textAlign: "center",
              fontWeight: "light",

              lineHeight: 30,
            }}
          >
            ADD NEW{"\n"}DAYS
          </Text>
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
              fontSize: 40, // Tamaño del icono (puedes ajustar este valor)
              // Las siguientes propiedades eliminan cualquier borde:
              borderWidth: 0,
              color: "#28282A",
              borderColor: "#28282A",
            }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            width: 150,
            height: 120,
            right: -60,
            bottom: 0,
            borderRadius: 10,
            backgroundColor: "#BCFD0E",
            transform: [{ rotate: "30deg" }],
          }}
        />
      </Button>

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
      <View
        style={{
          position: "absolute",
          bottom: 80,
          right: 40,
          display: "flex",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            fontSize: 17,
            color: "#161618",
            borderColor: "#A90000",
            backgroundColor: "#C70000",
            width: 40,
            height: 40,
            maxWidth: 300,
            borderStyle: "solid",
            borderRadius: 30,
          }}
          onClick={() => navigation.navigate("DelateRoutineDay",{
            routineID: routineID,
            routineName:  routineName,
          })}
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

export default RoutineScreen;
