import React, { useState, useEffect } from "react";
import { View, Alert , Text} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavBar, Button, Input } from "antd-mobile";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { DeleteOutline, AddOutline, LeftOutline } from "antd-mobile-icons";


interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const buildSetArray = (set: number, weight: number): number[] => {
  return Array(set).fill(weight);
};

const CreateDaysScreen = ({ navigation, route }: CreateDaysScreenProps) => {
  const { dayID, dayName, routineName } = route.params;

  console.log('dayID: ' ,dayID, 'dayName: ',dayName, 'routineName: ',routineName)

  const [exeName, setExeName] = useState("");
  const [set, setSet] = useState("");
  const [weight, setWeight] = useState("");
  const [rir, setRir] = useState("2");
  const [arrSetWeight, setArrSetWeight] = useState("");
  const [arrSetRIR, setArrSetRIR] = useState("");
  const [routines, setRoutines] = useState<any>([]);
  const [days, setDays] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);

        const currentRoutine = routinesList.find((r: any) => r.name === routineName);
        if (currentRoutine && currentRoutine.days) {
          const daysList = Object.values(currentRoutine.days);
          setDays(daysList);
        }
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };

    fetchRoutines();
  }, []);

  const validateSet = (text: string) => {
    const num = Number(text);
    if (text === "" || isNaN(num) || num < 1 || num > 5) {
      setError("Series debe estar entre 1 y 5");
    } else {
      setError("");
    }
    setSet(text);
  };

  const validateWeight = (text: string) => {
    const num = Number(text);
    if (text === "" || isNaN(num) || num < 0 || num > 500) {
      setError("Peso debe estar entre 0 y 500");
    } else {
      setError("");
    }
    setWeight(text);
  };

  const saveExercise = async () => {
    try {
      if (!exeName.trim() || !set.trim() || !weight.trim() || !rir.trim() || error) {
        Alert.alert("Error", "Todos los campos son obligatorios y deben ser válidos.");
        return;
      }

      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];

      const currentRoutine = routinesList.find((r: any) => r.name === routineName);
      if (!currentRoutine) {
        Alert.alert("Error", "Rutina no encontrada.");
        return;
      }

      currentRoutine.days = Array.isArray(currentRoutine.days) ? currentRoutine.days : Object.values(currentRoutine.days || {});
      const currentDay = currentRoutine.days.find((d: any) => d.id === dayID);
      if (!currentDay) {
        Alert.alert("Error", "Día no encontrado.");
        return;
      }

      if (!Array.isArray(currentDay.exercises)) {
        currentDay.exercises = [];
      }

      const newExercise = {
        id: Date.now().toString(),
        name: exeName,
        sets: parseInt(set),
        weight: parseFloat(weight),
        rir: parseInt(rir),
        arrSetWeight: buildSetArray(parseInt(set), parseFloat(weight)),
        arrSetRIR: buildSetArray(parseInt(set), parseFloat(rir)),
      };

      currentDay.exercises.push(newExercise);
      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));

      setDays([...currentRoutine.days]);
      Alert.alert("Éxito", "Ejercicio agregado al día.");
      setExeName("");
      setSet("");
      setWeight("");
      setRir("2");
      setArrSetWeight("");
      setArrSetRIR("");
    } catch (error) {
      console.error("Error al guardar el ejercicio:", error);
      Alert.alert("Error", "Hubo un problema al guardar el ejercicio.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#161618" }}>
               <Text
                 style={{
                   color: "white",
                   textTransform:"uppercase",
                   fontSize: 25,
                   fontFamily: "Cochin",
                   textAlign: "center",
                   marginTop: 20,
                   marginBottom: 40,
                   fontWeight: "light",
                 }}
               >
                CREAR EJERCICIOS
               </Text>

<View style={{ padding: 16 }}>
        <Input
          placeholder="Nombre del ejercicio"
        value={exeName}
        onChange={setExeName}
          style={{ marginBottom: 16,margin: 20,marginLeft:38,'--color':'#ffffff',"--placeholder-color":'#888' }}
        />
        <Input
          placeholder="Series (1-5)"
        value={set}
        onChange={validateSet}
        type="number"
          style={{ marginBottom: 16,margin: 20,marginLeft:38,'--color':'#ffffff',"--placeholder-color":'#888' }}
        />
        <Input
          placeholder="Peso (0-500 kg)"
        value={weight}
        onChange={validateWeight}
        type="number"
          style={{ marginBottom: 16,margin: 20,marginLeft:38,'--color':'#ffffff',"--placeholder-color":'#888' }}
        />
        <Input
          placeholder="RIR"
        value={rir}
        onChange={setRir}
        type="number"
          style={{ marginBottom: 16,margin: 20,marginLeft:38,'--color':'#ffffff',"--placeholder-color":'#888' }}
        />

        <Button
          onClick={saveExercise} 
          disabled={!!error || set === "" || weight === "" || parseInt(set) < 0 || parseInt(set) > 6 }
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
            }}
          >
            Guardar Ejerciciogit 
          </Text>

          <View
            style={{
              position: "absolute",
              // backgroundColor: "yellow",
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


        {/* Dialog reemplaza el Portal/Dialog de Paper */}
        {/* <Dialog
          visible={visible && routinesCount >= 7}
          content={
            <View>
              <Text>¡Llegaste al máximo de rutinas (7)!</Text>
            </View>
          }
          actions={[
            {
              key: "delete",
              text: "DelateRoutine",
              onClick: () => {
                navigation.navigate("DelateRoutine");
                setVisible(false);
              },
            },
          ]}
        /> */}
      </View>
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


      {/* <Input
        placeholder="Nombre del ejercicio"
        value={exeName}
        onChange={setExeName}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Series (1-5)"
        value={set}
        onChange={validateSet}
        type="number"
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Peso (0-500 kg)"
        value={weight}
        onChange={validateWeight}
        type="number"
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="RIR"
        value={rir}
        onChange={setRir}
        type="number"
        style={{ marginBottom: 10 }}
      /> */}

      {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}

      {/* <Button 
        onClick={saveExercise} 
        disabled={!!error || set === "" || weight === "" || parseInt(set) < 0 || parseInt(set) > 6 }
        >
        Guardar Ejercicio
      </Button> */}
    </View>
  );
};

export default CreateDaysScreen;
