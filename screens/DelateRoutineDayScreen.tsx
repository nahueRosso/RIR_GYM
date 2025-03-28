import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import { Button, Dialog } from "antd-mobile";
import { LeftOutline, DeleteOutline } from "antd-mobile-icons";

interface DaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Day {
  id: string;
  name: string;
  priorityExercises: string[];
}

interface Routine {
  id: number;
  name: string;
  days: Record<string, Day>;
}

const DeleteRoutineDayScreen = ({ navigation, route }: DaysScreenProps) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [visible, setVisible] = useState(false);
  const [dayToDelete, setDayToDelete] = useState<{ routineId: number; dayId: string } | null>(null);
  const { routineID, routineName } = route.params;

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        let routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
        
        // Normalizar la estructura de days para que siempre sea objeto
        routinesList = routinesList.map(routine => {
          if (Array.isArray(routine.days)) {
            // Convertir array de días a objeto
            const daysObj = routine.days.reduce((acc: Record<string, Day>, day: Day) => {
              acc[day.id] = day;
              return acc;
            }, {});
            return { ...routine, days: daysObj };
          }
          return routine;
        });
        
        setRoutines(routinesList);
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };
    fetchRoutines();
  }, []);

  const showDeleteDialog = (routineId: number, dayId: string) => {
    setDayToDelete({ routineId, dayId });
    setVisible(true);
  };

  const hideDeleteDialog = () => {
    setVisible(false);
    setDayToDelete(null);
  };

  const confirmDelete = async () => {
    if (dayToDelete) {
      try {
        const updatedRoutines = routines.map(routine => {
          if (routine.id === dayToDelete.routineId) {
            const updatedDays = { ...routine.days };
            delete updatedDays[dayToDelete.dayId];
            return { ...routine, days: updatedDays };
          }
          return routine;
        });

        await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
        setRoutines(updatedRoutines);
      } catch (error) {
        console.error("Error al eliminar día:", error);
      }
    }
    hideDeleteDialog();
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>ELIMINAR DÍA</Text>

      {routines
        .filter((item) => item.id === routineID)
        .map((item) =>
          Object.entries(item.days).map(([dayId, day]) => (
            <Button
              key={dayId}
              onClick={() => showDeleteDialog(item.id, dayId)}
              style={styles.dayButton}
            >
              <Text style={styles.dayButtonText}>
                {day.priorityExercises[0]}{" "}
                {day.priorityExercises[1] ? `- ${day.priorityExercises[1]}` : ""}
              </Text>

              <View style={styles.deleteIconContainer}>
                <DeleteOutline style={styles.deleteIcon} />
              </View>

              <View style={styles.buttonDecoration} />
            </Button>
          ))
        )}

      <Dialog
        visible={visible}
        content={
          <Text style={styles.dialogText}>
            ¿Estás seguro de que deseas eliminar este día?
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
          onClick={() => navigation.goBack()}
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
  dayButton: {
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
  dayButtonText: {
    color: "white",
    fontSize: 17,
    margin: 3,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
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
  buttonDecoration: {
    position: "absolute",
    width: 100,
    height: 100,
    right: -60,
    bottom: -20,
    borderRadius: 10,
    backgroundColor: "#C70000",
    transform: [{ rotate: "25deg" }],
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
});

export default DeleteRoutineDayScreen;