import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavBar, Button } from "antd-mobile";
import { LeftOutline,  DeleteOutline, AddOutline } from "antd-mobile-icons";
import { NavigationProp } from "@react-navigation/native";

interface Routine {
  id: number;
  name: string;
  days: any;
}

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const RoutineExercisesScreen = ({
  navigation,
  route,
}: CreateDaysScreenProps) => {
  const { dayID, dayName, routineID, routineName } = route.params;

  console.log("routineName: ", routineName);

  const [routines, setRoutines] = useState<any | null>(null); // Estado inicial como `null`
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
  
        // Buscar la rutina correspondiente
        const foundRoutine = routinesList.find((item) => item.id === routineID);
        if (!foundRoutine) {
          console.warn("Rutina no encontrada.");
          return;
        }
  
        // Buscar el día correspondiente
        const foundDay = foundRoutine.days.find((day: any) => day.id === dayID);
        if (!foundDay) {
          console.warn("Día no encontrado.");
          return;
        }
  
        setRoutines(foundDay);
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // 1️⃣ Agregamos el listener para el evento 'focus'
    const unsubscribe = navigation.addListener('focus', fetchRoutines);
  
    // 2️⃣ Ejecutamos la carga inicial
    fetchRoutines();
  
    // 3️⃣ Limpiamos el listener al desmontar
    return unsubscribe;
  }, [routineID, dayID, navigation]); // ← Añadimos navigation a las dependencias

  const goAddExe = () => {
    navigation.navigate("CreateExercises", {
      dayID: dayID,
      dayName: dayName,
      routineName: routineName,
    });
  };

  // Si está cargando, mostrar spinner
  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

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
        EJERCICIOS
      </Text>
      {routines?.exercises?.length ? (
        routines.exercises.map((item: any, index: any) => (
<Button
              key={index}
              onClick={() =>
                navigation.navigate("RoutineOneExercise", {
                routineID: item.id,
                routineName: item.name,
                apis: routines,
                dayID: dayID,
                routineNameFirst: routineName,
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
                {item.name}
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

        ))
      ) : (
        <Text>No hay ejercicios disponibles</Text>
      )}

      {/* <Button onClick={goAddExe}>agregar mas ejercicios</Button> */}

      <Button
        onClick={goAddExe}
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
            ADD NEW{"\n"}EXERCISES
          </Text>
        </View>

        <View
          style={{
            position: "absolute",
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
          onClick={() => navigation.navigate("DelateRoutineExercises",{
            dayID:dayID,  
            dayName:dayName, 
            routineID:routineID, 
            routineName:routineName,
           
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

export default RoutineExercisesScreen;
