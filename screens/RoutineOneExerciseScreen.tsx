import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  Alert, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Exercise {
  id: string;
  name: string;
  arrSetWeight: number[];
  arrSetRIR: number[];
}

interface RoutineDay {
  id: string;
  name: string;
  exercises: Exercise[];
  priorityExercises: string[];
}

interface Routine {
  id: string;
  name: string;
  days: {
    [key: string]: RoutineDay;
  };
}
interface ApiData {
  exercises: Exercise[];
  // Agrega otras propiedades que pueda tener tu objeto api
}


const RoutineOneExerciseScreen = ({ navigation, route }: CreateDaysScreenProps) => {
  const { routineID, routineName, apis, dayID, routineNameFirst } = route.params;
  const [api, setApi] = useState<ApiData>(apis);
const [main, setMain] = useState<Exercise | undefined>(() =>
  api.exercises.find((e) => e.id === routineID)
);
  const [weights, setWeights] = useState<any>(main?.arrSetWeight || []);
  const [rirs, setRirs] = useState<any>(main?.arrSetRIR || []);
  const [index, setIndex] = useState(
    api.exercises.findIndex((e: any) => e.id === routineID)
  );
  const [isSaving, setIsSaving] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        if (storedData) {
          const routinesList = JSON.parse(storedData);
          const routine = routinesList.find(
            (r: any) => r.name === routineNameFirst
          );
          if (routine) {
            const day: any  = Object.values(routine.days).find((d: any) => d.id === dayID);
            if (day) {
              const exercise = day.exercises.find(
                (e: any) => e.id === main?.id
              );
              if (exercise) {
                setWeights(exercise.arrSetWeight || []);
                setRirs(exercise.arrSetRIR || []);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [main?.id]);

  // Guardar cambios en AsyncStorage
  const saveChanges = async () => {
    if (!main) return;
  
    setIsSaving(true);
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];
  
      const currentRoutine = routinesList.find(
        (r: any) => r.name === routineNameFirst
      );
      if (!currentRoutine) throw new Error("Rutina no encontrada");
  
      const currentDay:any = Object.values(currentRoutine.days).find((d: any) => d.id === dayID);
      if (!currentDay) throw new Error("Día no encontrado");
  
      const exerciseIndex = currentDay.exercises.findIndex(
        (e: any) => e.id === main.id
      );
      if (exerciseIndex === -1) throw new Error("Ejercicio no encontrado");
  
      // Actualizar en AsyncStorage
      currentDay.exercises[exerciseIndex].arrSetWeight = [...weights];
      currentDay.exercises[exerciseIndex].arrSetRIR = [...rirs];
      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
  
      // Actualizar en el estado local
      const updatedApi = { ...api };
      const localExerciseIndex = updatedApi.exercises.findIndex(
        (e: any) => e.id === main.id
      );
      if (localExerciseIndex !== -1) {
        updatedApi.exercises[localExerciseIndex].arrSetWeight = [...weights];
        updatedApi.exercises[localExerciseIndex].arrSetRIR = [...rirs];
        setApi(updatedApi);
      }
  
      console.log("Cambios guardados exitosamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWeightChange = (index: number, value: string) => {
    const newWeights = [...weights];
    newWeights[index] = parseFloat(value) || 0;
    setWeights(newWeights);
  };
  
  const handlerirChange = (index: number, value: string) => {
    const newRir = [...rirs];
    newRir[index] = parseFloat(value) || 0;
    setRirs(newRir);
  };

  const getNextExercise = async () => {
    await saveChanges();
    setMain((prev: any) => {
      const currentIndex = api.exercises.findIndex(
        (e: any) => e.id === prev?.id
      );
      if (currentIndex === -1) return prev;
      const nextIndex = (currentIndex + 1) % api.exercises.length;
      setIndex(nextIndex);
      const nextExercise = api.exercises[nextIndex];
      setWeights(nextExercise.arrSetWeight || []);
      setRirs(nextExercise.arrSetRIR || []);
      return nextExercise;
    });
  };

  const getPreviousExercise = async () => {
    await saveChanges();
    setMain((prev: any) => {
      const currentIndex = api.exercises.findIndex(
        (e: any) => e.id === prev?.id
      );
      if (currentIndex === -1) return prev;
      const prevIndex =
        (currentIndex - 1 + api.exercises.length) % api.exercises.length;
      setIndex(prevIndex);
      const prevExercise = api.exercises[prevIndex];
      setWeights(prevExercise.arrSetWeight || []);
      setRirs(prevExercise.arrSetRIR || []);
      return prevExercise;
    });
  };

  const handleGoBack = async () => {
    await saveChanges();
    navigation.goBack();
  };

  if (!main) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{main.name.toUpperCase()}</Text>

      <View style={styles.contentContainer}>
        <View style={styles.exerciseCounter}>
          <Text style={styles.counterText}>
            {api.exercises.findIndex((e: any) => e.id === main?.id) + 1} /{" "}
            {api.exercises.length}
          </Text>
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            onPress={getPreviousExercise}
            style={styles.navButton}
            disabled={isSaving}
          >
            <Icon name="chevron-left" size={24} color="#A1D70F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.imagePlaceholder}>
            <Icon name="add-a-photo" size={24} color="#aaaaaa" />
            <Text style={styles.imagePlaceholderText}>add image</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={getNextExercise}
            style={styles.navButton}
            disabled={isSaving}
          >
            <Icon name="chevron-right" size={24} color="#A1D70F" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Series</Text>
        <View style={styles.inputContainer}>
          {weights.map((weight: any, idx: any) => (
            <View key={idx} style={styles.inputWrapper}>
              <TextInput
                value={weight.toString()}
                onChangeText={(text) => handleWeightChange(idx, text)}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>RIR</Text>
        <View style={styles.inputContainer}>
          {rirs.map((rir: any, idx: any) => (
            <View key={idx} style={styles.inputWrapper}>
              <TextInput
                value={rir.toString()}
                onChangeText={(text) => handlerirChange(idx, text)}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          ))}
        </View>
      </View>
     
      <TouchableOpacity 
        onPress={handleGoBack}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={20} color="#161618" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 25,
    fontFamily: "Cochin",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
    fontWeight: "300",
  },
  contentContainer: {
    flex: 1,
  },
  exerciseCounter: {
    alignSelf: 'flex-end',
    backgroundColor: "#28282A",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  counterText: {
    color: "#aaa",
    fontSize: 14,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  navButton: {
    backgroundColor: "#28282A",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    flex: 2,
    height: 200,
    backgroundColor: "#161618",
    borderStyle: "dashed",
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#28282A",
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: "#aaaaaa",
    marginTop: 10,
  },
  sectionTitle: {
    color: "white",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 13,
    textAlign: "center",
    fontFamily: "Cochin",
    fontWeight: "300",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 10,
  },
  inputWrapper: {
    backgroundColor: '#161618',
    width: 60,
    margin: 5,
    borderColor: '#28282A',
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: "#aaa",
    textAlign: "center",
    width: '100%',
    padding: 5,
  },
  backButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    backgroundColor: "#BCFD0E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoutineOneExerciseScreen;