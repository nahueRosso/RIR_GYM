import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';
import { ConfigProvider } from 'antd-mobile';
import enUS from 'antd-mobile/es/locales/en-US';

// Importar las pantallas
import HomeScreen from './screens/HomeScreen';
import RoutinesScreen from './screens/RoutinesScreen';
import CreateDaysRoutinesScreen from './screens/CreateDaysRoutinesScreen';
import CreateRoutineScreen from './screens/CreateRoutineScreen';
import RoutinesDayScreen from './screens/RoutinesDayScreen' 
import CreateExercisesScreen from './screens/CreateExercisesScreen'
import RoutineExercisesScreen from './screens/RoutineExercisesScreen'
import RoutineOneExerciseScreen from './screens/RoutineOneExerciseScreen'
import DelateRoutineScreen from './screens/DelateRoutineScreen';
import DelateRoutineDayScreen from './screens/DelateRoutineDayScreen';
import DelateRoutineExercisesScreen from './screens/DelateRoutineExercisesScreen';

// Configuración de navegación
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // useEffect(() => {

  // }, []);


  return (
    <ConfigProvider locale={enUS}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Routines" component={RoutinesScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="RoutinesDay" component={RoutinesDayScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="RoutineExercises" component={RoutineExercisesScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="RoutineOneExercise" component={RoutineOneExerciseScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="CreateDays" component={CreateDaysRoutinesScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="CreateExercises" component={CreateExercisesScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="DelateRoutine" component={DelateRoutineScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="DelateRoutineDay" component={DelateRoutineDayScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="DelateRoutineExercises" component={DelateRoutineExercisesScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ConfigProvider>
  );
}