import React, { useState } from "react";
import { View, Text } from "react-native";
import { Appbar, Button,TextInput } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const RoutineOneExerciseScreen = ({
  navigation,
  route,
}: CreateDaysScreenProps) => {
  const { routineID, routineName, api } = route.params;

  const [main, setMain] = useState(() =>
    api.exercises.find((e: any) => e.id === routineID)
  ); // Estado inicial

  const getNextExercise = () => {
    setMain((prev: any) => {
      const index = api.exercises.findIndex((e: any) => e.id === prev?.id);
      if (index === -1) return prev; // Si no encuentra el ID, mantener el estado actual
      const nextIndex = (index + 1) % api.exercises.length;
      return api.exercises[nextIndex]; // Retorna el siguiente ejercicio
    });
  };

  const getPreviousExercise = () => {
    setMain((prev: any) => {
      const index = api.exercises.findIndex((e: any) => e.id === prev?.id);
      if (index === -1) return prev;
      const prevIndex =
        (index - 1 + api.exercises.length) % api.exercises.length;
      return api.exercises[prevIndex]; // Retorna el ejercicio anterior
    });
  };

// const [weights, setWeights] = useState(main?.arrSetWeight || []);

//   const handleWeightChange = (index: number, value: string) => {
//     const newWeights = [...weights];
//     newWeights[index] = value;
//     setWeights(newWeights);
//   };

  console.log(main)

  return (
    <View>
  <Appbar.Header>
    <Appbar.Content title="RoutineOneExercise" />
  </Appbar.Header>

  <Text>
    Ejercicio actual: {main?.name || "No disponible"} {"\n"}
    Índice: {api.exercises.findIndex((e: any) => e.id === main?.id) + 1} / {api.exercises.length}
  </Text>

  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
    <Button mode="contained" onPress={getPreviousExercise} style={{ flex: 1, margin: 5 }}>
      Anterior
    </Button>
    <View>
      <Text style={{ textAlign: "center", fontWeight: "bold", flex: 1 }}>{main.name}</Text>

      {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
        {main.arrSetWeight.map((weight:any, index:any) => (
          <Text key={index}> {weight} </Text>

// <TextInput
//                 key={index}
//                 value={weight.toString()}
//                 onChangeText={(text) => handleWeightChange(index, text)}
//                 keyboardType="numeric"
//                 style={{ margin: 5, width: 50 }}
//               />
        ))}
      </View> */}
    </View>    
    <Button mode="contained" onPress={getNextExercise} style={{ flex: 1, margin: 5 }}>
      Siguiente
    </Button>
  </View>
</View>

  );
};

export default RoutineOneExerciseScreen;
