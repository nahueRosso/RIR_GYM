import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavBar, Button } from 'antd-mobile';
import { IconOutline } from '@ant-design/icons-react-native';
import { NavigationProp } from '@react-navigation/native';
import {AddOutline , AntOutline } from 'antd-mobile-icons'

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
       <NavBar
                          back={<IconOutline name="right" />}
                          onBack={() => navigation.goBack()}
                          backArrow={false} // Ocultamos la flecha por defecto para usar nuestro icono
                          style={{ backgroundColor: '#1890ff' }}
                        >
                          <Text style={{ color: 'white', fontSize: 18 }}>"RoutinesScreen"</Text>
                  </NavBar>
      <Text>Lista de Rutinas:</Text>
      {/* <AntOutline> */}
     <AddOutline />
      {/* </AntOutline> */}

      {routines.map((item: any, index: any) => {
  return (
    <Button
      key={index}  
      onClick={() =>  navigation.navigate('RoutinesDay', { routineID: item.id,routineName: item.name })}
      style={{ margin: 20 }}
    >
      {item.name} 
    </Button>
  );
})}

    </View>
  );
};

export default RoutineScreen;
