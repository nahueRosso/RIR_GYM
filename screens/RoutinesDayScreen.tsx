import React, { useEffect, useState } from "react";
import { View, Text, FlatList ,Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavBar, Button } from "antd-mobile";
import { IconOutline } from '@ant-design/icons-react-native';
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
       <NavBar
                          back={<IconOutline name="right" />}
                          onBack={() => navigation.goBack()}
                          backArrow={false} // Ocultamos la flecha por defecto para usar nuestro icono
                          style={{ backgroundColor: '#1890ff' }}
                        >
                          <Text style={{ color: 'white', fontSize: 18 }}>"RutinasDayScreen"</Text>
                  </NavBar>
      
      <Text>{routineName}</Text>
      {routines
        .filter((item) => item.id === routineID) // Filtra solo la rutina actual
        .map((item) => 
          Object.values(item.days).map((day: any, index) => ( // Mapea correctamente los días
            <Button
              key={index}
              onClick={() => navigation.navigate("RoutineExercises",{ dayID: day.id,dayName: day.name ,routineID:routineID, routineName:routineName})}
              style={{ margin: 20 }}
            >
              {day.name}
            </Button>
          ))
        )}

    <Button  
      onClick={goAddDays}>
        Agregar mas dias
      </Button>
    </View>
  );
};

export default RoutineScreen;
