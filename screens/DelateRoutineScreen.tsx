import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Button, Text, Dialog, Portal, Provider } from 'react-native-paper'; // Importar componentes de Paper

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

interface Routine {
  id: string;
  name: string;
}

const DeleteRoutineScreen = ({ navigation }: HomeScreenProps) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [visible, setVisible] = useState(false); 
  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);

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

  const showDeleteDialog = (routine: Routine) => {
    setRoutineToDelete(routine); 
    setVisible(true); 
  };

  // Ocultar el diálogo
  const hideDeleteDialog = () => {
    setVisible(false); // Ocultar el diálogo
    setRoutineToDelete(null); // Limpiar la rutina seleccionada
  };

  // Eliminar la rutina
  const confirmDelete = async () => {
    if (routineToDelete) {
      try {
        // Filtrar las rutinas para eliminar la seleccionada
        const updatedRoutines = routines.filter(routine => routine.id !== routineToDelete.id);
        // Actualizar AsyncStorage
        await AsyncStorage.setItem('routines', JSON.stringify(updatedRoutines));
        // Actualizar el estado
        setRoutines(updatedRoutines);
      } catch (error) {
        console.error('Error al eliminar rutina:', error);
      }
    }
    hideDeleteDialog(); // Ocultar el diálogo después de eliminar
  };

  return (
    <Provider> {/* Proveedor de React Native Paper */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, marginBottom: 16 }}>Eliminar Rutina:</Text>
        <FlatList
        
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center' }}>
              <Text style={{ flex: 1, fontSize: 16,color:'#252525' }}>{item.name}</Text>
              <Button
                mode="contained"
                color="red"
                onPress={() => showDeleteDialog(item)} // Mostrar el diálogo al presionar
              >
                Eliminar
              </Button>
            </View>
          )}
        />

        <Portal>
          <Dialog visible={visible} onDismiss={hideDeleteDialog}>
            <Dialog.Title>Eliminar rutina</Dialog.Title>
            <Dialog.Content>
              <Text>
                ¿Estás seguro de que deseas eliminar la rutina "{routineToDelete?.name}"?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDeleteDialog}>Cancelar</Button>
              <Button onPress={confirmDelete} color="red">
                Eliminar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

export default DeleteRoutineScreen;