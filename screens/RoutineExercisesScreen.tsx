import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Routine {
  id: number;
  name: string;
  days: any;
}

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const RoutineExercisesScreen = ({ navigation, route }: CreateDaysScreenProps) => {
  const { dayID, dayName, routineID, routineName } = route.params;
  const [routines, setRoutines] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        console.log("📦 Data from AsyncStorage:", storedData);
    
        const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
        console.log("📜 Parsed routines list:", routinesList);
    
        const foundRoutine = routinesList.find((item) => item.id === routineID);
        console.log("🔍 Found routine:", foundRoutine);
    
        if (!foundRoutine) {
          console.warn("❌ Rutina no encontrada.");
          return;
        }
        const daysArray = Object.values(foundRoutine.days)
        console.log("📅 foundRoutine.days:", daysArray);
        if (!Array.isArray(daysArray)) {
          console.warn("❌ 'days' no es un array.");
          return;
        }
    
        const foundDay = daysArray.find((day: any) => day.id === dayID);
        console.log("📌 Found day:", foundDay);
    
        if (!foundDay) {
          console.warn("❌ Día no encontrado.");
          return;
        }
    
        setRoutines(foundDay);
      } catch (error) {
        console.error("🚨 Error al cargar rutinas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', fetchRoutines);
    fetchRoutines();
    return unsubscribe;
  }, [routineID, dayID, navigation]);

  const goAddExe = () => {
    navigation.navigate("CreateExercises", {
      dayID: dayID,
      dayName: dayName,
      routineName: routineName,
    });
  };

  useEffect(() => {
    console.log("Estado actualizado:", routines);
  }, [routines]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EJERCICIOS</Text>
<View style={{display:'flex'}}>
      {Array.isArray(routines?.exercises) && routines.exercises.length > 0 ? (
        <FlatList
          data={routines.exercises}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("RoutineOneExercise", {
                  routineID: item.id,
                  routineName: item.name,
                  apis: routines,
                  dayID: dayID,
                  routineNameFirst: routineName,
                })
              }
              style={styles.exerciseButton}
            >
              <Text style={styles.exerciseText}>{item.name}</Text>
              <View style={styles.exerciseDecoration} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noExercisesText}>No hay ejercicios disponibles</Text>
      )}

      <TouchableOpacity onPress={goAddExe} style={styles.addButton}>
        <View style={styles.addButtonTextContainer}>
          <Text style={styles.addButtonText}>ADD NEW{"\n"}EXERCISES</Text>
        </View>
        <View style={styles.addButtonIconContainer}>
          <Icon name="add" size={40} color="#28282A" />
        </View>
        <View style={styles.addButtonDecoration} />
      </TouchableOpacity>

      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={20} color="#161618" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate("DelateRoutineExercises", {
            dayID: dayID,  
            dayName: dayName, 
            routineID: routineID, 
            routineName: routineName,
          })} 
          style={styles.deleteButton}
        >
          <Icon name="delete" size={20} color="#161618" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  exerciseButton: {
    backgroundColor: "#28282A",
    margin: 10,
    width: "80%",
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    position: "relative",
    padding: 15,
  },
  exerciseText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
  },
  exerciseDecoration: {
    position: "absolute",
    width: 100,
    height: 100,
    right: -60,
    bottom: -20,
    borderRadius: 10,
    backgroundColor: "#BCFD0E",
    transform: [{ rotate: "25deg" }],
  },
  noExercisesText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Cochin",
  },
  addButton: {
    backgroundColor: "#28282A",
    // marginTop: 20,
    width: "80%",
    height: 100,
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    position: "relative",
  },
  addButtonTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    width: "70%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
    lineHeight: 30,
  },
  addButtonIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
    height: "100%",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDecoration: {
    position: "absolute",
    width: 150,
    height: 120,
    right: -60,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: "#BCFD0E",
    transform: [{ rotate: "30deg" }],
  },
  navigationContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  backButton: {
    backgroundColor: "#BCFD0E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#C70000",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RoutineExercisesScreen;