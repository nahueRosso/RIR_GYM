import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar, Button } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';

interface RoutinesScreenProps {
  navigation: NavigationProp<any>;
}


interface Routine {
  id: number;
  name: string;
}

const RoutineScreen = ({ navigation }: RoutinesScreenProps) => {
  const [routines, setRoutines] = useState<Routine[]>([]); // ⬅ Define el tipo

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem('routines');
        const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);
      } catch (error) {
        console.error('Error al cargar rutinas:', error);
      }
    };

    fetchRoutines();
  }, []);

  console.log(routines)
  console.log(routines[routines.length - 1])

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="RoutinesScreen" />
      </Appbar.Header>
      <Text>Lista de Rutinas:</Text>
      {routines.map((item: any, index: any) => {
  return (
    <Button
      key={index}  
      mode="contained"
      onPress={() =>  navigation.navigate('RoutinesDay', { routineID: item.id,routineName: item.name })}
      style={{ margin: 20 }}
    >
      {item.name} {console.log(item.name)}
    </Button>
  );
})}

    </View>
  );
};

export default RoutineScreen;
