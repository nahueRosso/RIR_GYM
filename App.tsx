import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { initDatabase } from './database/Database';
import { View, Text, ActivityIndicator } from 'react-native';

// Importar las pantallas
import HomeScreen from './screens/HomeScreen';
import RoutinesScreen from './screens/RoutinesScreen';
import CreateDaysRoutinesScreen from './screens/CreateDaysRoutinesScreen';
import CreateRoutineScreen from './screens/CreateRoutineScreen';
import DelateRoutineScreen from './screens/DelateRoutineScreen';
import RoutinesDayScreen from './screens/RoutinesDayScreen' 
import CreateExercisesScreen from './screens/CreateExercisesScreen'
import RoutineExercisesScreen from './screens/RoutineExercisesScreen'
import RoutineOneExerciseScreen from './screens/RoutineOneExerciseScreen'

// Configuración de navegación
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    // Inicializar la base de datos al cargar la aplicación
    // initDatabase()
    //   .then(() => {
    //     console.log('Base de datos inicializada con éxito');
    //     setIsLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('Error al inicializar la base de datos:', error);
    //     setDbError(error);
    //     setIsLoading(false);
    //   });
  }, []);

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>Inicializando base de datos...</Text>
  //     </View>
  //   );
  // }

  // if (dbError) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text style={{ color: 'red' }}>Error al inicializar la base de datos</Text>
  //     </View>
  //   );
  // }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Routines" component={RoutinesScreen} />
          <Stack.Screen name="RoutinesDay" component={RoutinesDayScreen} />
          <Stack.Screen name="RoutineExercises" component={RoutineExercisesScreen} />
          <Stack.Screen name="RoutineOneExercise" component={RoutineOneExerciseScreen} />
          <Stack.Screen name="CreateDays" component={CreateDaysRoutinesScreen} />
          <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
          <Stack.Screen name="CreateExercises" component={CreateExercisesScreen} />
          <Stack.Screen name="DelateRoutine" component={DelateRoutineScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}