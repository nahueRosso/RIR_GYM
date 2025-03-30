import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Alert, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Routine {
  id: number;
  name: string;
  days: any;
}

const RoutineScreen = ({ navigation, route }: DaysScreenProps) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const { routineID, routineName } = route.params;

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };

    fetchRoutines();

    const unsubscribe = navigation.addListener("focus", fetchRoutines);
    return () => unsubscribe();
  }, [navigation]);

  
  const daysObject = routines.find(item => item.id === routineID)?.days || {};
  const daysArray = Object.values(daysObject); // Convertir a array

  // console.log("Days array:", daysArray); // Verificar en la consola que ahora es un array


  const goAddDays = () => {
    navigation.navigate("CreateDays", { routineName: routineName,routineID:routineID });
  };

  const navigateToExercises = (day: any) => {
    navigation.navigate("RoutineExercises", {
      dayID: day.id,
      dayName: day.name,
      routineID: routineID,
      routineName: routineName,
    });
  };

  const deleteRoutineDay = () => {
    navigation.navigate("DelateRoutineDay", {
      routineID: routineID,
      routineName: routineName,
    });
  };

  const renderDayItem = ({ item: day }: { item: any }) => (
    
  <TouchableOpacity
      style={styles.dayButton}
      onPress={() => navigateToExercises(day)}
    >
      <Text style={styles.dayButtonText}>
        {day.priorityExercises[0]>9?
          (day.priorityExercises[1]>9?`${day.priorityExercises[0]} - ${day.priorityExercises[0]}`:day.priorityExercises[0]):
        day.priorityExercises[0]}
      </Text>
      
      <View style={styles.dayTag}>
        {/* <Text style={styles.dayTagText}>{day.name.slice(0, 3)}</Text> */}
      </View>
      
      <View style={styles.dayDecoration} />
    </TouchableOpacity>
  );


  // console.log(daysArray)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AGREGAR DIAS</Text>

<View style={{display:'flex'}}>

<FlatList
        data={daysArray}
        renderItem={renderDayItem}
        keyExtractor={(item:any) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        onPress={goAddDays} 
        style={styles.addButton}
      >

        <View style={styles.addButtonTextContainer}>
          <Text style={styles.addButtonText}>ADD NEW{"\n"}DAYS</Text>
        </View>
        
        <View style={styles.addButtonIconContainer}>
          <Icon name="add" size={40} color="#28282A" />
        </View>
        
        <View style={styles.addButtonDecoration} />
      </TouchableOpacity>

      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={20} color="#161618" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={deleteRoutineDay} 
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
  title: {
    color: "white",
    fontSize: 25,
    fontFamily: "Cochin",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
    fontWeight: "300",
  },
  listContent: {
    paddingBottom: 20,
  },
  dayButton: {
    backgroundColor: "#28282A",
    marginVertical: 10,
    width: "80%",
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    position: "relative",
    padding: 15,
  },
  dayButtonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
  },
  dayTag: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  dayTagText: {
    
    color: "black",
    fontSize: 15,
    fontFamily: "Cochin",
    textAlign: "left",
    fontWeight: "300",
    marginLeft: -55,
    // marginTop:15,
    zIndex:10000,
  },
  dayDecoration: {
    position: "absolute",
    width: 100,
    height: 100,
    left: -60,
    bottom: -20,
    borderRadius: 10,
    zIndex:0,
    backgroundColor: "#BCFD0E",
    transform: [{ rotate: "-35deg" }],
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
  navigationButtons: {
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

export default RoutineScreen;