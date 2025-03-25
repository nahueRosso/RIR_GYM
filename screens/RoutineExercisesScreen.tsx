import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar, Button } from "react-native-paper";
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

const RoutineExercisesScreen = ({ navigation, route }: CreateDaysScreenProps) => {
  const { dayID, dayName,routineID, routineName } = route.params;
  
  console.log('dayID: ',dayID,'dayName: ', dayName,'routineName: ',routineName,'routineID: ', routineID)

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
        setLoading(false); // Finaliza la carga
      }
    };

    fetchRoutines();
  }, [routineID, dayID]);

  const goAddExe = () =>{
    navigation.navigate('CreateExercises', { dayID: dayID,dayName: dayName ,routineName:routineName})
  }


  // Si está cargando, mostrar spinner
  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Rutinas" />
      </Appbar.Header>

      <Text>{dayName}</Text>

      {routines?.exercises?.length ? (
        routines.exercises.map((item: any, index: any) => (
          <Button
            key={index}
            mode="contained"
            onPress={() =>
              navigation.navigate("RoutineOneExercise", {
                routineID: item.id,
                routineName: item.name,
                api:routines,
              })
            }
            style={{ margin: 20 }}
          >
            {item.name}
          </Button>
        ))
      ) : (
        <Text>No hay ejercicios disponibles</Text>
      )}

       <Button 
            mode="outlined" 
            onPress={goAddExe}>
              agregar mas ejercicios
            </Button>
    </View>
  );
};

export default RoutineExercisesScreen;
