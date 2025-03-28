import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import { Button, Dialog } from "antd-mobile";
import { LeftOutline, DeleteOutline } from "antd-mobile-icons";

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

interface Day {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Routine {
  id: number;
  name: string;
  days: Day[]; // Cambiado de Record<string, Day> a Day[]
}

interface DeleteRoutineExercisesScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const DeleteRoutineExercisesScreen = ({ navigation, route }: DeleteRoutineExercisesScreenProps) => {
  const { dayID, dayName, routineID, routineName } = route.params;
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [currentDay, setCurrentDay] = useState<Day | null>(null);
  const [visible, setVisible] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);
        
        // Buscar la rutina y día correspondiente
        const foundRoutine = routinesList.find(item => item.id === routineID);
        if (foundRoutine) {
          const foundDay = foundRoutine.days.find(day => day.id === dayID);
          setCurrentDay(foundDay || null);
        }
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchRoutines);
    fetchRoutines();
    return unsubscribe;
  }, [routineID, dayID, navigation]);

  const showDeleteDialog = (exerciseId: string) => {
    setExerciseToDelete(exerciseId);
    setVisible(true);
  };

  const hideDeleteDialog = () => {
    setVisible(false);
    setExerciseToDelete(null);
  };

  const confirmDelete = async () => {
    if (exerciseToDelete && currentDay) {
      try {
        const updatedRoutines = routines.map(routine => {
          if (routine.id === routineID) {
            // Encontrar el día a actualizar
            const updatedDays = routine.days.map(day => {
              if (day.id === dayID) {
                // Filtrar el ejercicio a eliminar
                const updatedExercises = day.exercises.filter(
                  ex => ex.id !== exerciseToDelete
                );
                return { ...day, exercises: updatedExercises };
              }
              return day;
            });
            
            return { ...routine, days: updatedDays };
          }
          return routine;
        });

        await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
        setRoutines(updatedRoutines);
        
        // Actualizar el día actual en el estado
        const updatedDay = updatedRoutines
          .find(r => r.id === routineID)
          ?.days.find(d => d.id === dayID);
        setCurrentDay(updatedDay || null);
      } catch (error) {
        console.error("Error al eliminar ejercicio:", error);
      }
    }
    hideDeleteDialog();
  };

  const goBack = () => navigation.goBack();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BCFD0E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ELIMINAR EJERCICIOS</Text>

      {currentDay?.exercises?.length ? (
        currentDay.exercises.map((exercise) => (
          <Button
            key={exercise.id}
            onClick={() => showDeleteDialog(exercise.id)}
            style={styles.exerciseButton}
          >
            <Text style={styles.exerciseButtonText}>
              {exercise.name}
            </Text>

            <View style={styles.deleteIconContainer}>
              <DeleteOutline style={styles.deleteIcon} />
            </View>

            <View style={styles.buttonDecorationRed} />
          </Button>
        ))
      ) : (
        <Text style={styles.noExercisesText}>No hay ejercicios disponibles</Text>
      )}

      <Dialog
        visible={visible}
        content={
          <Text style={styles.dialogText}>
            ¿Estás seguro de que deseas eliminar este ejercicio?
          </Text>
        }
        actions={[
          [
            {
              key: "cancel",
              text: "Cancelar",
              onClick: hideDeleteDialog,
              style: styles.cancelButton,
            },
            {
              key: "delete",
              text: "Eliminar",
              bold: true,
              danger: true,
              onClick: confirmDelete,
              style: styles.deleteButton,
            },
          ],
        ]}
        bodyStyle={styles.dialogBody}
      />

      <View style={styles.backButtonContainer}>
        <Button
          style={styles.backButton}
          onClick={goBack}
        >
          <LeftOutline style={styles.backIcon} />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#161618",
    justifyContent: "center",
    alignItems: "center",
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
  exerciseButton: {
    fontFamily: "Cochin",
    fontWeight: "300",
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
  },
  exerciseButtonText: {
    color: "white",
    fontSize: 17,
    margin: 3,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
  },
  noExercisesText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Cochin",
  },
  deleteIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
    height: "100%",
    width: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    position: "absolute",
    right: 11,
    top: 10,
    color: "#161618",
    fontWeight: "bold",
  },
  buttonDecorationRed: {
    position: "absolute",
    width: 100,
    height: 100,
    right: -60,
    bottom: -20,
    borderRadius: 10,
    backgroundColor: "#C70000",
    transform: [{ rotate: "25deg" }],
  },
  addButton: {
    fontFamily: "Cochin",
    fontWeight: "300",
    fontSize: 17,
    color: "white",
    borderColor: "#28282A",
    backgroundColor: "#28282A",
    textTransform: "uppercase",
    marginTop: 10,
    width: "80%",
    height: 100,
    maxWidth: 300,
    borderStyle: "solid",
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    position: "relative",
    display: "flex",
  },
  addButtonTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    width: "70%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    margin: 3,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
    lineHeight: 30,
  },
  addIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
    height: "100%",
    width: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    fontSize: 40,
    borderWidth: 0,
    color: "#28282A",
    borderColor: "#28282A",
  },
  buttonDecorationGreen: {
    position: "absolute",
    width: 150,
    height: 120,
    right: -60,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: "#BCFD0E",
    transform: [{ rotate: "30deg" }],
  },
  dialogBody: {
    backgroundColor: "#161618",
    borderColor: "#161618",
  },
  dialogText: {
    color: "white",
    borderColor: "#161618",
  },
  cancelButton: {
    color: "white",
    borderColor: "#000",
  },
  deleteButton: {
    color: "#161618",
    backgroundColor: "#C70000",
    borderColor: "#000",
  },
  backButtonContainer: {
    position: "absolute",
    bottom: 80,
    left: 40,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  backButton: {
    fontSize: 17,
    color: "#161618",
    borderColor: "#A1D70F",
    backgroundColor: "#BCFD0E",
    width: 40,
    height: 40,
    maxWidth: 300,
    borderStyle: "solid",
    borderRadius: 30,
  },
  backIcon: {
    position: "absolute",
    right: 12,
    top: 10,
    color: "#161618",
    fontWeight: "bold",
  },
  deleteDayButtonContainer: {
    position: "absolute",
    bottom: 80,
    right: 40,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  deleteDayButton: {
    fontSize: 17,
    color: "#161618",
    borderColor: "#A90000",
    backgroundColor: "#C70000",
    width: 40,
    height: 40,
    maxWidth: 300,
    borderStyle: "solid",
    borderRadius: 30,
  },
  deleteDayIcon: {
    position: "absolute",
    right: 11,
    top: 10,
    color: "#161618",
    fontWeight: "bold",
  },
});

export default DeleteRoutineExercisesScreen;