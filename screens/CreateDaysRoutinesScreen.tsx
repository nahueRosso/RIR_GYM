import React, { useState, useEffect } from "react";
import { View, Alert, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavBar, Button, List, Selector, Space, Dialog } from "antd-mobile";

import { NavigationProp } from "@react-navigation/native";
import { DeleteOutline, AddOutline, LeftOutline } from "antd-mobile-icons";

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
  const [visible, setVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]); // Nuevo estado
  const [daysOptions, setDaysOptions] = useState<DayOption[]>([
    { label: "Lunes", value: "Lunes" },
    { label: "Martes", value: "Martes" },
    { label: "Miércoles", value: "Miércoles" },
    { label: "Jueves", value: "Jueves" },
    { label: "Viernes", value: "Viernes" },
    { label: "Sábado", value: "Sábado" },
    { label: "Domingo", value: "Domingo" },
  ]);
  const [exeOptions, setExeOptions] = useState<DayOption[]>([
    { label: "Pecho", value: "Pecho" },
    { label: "Espalda", value: "Espalda" },
    { label: "Biceps", value: "Biceps" },
    { label: "Triceps", value: "Triceps" },
    { label: "Hombros", value: "Hombros" },
    { label: "Abdominales", value: "Abdominales" },
    { label: "Cuadriceps", value: "Cuadriceps" },
    { label: "Izquiotibiales", value: "Izquiotibiales" },
    { label: "Gluteos", value: "Gluteos" },
    { label: "Gemelos", value: "Gemelos" },
  ]);

