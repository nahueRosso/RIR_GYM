import React, { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar, Button, TextInput, Portal, Dialog } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';

interface CreateRoutineScreenProps {
  navigation: NavigationProp<any>;
}

const CreateRoutineScreen = ({ navigation }: CreateRoutineScreenProps) => {
  const [routineName, setRoutineName] = useState('');
  const [routinesCount, setRoutinesCount] = useState(0); // Estado para contar las rutinas
  const [visible, setVisible] = useState<boolean>(true);

  // Cargar el número de rutinas al iniciar la pantalla
  useEffect(() => {
    const loadRoutinesCount = async () => {
      try {
        const storedData = await AsyncStorage.getItem('routines');
        const routines = storedData ? JSON.parse(storedData) : [];
  
        if (!Array.isArray(routines)) {
          console.error('Error: routines no es un array', routines);
          setRoutinesCount(0); // Evita que el estado tenga un valor incorrecto
          return;
        }
  
        setRoutinesCount(routines.length); // Actualizar el contador de rutinas
      } catch (error) {
        console.error('Error al cargar rutinas:', error);
        setRoutinesCount(0);
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
    <View style={{ padding: 16 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Crear Rutina" />
      </Appbar.Header>

      {/* Mostrar mensaje si se alcanzó el límite de rutinas */}
      {routinesCount >= 7 && (
        <Portal>
          <Dialog visible={visible}>
            <Dialog.Title>Eliminar rutina</Dialog.Title>
            <Dialog.Content>
              <Text>¡Llegaste al máximo de rutinas (7)!</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode="contained" onPress={goDelate} style={{ margin: 20 }}>
                DelateRoutine
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}

      <TextInput
        mode="outlined"
        placeholder="Nombre de la rutina"
        value={routineName}
        onChangeText={setRoutineName}
        style={{ marginBottom: 10 }}
      />

      <Button mode="contained" onPress={saveRoutine}>
        Guardar rutina
      </Button>
    </View>
  );
};

export default CreateRoutineScreen;