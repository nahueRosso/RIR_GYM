import React, { useState, useEffect } from "react";
import { View, Alert, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavBar, Button, List, Selector, Space } from "antd-mobile";
import { IconOutline } from "@ant-design/icons-react-native";
import { NavigationProp } from "@react-navigation/native";

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface DayOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const CreateDaysScreen = ({ navigation, route }: CreateDaysScreenProps) => {
  const { routineName } = route.params;
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [routines, setRoutines] = useState<any>([]);
  const [days, setDays] = useState<any[]>([]);
  const [isMaxDaysReached, setIsMaxDaysReached] = useState(false);
  const [daysOptions, setDaysOptions] = useState<DayOption[]>([
    { label: "Lunes", value: "Lunes" },
    { label: "Martes", value: "Martes" },
    { label: "Miércoles", value: "Miércoles" },
    { label: "Jueves", value: "Jueves" },
    { label: "Viernes", value: "Viernes" },
    { label: "Sábado", value: "Sábado" },
    { label: "Domingo", value: "Domingo" },
  ]);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);

        const currentRoutine = routinesList.find((r: any) => r.name === routineName);
        if (currentRoutine?.days) {
          const daysList = Object.values(currentRoutine.days);
          setDays(daysList);
          setIsMaxDaysReached(daysList.length >= 7);
          
          const existingDays = daysList.map((day: any) => day.name);
          setDaysOptions(prevOptions => 
            prevOptions.map(option => ({
              ...option,
              disabled: existingDays.includes(option.value)
            }))
          );
          console.log(daysOptions)
        }
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };

    fetchRoutines();
  }, [routineName]);

  const saveDayRoutine = async () => {
    if (selectedDays.length === 0) {
      Alert.alert("Error", "Selecciona al menos un día");
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];
      const routineIndex = routinesList.findIndex((r: any) => r.name === routineName);

      if (routineIndex === -1) {
        Alert.alert("Error", "Rutina no encontrada");
        return;
      }

      const currentRoutine = routinesList[routineIndex];
      currentRoutine.days = currentRoutine.days || {};

      // Verificar límite de días
      const totalDays = Object.keys(currentRoutine.days).length + selectedDays.length;
      if (totalDays > 7) {
        Alert.alert("Error", "No puedes agregar más de 7 días a la rutina");
        return;
      }

      // Agregar nuevos días
      selectedDays.forEach(dayName => {
        if (!currentRoutine.days[dayName]) {
          currentRoutine.days[dayName] = {
            id: Date.now().toString() + dayName,
            name: dayName,
            exercises: {},
          };
        }
      });

      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
      
      // Actualizar estado
      const updatedDays = Object.values(currentRoutine.days);
      setDays(updatedDays);
      setIsMaxDaysReached(updatedDays.length >= 7);
      setSelectedDays([]);
      
      Alert.alert("Éxito", "Días agregados a la rutina");
    } catch (error) {
      console.error("Error al guardar días:", error);
      Alert.alert("Error", "Hubo un problema al guardar los días");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NavBar
        back={<IconOutline name="left" />}
        onBack={() => navigation.goBack()}
        style={{ backgroundColor: "#1890ff" }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>{`Rutina: ${routineName}`}</Text>
      </NavBar>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>Días existentes:</Text>
        
        {days.length > 0 ? (
          <List>
            {days.map((day) => (
              <List.Item
                key={day.id}
                onClick={() =>
                  navigation.navigate("CreateExercises", {
                    dayID: day.id,
                    dayName: day.name,
                    routineName,
                  })
                }
              >
                {day.name}
              </List.Item>
            ))}
          </List>
        ) : (
          <Text style={{ marginBottom: 16 }}>No hay días agregados aún</Text>
        )}

        <Text style={{ fontSize: 16, marginVertical: 16 }}>Agregar nuevos días:</Text>
        
        <Selector
          options={daysOptions}
          value={selectedDays}
          onChange={setSelectedDays}
          multiple
          style={{
            '--border-radius': '100px',
            '--border': 'solid transparent 1px',
            '--checked-border': 'solid var(--adm-color-primary) 1px',
            '--padding': '8px 24px',
          }}
          showCheckMark={false}
        />

        <Space direction="vertical" style={{ marginTop: 16 }}>
          <Button 
            color="primary" 
            onClick={saveDayRoutine}
            disabled={selectedDays.length === 0 || isMaxDaysReached}
          >
            Guardar Días Seleccionados
          </Button>

          {isMaxDaysReached && (
            <Text style={{ color: "red", textAlign: "center" }}>
              ¡Has alcanzado el límite de 7 días por rutina!
            </Text>
          )}
        </Space>
      </View>
    </View>
  );
};

export default CreateDaysScreen;