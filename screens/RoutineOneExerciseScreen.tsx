import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Alert } from "react-native";
import { NavBar, Button, Input } from "antd-mobile";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeleteOutline, RightOutline, LeftOutline, AddOutline } from "antd-mobile-icons";

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const RoutineOneExerciseScreen = ({
  navigation,
  route,
}: CreateDaysScreenProps) => {
  const { routineID, routineName, apis, dayID, routineNameFirst } =
    route.params;
  const [api, setApi] = useState(apis);
  const [main, setMain] = useState(() =>
    api.exercises.find((e: any) => e.id === routineID)
  );
  const [weights, setWeights] = useState<any>(main?.arrSetWeight || []);
  const [rirs, setRirs] = useState<any>(main?.arrSetRIR || []);
  const [index, setIndex] = useState(
    api.exercises.findIndex((e: any) => e.id === routineID)
  );
  const [isSaving, setIsSaving] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        if (storedData) {
          const routinesList = JSON.parse(storedData);
          const routine = routinesList.find(
            (r: any) => r.name === routineNameFirst
          );
          if (routine) {
            const day = routine.days.find((d: any) => d.id === dayID);
            if (day) {
              const exercise = day.exercises.find(
                (e: any) => e.id === main?.id
              );
              if (exercise) {
                setWeights(exercise.arrSetWeight || []);
                setRirs(exercise.arrSetRIR || []);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [main?.id]);

  // Guardar cambios en AsyncStorage
  const saveChanges = async () => {
    if (!main) return;
  
    setIsSaving(true);
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];
  
      const currentRoutine = routinesList.find(
        (r: any) => r.name === routineNameFirst
      );
      if (!currentRoutine) throw new Error("Rutina no encontrada");
  
      const currentDay = currentRoutine.days.find((d: any) => d.id === dayID);
      if (!currentDay) throw new Error("Día no encontrado");
  
      const exerciseIndex = currentDay.exercises.findIndex(
        (e: any) => e.id === main.id
      );
      if (exerciseIndex === -1) throw new Error("Ejercicio no encontrado");
  
      // Actualizar en AsyncStorage
      currentDay.exercises[exerciseIndex].arrSetWeight = [...weights];
      currentDay.exercises[exerciseIndex].arrSetRIR = [...rirs]; // Añadido para guardar RIR
      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
  
      // Actualizar en el estado local
      const updatedApi = { ...api };
      const localExerciseIndex = updatedApi.exercises.findIndex(
        (e: any) => e.id === main.id
      );
      if (localExerciseIndex !== -1) {
        updatedApi.exercises[localExerciseIndex].arrSetWeight = [...weights];
        updatedApi.exercises[localExerciseIndex].arrSetRIR = [...rirs]; // Añadido para actualizar estado local
        setApi(updatedApi);
      }
  
      console.log("Cambios guardados exitosamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWeightChange = (index: number, value: string) => {
    console.log(weights);
    console.log(index);
    const newWeights = [...weights];
    newWeights[index] = parseFloat(value) || 0;
    setWeights(newWeights);
  };
  
  const handlerirChange = (index: number, value: string) => {
    console.log(rirs);
    console.log(index);
    const newRir = [...rirs];
    newRir[index] = parseFloat(value) || 0;
    setRirs(newRir);
  };

  const getNextExercise = async () => {
    // Primero guardamos los cambios del ejercicio actual
    await saveChanges();

    // Luego navegamos al siguiente ejercicio
    setMain((prev: any) => {
      const currentIndex = api.exercises.findIndex(
        (e: any) => e.id === prev?.id
      );
      if (currentIndex === -1) return prev;
      const nextIndex = (currentIndex + 1) % api.exercises.length;
      setIndex(nextIndex);
      const nextExercise = api.exercises[nextIndex];
      setWeights(nextExercise.arrSetWeight || []);
      setRirs(nextExercise.arrSetRIR || []);
      return nextExercise;
    });
    console.log(main);
  };

  const getPreviousExercise = async () => {
    // Primero guardamos los cambios del ejercicio actual
    await saveChanges();

    // Luego navegamos al ejercicio anterior
    setMain((prev: any) => {
      const currentIndex = api.exercises.findIndex(
        (e: any) => e.id === prev?.id
      );
      if (currentIndex === -1) return prev;
      const prevIndex =
        (currentIndex - 1 + api.exercises.length) % api.exercises.length;
      setIndex(prevIndex);
      const prevExercise = api.exercises[prevIndex];
      setWeights(prevExercise.arrSetWeight || []);
      setRirs(prevExercise.arrSetRIR || []);
      return prevExercise;
    });
    console.log(main);
  };

  const handleGoBack = async () => {
    await saveChanges(); // Primero guarda los cambios
    navigation.goBack(); // Luego navega hacia atrás
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#161618" }}>
      <Text
        style={{
          color: "white",
          textTransform: "uppercase",
          fontSize: 25,
          fontFamily: "Cochin",
          textAlign: "center",
          marginTop: 20,
          marginBottom: 40,
          fontWeight: "light",
        }}
      >
        {main.name}
      </Text>

     <View>
     <View style={{ paddingLeft: 16, paddingRight: 16 }}>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "row",
            marginBottom: 5,
          }}
        >
          <View
            style={{
              width: 50,
              height: 30,
              backgroundColor: "#28282A",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 40,
            }}
          >
            <Text
              style={{ marginBottom: 5, color: "#aaa", borderRadius: "50px" }}
            >
              {api.exercises.findIndex((e: any) => e.id === main?.id) + 1} /{" "}
              {api.exercises.length}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Button
            onClick={getPreviousExercise}
            style={{
              "--background-color": "#28282A",
              "--border-color": "#28282A",
              "--border-radius": "50px",
              "--border-width": "5px",
            }}
            disabled={isSaving}
          >
            <LeftOutline style={{
              right: 12,
              top: 10,
              color: "#A1D70F",
              fontWeight: "bold",
            }}/>
          </Button>

          <Button
            style={{
              flex: 2,
              height: 200,
              backgroundColor: "#161618",
              borderStyle: "dashed",  // Cambiado de --border-style
              borderRadius: 25,       // Cambiado de 50px a número (en RN no usamos px)
              borderWidth: 3,         // Cambiado de --border-width
              borderColor: "#28282A", // Cambiado de --border-color
              marginLeft: 20,
              marginRight: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <AddOutline style={{color:"#aaaaaa"}}/>
            <Text style={{color:"#aaaaaa"}}>{'\n'}add image</Text>
          </Button>

          <Button
            onClick={getNextExercise}
            style={{
              "--background-color": "#28282A",
              "--border-color": "#28282A",
              "--border-radius": "50px",
              "--border-width": "5px",
            }}
            disabled={isSaving}
          >
            <LeftOutline style={{
              right: 12,
              top: 10,
              color: "#A1D70F",
              fontWeight: "bold",
            }}/>
          </Button>
        </View>
      </View>
      <Text
              style={{
                color: "white",
                fontSize: 15,
                marginBottom:8,
                marginTop:13,
                textAlign: "center",
                fontFamily: "Cochin",
                fontWeight: "light",
              }}
            >
              Series
            </Text>
      <View style={{ flex: 2, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >

          {weights.map((weight: any, idx: any) => (
            <View key={idx} style={{backgroundColor:'#161618',width:60,margin:5,borderColor:'#28282A',borderRadius: 50, // Cambiado de '50px' a 50
              borderWidth: 2,display:'flex',justifyContent:'center',alignItems:'center'}}>
              <Input
                key={idx}
                value={weight.toString()}
                // placeholder={weight.toString()}
                onChange={(text) => handleWeightChange(idx, text)}
                type="number"
                // color=''
                style={{
                  margin: 5,
                  width: 60,
                  "--color": "#aaa",
                  "--text-align": "center",
                }}
              />
            </View>
          ))}
        </View>
      </View>
     
      <Text
              style={{
                color: "white",
                fontSize: 15,
                marginBottom:8,
                marginTop:13,
                textAlign: "center",
                fontFamily: "Cochin",
                fontWeight: "light",
              }}
            >
              RIR
            </Text>
      <View style={{ flex: 2, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >

          {rirs.map((rir: any, idx: any) => (
            <View key={idx} style={{backgroundColor:'#161618',width:60,margin:5,borderColor:'#28282A',borderRadius: 50,
              borderWidth: 2,display:'flex',justifyContent:'center',alignItems:'center'}}>
              <Input
                key={idx}
                value={rir.toString()}
                // placeholder={weight.toString()}
                onChange={(text) => handlerirChange(idx, text)}
                type="number"
                // color=''
                style={{
                  margin: 5,
                  width: 60,
                  "--color": "#aaa",
                  "--text-align": "center",
                }}
              />
            </View>
          ))}
        </View>
      </View>
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
          onClick={handleGoBack}
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

export default RoutineOneExerciseScreen;
