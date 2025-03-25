import React, { useState, useEffect, useCallback } from "react";
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
  const { routineID, routineName, apis, dayID, routineNameFirst } = route.params;
  const [api, setApi] = useState(apis);
  const [main, setMain] = useState(() => api.exercises.find((e: any) => e.id === routineID));
  const [weights, setWeights] = useState<any>(main?.arrSetWeight || []);
  const [index, setIndex] = useState(api.exercises.findIndex((e: any) => e.id === routineID));
  const [isSaving, setIsSaving] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        if (storedData) {
          const routinesList = JSON.parse(storedData);
          const routine = routinesList.find((r: any) => r.name === routineNameFirst);
          if (routine) {
            const day = routine.days.find((d: any) => d.id === dayID);
            if (day) {
              const exercise = day.exercises.find((e: any) => e.id === main?.id);
              if (exercise) {
                setWeights(exercise.arrSetWeight || []);
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

      const currentRoutine = routinesList.find((r: any) => r.name === routineNameFirst);
      if (!currentRoutine) throw new Error("Rutina no encontrada");

      const currentDay = currentRoutine.days.find((d: any) => d.id === dayID);
      if (!currentDay) throw new Error("Día no encontrado");

      const exerciseIndex = currentDay.exercises.findIndex((e: any) => e.id === main.id);
      if (exerciseIndex === -1) throw new Error("Ejercicio no encontrado");

      // Actualizar en AsyncStorage
      currentDay.exercises[exerciseIndex].arrSetWeight = [...weights];
      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
      
      // Actualizar en el estado local
      const updatedApi = {...api};
      const localExerciseIndex = updatedApi.exercises.findIndex((e:any) => e.id === main.id);
      if (localExerciseIndex !== -1) {
        updatedApi.exercises[localExerciseIndex].arrSetWeight = [...weights];
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
    const newWeights = [...weights];
    newWeights[index] = parseFloat(value) || 0;
    setWeights(newWeights);
  };

  const getNextExercise = async () => {
    // Primero guardamos los cambios del ejercicio actual
    await saveChanges();
    
    // Luego navegamos al siguiente ejercicio
    setMain((prev: any) => {
      const currentIndex = api.exercises.findIndex((e: any) => e.id === prev?.id);
      if (currentIndex === -1) return prev;
      const nextIndex = (currentIndex + 1) % api.exercises.length;
      setIndex(nextIndex);
      const nextExercise = api.exercises[nextIndex];
      setWeights(nextExercise.arrSetWeight || []);
      return nextExercise;
    });
  };
  
  const getPreviousExercise = async () => {
    // Primero guardamos los cambios del ejercicio actual
    await saveChanges();
    
    // Luego navegamos al ejercicio anterior
    setMain((prev: any) => {
      const currentIndex = api.exercises.findIndex((e: any) => e.id === prev?.id);
      if (currentIndex === -1) return prev;
      const prevIndex = (currentIndex - 1 + api.exercises.length) % api.exercises.length;
      setIndex(prevIndex);
      const prevExercise = api.exercises[prevIndex];
      setWeights(prevExercise.arrSetWeight || []);
      return prevExercise;
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title={main?.name || "Ejercicio"} />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Text style={{ textAlign: "center", marginBottom: 16 }}>
          Ejercicio {api.exercises.findIndex((e: any) => e.id === main?.id) + 1} de {api.exercises.length}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Button 
            mode="contained" 
            onPress={getPreviousExercise} 
            style={{ flex: 1, margin: 5 }}
            disabled={isSaving}
          >
            Anterior
          </Button>

          <View style={{ flex: 2, alignItems: 'center' }}>
            <View style={{ flexDirection: "row", justifyContent: 'center', flexWrap: 'wrap' }}>
              {weights.map((weight: any, idx: any) => (
                <TextInput
                  key={idx}
                  value={weight.toString()}
                  // placeholder={weight.toString()}
                  onChangeText={(text) => handleWeightChange(idx, text)}
                  keyboardType="numeric"
                  style={{ margin: 5, width: 60, textAlign: 'center' }}
                />
              ))}
            </View>
          </View>

          <Button 
            mode="contained" 
            onPress={getNextExercise} 
            style={{ flex: 1, margin: 5 }}
            disabled={isSaving}
          >
            Siguiente
          </Button>
        </View>
      </View>
    </View>
  );
};

export default RoutineOneExerciseScreen;