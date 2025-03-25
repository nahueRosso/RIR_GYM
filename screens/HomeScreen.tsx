import React from 'react';
import { Appbar, Button } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import { View, Text} from 'react-native';
import { useEffect, useState } from 'react';
import db from '../db.json';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="GYM RIR" />
      </Appbar.Header>
      <View>
      {db.map(user => (
        <Text key={user._id}>{user.name} - {user.age} años</Text>
      ))}
    </View>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Routines')}
        style={{ margin: 20 }}
      >
        Ir a las rutinas
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('CreateRoutine')}
        style={{ margin: 20 }}
      >
        CreateRoutine
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('DelateRoutine')}
        style={{ margin: 20 }}
      >
        DelateRoutine
      </Button>
    </>
  );
}

