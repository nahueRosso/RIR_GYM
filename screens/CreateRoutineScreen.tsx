import React, { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavBar, Button, Input, Dialog } from 'antd-mobile';
import { IconOutline } from '@ant-design/icons-react-native';
import { NavigationProp } from '@react-navigation/native';


interface CreateRoutineScreenProps {
  navigation: NavigationProp<any>;
}

const CreateRoutineScreen = ({ navigation }: CreateRoutineScreenProps) => {
  const [routineName, setRoutineName] = useState('');
  const [routinesCount, setRoutinesCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadRoutinesCount = async () => {
      try {
        const storedData = await AsyncStorage.getItem('routines');
        const routines = storedData ? JSON.parse(storedData) : [];
        setRoutinesCount(routines.length);
      } catch (error) {
        console.error('Error al cargar rutinas:', error);
      }
    };
    loadRoutinesCount();
  }, []);
  

  const saveRoutine = async () => {
    try {
      const storedData = await AsyncStorage.getItem('routines');
      let routines = storedData ? JSON.parse(storedData) : [];
  
      if (!Array.isArray(routines)) {
        console.error('Error: routines no es un array', routines);
        routines = [];
      }
  
      if (routines.length >= 7) {
        setVisible(true);
        Alert.alert('Error', 'No puedes crear más de 7 rutinas.');
        return;
      }
      if (!routineName.trim()) {
        Alert.alert('Error', 'El nombre de la rutina no puede estar vacío.');
        return;
      }
  
      const newRoutine = {
        id: Date.now().toString(),
        name: routineName,
      };
  
      const updatedRoutines = [...routines, newRoutine];
  
      await AsyncStorage.setItem('routines', JSON.stringify(updatedRoutines));
      setRoutinesCount(updatedRoutines.length);
  
      Alert.alert('Éxito', 'Rutina guardada');
      setRoutineName('');
      navigation.navigate('CreateDays', { routineName });
    } catch (error) {
      console.error('Error al guardar rutina:', error);
      Alert.alert('Error', 'Hubo un problema al guardar la rutina.');
    }
  };
  

  const goDelate = () => {
    navigation.navigate('DelateRoutine');
    setVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* NavBar reemplaza al Appbar.Header */}
      <NavBar
        back={<IconOutline name="right" />}
        onBack={() => navigation.goBack()}
        backArrow={false} // Ocultamos la flecha por defecto para usar nuestro icono
        style={{ backgroundColor: '#1890ff' }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Crear Rutina</Text>
      </NavBar>

      <View style={{ padding: 16 }}>
        {/* Input reemplaza TextInput */}
        <Input
          placeholder="Nombre de la rutina"
          value={routineName}
          onChange={setRoutineName}
          style={{ marginBottom: 16 }}
        />

        <Button color="primary" onClick={saveRoutine}>
          Guardar rutina
        </Button>

        {/* Dialog reemplaza el Portal/Dialog de Paper */}
        <Dialog
          visible={visible && routinesCount >= 7}
          content={
            <View>
              <Text>¡Llegaste al máximo de rutinas (7)!</Text>
            </View>
          }
          actions={[
            {
              key: 'delete',
              text: 'DelateRoutine',
              onClick: () => {
                navigation.navigate('DelateRoutine');
                setVisible(false);
              },
            },
          ]}
        />
      </View>
    </View>
  );
};

export default CreateRoutineScreen;