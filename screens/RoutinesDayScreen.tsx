import React, { useEffect, useState } from "react";
import { View, Text, FlatList ,Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar, Button } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";

interface DaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Routine {
  id: number;
  name: string;
  days:any;
}

const RoutineScreen = ({ navigation, route }: DaysScreenProps) => {
  const [routines, setRoutines] = useState<Routine[]>([]); // ⬅ Define el tipo
  const { routineID, routineName } = route.params;
  
  console.log( 'routineName: ',routineName)

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

    fetchRoutines();
  }, []);


 const goAddDays = async () => {
  navigation.navigate('CreateDays', { routineName: routineName })
  };


  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="RutinasDayScreen" />
      </Appbar.Header>
      <Text>{routineName}</Text>
      {routines
        .filter((item) => item.id === routineID) // Filtra solo la rutina actual
        .map((item) => 
          Object.values(item.days).map((day: any, index) => ( // Mapea correctamente los días
            <Button
              key={index}
              
              mode="contained"
              onPress={() => navigation.navigate("RoutineExercises",{ dayID: day.id,dayName: day.name ,routineID:routineID, routineName:routineName})}
              style={{ margin: 20 }}
            >
              {day.name}
            </Button>
          ))
        )}

    <Button 
      mode="outlined" 
      onPress={goAddDays}>
        Agregar mas dias
      </Button>
    </View>
  );
};

export default RoutineScreen;