console.log(routineName)

  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones si el componente se desmontó

    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        if (!isMounted) return;

        const routinesList = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);

        const currentRoutine = routinesList.find(
          (r: any) => r.name === routineName
        );
        if (currentRoutine?.days) {
          const daysList = Object.values(currentRoutine.days);
          setDays(daysList);
          setIsMaxDaysReached(daysList.length >= 7);

          const existingDays = daysList.map((day: any) => day.name);
          setDaysOptions((prevOptions) =>
            prevOptions.map((option) => ({
              ...option,
              disabled: existingDays.includes(option.value),
            }))
          );
        }
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchRoutines);
    fetchRoutines();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [routineName, navigation]);

  useEffect(() => {
    // Actualiza el estado visible basado en selectedDays
    setVisible(selectedDays.length > 1);
  }, [selectedDays]);

  const saveDayRoutine = async () => {
    if (selectedDays.length === 0) {
      Alert.alert("Error", "Selecciona al menos un día");
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert("Info", "Selecciona al menos un ejercicio prioritario");
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];
      const routineIndex = routinesList.findIndex(
        (r: any) => r.name === routineName
      );

      if (routineIndex === -1) {
        Alert.alert("Error", "Rutina no encontrada");
        return;
      }

      const currentRoutine = routinesList[routineIndex];
      currentRoutine.days = currentRoutine.days || {};

      // Verificar límite de días
      const totalDays =
        Object.keys(currentRoutine.days).length + selectedDays.length;
      if (totalDays > 7) {
        Alert.alert("Error", "No puedes agregar más de 7 días a la rutina");
        return;
      }

      // Agregar nuevos días con ejercicios prioritarios
      selectedDays.forEach((dayName) => {
        if (!currentRoutine.days[dayName]) {
          currentRoutine.days[dayName] = {
            id: Date.now().toString() + dayName,
            name: dayName,
            exercises: {},
            priorityExercises: selectedExercises, // <- Añadimos los ejercicios prioritarios
          };
        } else {
          // Si el día ya existe, actualizamos los ejercicios prioritarios
          currentRoutine.days[dayName].priorityExercises = [
            ...new Set([
              // Elimina duplicados
              ...(currentRoutine.days[dayName].priorityExercises || []),
              ...selectedExercises,
            ]),
          ];
        }
      });

      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));

      // Actualizar estado
      const updatedDays = Object.values(currentRoutine.days);
      setDays(updatedDays);
      setIsMaxDaysReached(updatedDays.length >= 7);
      setSelectedDays([]);
      setSelectedExercises([]); // Limpiar selección de ejercicios

      Alert.alert("Éxito", "Días y ejercicios agregados a la rutina");
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "Hubo un problema al guardar");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#161618" }}>
      <Text
        style={{
          color: "white",
          fontSize: 25,
          fontFamily: "Cochin",
          textAlign: "center",
          marginTop: 20,
          marginBottom: 0,
          fontWeight: "light",
        }}
      >
        AGREGAR DIAS
      </Text>
      <View style={{ paddingLeft: 38, paddingRight: 38 }}>
      <Text
        style={{
          color: "white",
          fontSize: 15,
          marginBottom:8,
          marginTop:13,
          textAlign: "left",
          fontFamily: "Cochin",
          fontWeight: "light",
        }}
      >
        Seleccione dias
      </Text>
        <Selector
          options={daysOptions}
          value={selectedDays}
          onChange={setSelectedDays}
          multiple
          style={{
            "--border-radius": "50px",
            "--border": "solid transparent 1px",
            "--checked-border": "solid transparent 1px",
            "--padding": "4px 16px",
            "--color": "#28282A",
            "--text-color": "#aaa",
            "--checked-color": "#BCFD0E",
            "--checked-text-color": "#161618",
            fontFamily: "Cochin",
          }}
          showCheckMark={false}
        />
        <Text
        style={{
          color: "white",
          fontSize: 15,
          marginBottom:8,
          marginTop:13,
          textAlign: "left",
          fontFamily: "Cochin",
          fontWeight: "light",
        }}
      >
        Seleccione Ejercicios
      </Text>

        <Selector
          options={exeOptions}
          value={selectedExercises} // Usa el nuevo estado
          onChange={setSelectedExercises} // Actualiza el nuevo estado
          multiple
          style={{
            "--border-radius": "50px",
            "--border": "solid transparent 1px",
            "--checked-border": "solid transparent 1px",
            "--padding": "4px 16px",
            "--color": "#28282A",
            "--text-color": "#aaa",
            "--checked-color": "#BCFD0E",
            "--checked-text-color": "#161618",
            fontFamily: "Cochin",
          }}
          showCheckMark={false}
        />
      </View>

      <Button
        onClick={saveDayRoutine}
        disabled={selectedDays.length === 0 || isMaxDaysReached}
        style={{
          fontFamily: "Cochin",
          fontWeight: "lighter",
          fontSize: 17,
          color: "#ffffff",
          borderColor: "#28282A",
          backgroundColor: "#28282A",
          textTransform: "capitalize",
          margin: 10,
          width: "80%",
          maxWidth: 300,
          borderStyle: "solid",
          borderRadius: 10,
          alignSelf: "center",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 17,
            margin: 3,
            fontFamily: "Cochin",
            textAlign: "center",
            fontWeight: "light",
            textTransform:'capitalize',
          }}
        >
          Guardar Días
        </Text>

        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 100,
            height: "100%",
            width: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "blanco",
              fontSize: 15,
              marginLeft: 30,
              fontFamily: "Cochin",
              textAlign: "right",
              fontWeight: "light",
            }}
          >
            {/* {day.name.slice(0, 3)} */}
          </Text>
        </View>

        <View
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            right: -60,
            bottom: -20,
            borderRadius: 10,
            backgroundColor: "#BCFD0E",
            transform: [{ rotate: "25deg" }],
          }}
        />
      </Button>

      <Dialog
        visible={visible}
        content={
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                marginVertical: "auto",
                fontSize: 15,
              }}
            >
              Si seleccionas más de un día, los cambios realizados en uno se
              replicarán en los demás.
            </Text>
          </View>
        }
        actions={[
          [
            {
              key: "cancel",
              text: "Continuar",
              onClick: () => setVisible(false),
              style: { color: "#161618", backgroundColor: "#BCFD0E" },
            },
          ],
        ]}
        bodyStyle={{
          backgroundColor: "#161618",
          borderColor: "#060608",
        }}
      />

       <View
              style={{
                position: "absolute",
                bottom: 80,
                left: 40,
                display: "flex",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                color="success"
                style={{
                  fontSize: 17,
                  color: "#161618",
                  borderColor: "#A1D70F",
                  backgroundColor: "#BCFD0E",
                  width: 40,
                  height: 40,
                  maxWidth: 300,
                  borderStyle: "solid",
                  borderRadius: 30,
                }}
                onClick={() => navigation.goBack()}
                // style={styles.button}
              >
                <LeftOutline
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 10,
                    color: "#161618",
                    fontWeight: "bold",
                  }}
                />
              </Button>
            </View>
    </View>
  );
};

export default CreateDaysScreen;
