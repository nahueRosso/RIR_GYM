import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar, Button, TextInput, Text } from "react-native-paper";
import { NavigationProp, RouteProp } from "@react-navigation/native";

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const buildSetArray = (set: number, weight: number): number[] => {
  return Array(set).fill(weight);
};

const CreateDaysScreen = ({ navigation, route }: CreateDaysScreenProps) => {
  const { dayID, dayName, routineName } = route.params;

  console.log('dayID: ' ,dayID, 'dayName: ',dayName, 'routineName: ',routineName)

  const [exeName, setExeName] = useState("");
  const [set, setSet] = useState("");
  const [weight, setWeight] = useState("");
  const [rir, setRir] = useState("2");
  const [arrSetWeight, setArrSetWeight] = useState("");
  const [routines, setRoutines] = useState<any>([]);
  const [days, setDays] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);

        const currentRoutine = routinesList.find((r: any) => r.name === routineName);
        if (currentRoutine && currentRoutine.days) {
          const daysList = Object.values(currentRoutine.days);
          setDays(daysList);
        }
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };

    fetchRoutines();
  }, []);

  const validateSet = (text: string) => {
    const num = Number(text);
    if (text === "" || isNaN(num) || num < 1 || num > 5) {
      setError("Series debe estar entre 1 y 5");
    } else {
      setError("");
    }
    setSet(text);
  };

  const validateWeight = (text: string) => {
    const num = Number(text);
    if (text === "" || isNaN(num) || num < 0 || num > 500) {
      setError("Peso debe estar entre 0 y 500");
    } else {
      setError("");
    }
    setWeight(text);
  };

  const saveExercise = async () => {
    try {
      if (!exeName.trim() || !set.trim() || !weight.trim() || !rir.trim() || error) {
        Alert.alert("Error", "Todos los campos son obligatorios y deben ser válidos.");
        return;
      }

      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];

      const currentRoutine = routinesList.find((r: any) => r.name === routineName);
      if (!currentRoutine) {
        Alert.alert("Error", "Rutina no encontrada.");
        return;
      }

      currentRoutine.days = Array.isArray(currentRoutine.days) ? currentRoutine.days : Object.values(currentRoutine.days || {});
      const currentDay = currentRoutine.days.find((d: any) => d.id === dayID);
      if (!currentDay) {
        Alert.alert("Error", "Día no encontrado.");
        return;
      }

      if (!Array.isArray(currentDay.exercises)) {
        currentDay.exercises = [];
      }

      const newExercise = {
        id: Date.now().toString(),
        name: exeName,
        sets: parseInt(set),
        weight: parseFloat(weight),
        rir: parseInt(rir),
        arrSetWeight: buildSetArray(parseInt(set), parseFloat(weight)),
      };

      currentDay.exercises.push(newExercise);
      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));

      setDays([...currentRoutine.days]);
      Alert.alert("Éxito", "Ejercicio agregado al día.");
      setExeName("");
      setSet("");
      setWeight("");
      setRir("");
      setArrSetWeight("");
    } catch (error) {
      console.error("Error al guardar el ejercicio:", error);
      Alert.alert("Error", "Hubo un problema al guardar el ejercicio.");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Día: ${dayName}`} />
      </Appbar.Header>

      <TextInput
        mode="outlined"
        placeholder="Nombre del ejercicio"
        value={exeName}
        onChangeText={setExeName}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        mode="outlined"
        placeholder="Series (1-5)"
        value={set}
        onChangeText={validateSet}
        keyboardType="numeric"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        mode="outlined"
        placeholder="Peso (0-500 kg)"
        value={weight}
        onChangeText={validateWeight}
        keyboardType="numeric"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        mode="outlined"
        placeholder="RIR"
        value={rir}
        onChangeText={setRir}
        keyboardType="numeric"
        style={{ marginBottom: 10 }}
      />

      {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}

      <Button mode="contained" onPress={saveExercise} disabled={!!error || set === "" || weight === "" || parseInt(set) < 0 || parseInt(set) > 6 }>
        Guardar Ejercicio
      </Button>
    </View>
  );
};

export default CreateDaysScreen;
