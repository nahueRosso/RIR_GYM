import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar, Button, TextInput, List,Text } from "react-native-paper";
import { NavigationProp, RouteProp } from "@react-navigation/native";

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const CreateDaysScreen = ({ navigation, route }: CreateDaysScreenProps) => {
  const { routineName } = route.params;
  const [dayName, setDayName] = useState("");
  const [dayPress, setDayPress] = useState("");
  const [routines, setRoutines] = useState<any>([]);
  const [days, setDays] = useState<any[]>([]);
  const [isMaxDaysReached, setIsMaxDaysReached] = useState(false); // Estado para controlar el límite de días



  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);

        // Encontrar la rutina actual
        const currentRoutine = routinesList.find(
          (r: any) => r.name === routineName
        );
        if (currentRoutine && currentRoutine.days) {
          const daysList = Object.values(currentRoutine.days);
          setDays(daysList);
          setIsMaxDaysReached(daysList.length >= 7); // Actualizar el estado del límite de días
        }
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };

    fetchRoutines();
  }, []);

  const saveDayRoutine = async () => {
    try {
      if (!dayName.trim()) {
        Alert.alert("Error", "El nombre del día no puede estar vacío.");
        return;
      }

      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];

      const currentRoutine = routinesList.find(
        (r: any) => r.name === routineName
      );
      if (!currentRoutine) {
        Alert.alert("Error", "Rutina no encontrada.");
        return;
      }

      if (!currentRoutine.days) {
        currentRoutine.days = {};
      }

      if (currentRoutine.days[dayName]) {
        Alert.alert("Error", "Este día ya existe en la rutina.");
        return;
      }

      // Validar el límite de 7 días
      if (Object.keys(currentRoutine.days).length >= 7) {
        Alert.alert("Error", "No puedes agregar más de 7 días a la rutina.");
        setIsMaxDaysReached(true); // Actualizar el estado del límite de días
        return;
      }

      currentRoutine.days[dayName] = {
        id: Date.now().toString(),
        name: dayName,
        exercises: {},
      };

      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
      const updatedDays = Object.values(currentRoutine.days);
      setDays(updatedDays); // Actualizar el estado de los días
      setIsMaxDaysReached(updatedDays.length >= 7); // Actualizar el estado del límite de días
      Alert.alert("Éxito", "Día agregado a la rutina.");
      setDayName("");
    } catch (error) {
      console.error("Error al guardar el día:", error);
      Alert.alert("Error", "Hubo un problema al guardar el día.");
    }
  };
  
 
  return (
    <View style={{ padding: 16 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Rutina: ${routineName}`} />
      </Appbar.Header>

      {days.map((day: any) => (
        <List.Item
        key={day.id}
        title={day.name}
        left={() => <List.Icon color="red" icon="dumbbell" />}
        onPress={()=> navigation.navigate('CreateExercises', { dayID: day.id,dayName: day.name ,routineName:routineName})}
        />
      ))}

      <TextInput
        mode="outlined"
        placeholder="Nombre del día (lunes, martes, etc.)"
        value={dayName}
        onChangeText={setDayName}
        disabled={isMaxDaysReached} // Deshabilitar si hay 7 días o el campo está vacío
        style={{ marginBottom: 10, display: isMaxDaysReached?'none':'flex'}}
      />

      <Button
        mode="contained"
        onPress={saveDayRoutine}
        disabled={isMaxDaysReached || !dayName.trim()} // Deshabilitar si hay 7 días o el campo está vacío
      >
        Guardar Día
      </Button>

      {isMaxDaysReached && (
        <Text style={{ color: "black", marginTop: 10, fontSize:20 }}>
          ¡Has alcanzado el límite de 7 días!
        </Text>
      )}
    </View>
  );
};

export default CreateDaysScreen;