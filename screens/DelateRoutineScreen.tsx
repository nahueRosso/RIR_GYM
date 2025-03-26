import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Button, Dialog, NavBar, Space } from 'antd-mobile';
import { IconOutline } from '@ant-design/icons-react-native';

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

  const hideDeleteDialog = () => {
    setVisible(false);
    setRoutineToDelete(null);
  };

  const confirmDelete = async () => {
    if (routineToDelete) {
      try {
        const updatedRoutines = routines.filter(routine => routine.id !== routineToDelete.id);
        await AsyncStorage.setItem('routines', JSON.stringify(updatedRoutines));
        setRoutines(updatedRoutines);
      } catch (error) {
        console.error('Error al eliminar rutina:', error);
      }
    }
    hideDeleteDialog();
  };

  return (
    <View style={{ flex: 1 }}>
      <NavBar
        back={<IconOutline name="right" />}
        onBack={() => navigation.goBack()}
        backArrow={false}
        style={{ backgroundColor: '#1890ff' }}
      >
        Eliminar Rutina
      </NavBar>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, marginBottom: 16, color: '#252525' }}>
          Selecciona una rutina para eliminar:
        </Text>

        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Space 
              direction='horizontal' 
              style={{ 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                // marginVertical: 8,
                width: '100%'
              }}
            >
              <Text style={{ fontSize: 16, color: '#252525' }}>{item.name}</Text>
              <Button
                color="danger"
                onClick={() => showDeleteDialog(item)}
                size="small"
              >
                Eliminar
              </Button>
            </Space>
          )}
        />

        <Dialog
          visible={visible}
          content={
            <Text>
              ¿Estás seguro de que deseas eliminar la rutina "{routineToDelete?.name}"?
            </Text>
          }
          actions={[
            [
              {
                key: 'cancel',
                text: 'Cancelar',
                onClick: hideDeleteDialog,
              },
              {
                key: 'delete',
                text: 'Eliminar',
                bold: true,
                danger: true,
                onClick: confirmDelete,
              },
            ],
          ]}
        />
      </View>
    </View>
  );
};

export default DeleteRoutineScreen;