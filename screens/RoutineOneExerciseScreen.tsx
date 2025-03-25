import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const RoutineOneExerciseScreen = ({
  navigation,
  route,
}: CreateDaysScreenProps) => {
  const { routineID, routineName, api, dayID,routineNameFirst } = route.params;

  console.log(routineNameFirst)

  const [main, setMain] = useState(() =>
    api.exercises.find((e: any) => e.id === routineID)
  );

  const [weights, setWeights] = useState<any>(main?.arrSetWeight || []);

  useEffect(() => {
    setWeights(main?.arrSetWeight || []);
  }, [main]); // Se actualiza cuando cambia de ejercicio

  const getNextExercise = () => {
    setMain((prev: any) => {
      const index = api.exercises.findIndex((e: any) => e.id === prev?.id);
      if (index === -1) return prev;
      const nextIndex = (index + 1) % api.exercises.length;
      return api.exercises[nextIndex];
    });
  };

  const getPreviousExercise = () => {
    setMain((prev: any) => {
      const index = api.exercises.findIndex((e: any) => e.id === prev?.id);
      if (index === -1) return prev;
      const prevIndex = (index - 1 + api.exercises.length) % api.exercises.length;
      return api.exercises[prevIndex];
    });
  };
 
  const handleWeightChange = async (index: number, value: string) => {
    const newWeights = [...weights];
    newWeights[index] = parseFloat(value) || 0;
    setWeights(newWeights);
  
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];
  
      console.log("Rutinas existentes:", routinesList, routineNameFirst);
  
      // 1️⃣ Buscar la rutina (si no existe, solo log y return)
      const currentRoutine = routinesList.find((r: any) => r.name === routineNameFirst);
      if (!currentRoutine) {
        console.log("⚠️ Rutina no encontrada:", routineName);
        return; // Salir si no existe
      }
  
      // 2️⃣ Buscar el día (si no existe, solo log y return)
      if (!Array.isArray(currentRoutine.days)) {
        console.log("⚠️ 'days' no es un array o no existe");
        return;
      }
  
      const currentDay = currentRoutine.days.find((d: any) => d.id === dayID);
      if (!currentDay) {
        console.log("⚠️ Día no encontrado:", dayID);
        return;
      }
  
      // 3️⃣ Buscar el ejercicio (si no existe, solo log y return)
      if (!Array.isArray(currentDay.exercises)) {
        console.log("⚠️ 'exercises' no es un array o no existe");
        return;
      }
  
      const exerciseIndex = currentDay.exercises.findIndex((e: any) => e.id === main.id);
      if (exerciseIndex === -1) {
        console.log("⚠️ Ejercicio no encontrado:", main.id);
        return;
      }
  
      // 4️⃣ Si todo existe, actualizar el peso
      currentDay.exercises[exerciseIndex].arrSetWeight = newWeights;
      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
      console.log("✅ Peso actualizado correctamente");
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    }
  };

  

  useEffect(() => {
    console.log(weights);
  }, [weights]);

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="RoutineOneExerciseScreen" />
      </Appbar.Header>

      <Text>
        Ejercicio actual: {main?.name || "No disponible"} {"\n"}
        Índice: {api.exercises.findIndex((e: any) => e.id === main?.id) + 1} / {api.exercises.length}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Button mode="contained" onPress={getPreviousExercise} style={{ flex: 1, margin: 5 }}>
          Anterior
        </Button>

        <View>
          <Text style={{ textAlign: "center", fontWeight: "bold", flex: 1 }}>{main.name}</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {weights.map((weight: any, index: any) => (
              <TextInput
                key={index}
                placeholder={weight.toString()}
                // value={weight.toString()}  // Ahora refleja correctamente el estado
                onChangeText={(text) => handleWeightChange(index, text)}
                keyboardType="numeric"
                style={{ margin: 5, width: 50 }}
              />
            ))}
          </View>
        </View>

        <Button mode="contained" onPress={getNextExercise} style={{ flex: 1, margin: 5 }}>
          Siguiente
        </Button>
      </View>
    </View>
  );
};

export default RoutineOneExerciseScreen;
