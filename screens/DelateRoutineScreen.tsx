import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import { Button, Dialog, NavBar, Space } from "antd-mobile";
import { DeleteOutline, LeftOutline, AddOutline } from "antd-mobile-icons";

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

interface Routine {
  id: string;
  name: string;
}

const DeleteRoutineScreen = ({ navigation }: HomeScreenProps) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [visible, setVisible] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
  

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList: Routine[] = storedData
          ? JSON.parse(storedData)
          : [];
        setRoutines(routinesList);
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
      }
    };

    fetchRoutines();
  }, []);

  const showDeleteDialog = (routine: Routine) => {
    setRoutineToDelete(routine);
    setVisible(true);
  };

  const hideDeleteDialog = () => {
    setVisible(false);
    setRoutineToDelete(null);
  };

  const confirmDelete = async () => {
    if (routineToDelete) {
      try {
        const updatedRoutines = routines.filter(
          (routine) => routine.id !== routineToDelete.id
        );
        await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
        setRoutines(updatedRoutines);
      } catch (error) {
        console.error("Error al eliminar rutina:", error);
      }
    }
    hideDeleteDialog();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#161618" }}>
      <Text
        style={{
          color: "white",
          fontSize: 25,
          fontFamily: "Cochin",
          textAlign: "center",
          marginTop: 20,
          marginBottom: 40,
          fontWeight: "light",
        }}
      >
        ELIMINAR RUTINA
      </Text>

      {routines.map((item: any, index: any) => (
        <Button
          key={index}
          onClick={() => showDeleteDialog(item)}
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
            {item.name}
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
            <DeleteOutline
              style={{
                position: "absolute",
                right: 11,
                top: 10,
                color: "#161618",
                fontWeight: "bold",
              }}
            />
          </View>

          <View
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              right: -60,
              bottom: -20,
              borderRadius: 10,
              backgroundColor: "#C70000",
              transform: [{ rotate: "25deg" }],
            }}
          />
        </Button>
      ))}
     
      <Dialog
        visible={visible}
        content={
          <Text style={{ color: "white",borderColor: "#161618" }}>
            {" "}
            ¿Estás seguro de que deseas eliminar la rutina "
            {routineToDelete?.name}"?
          </Text>
        }
        actions={[
          [
            {
              key: "cancel",
              text: "Cancelar",
              onClick: hideDeleteDialog,
              style: { color: "white",borderColor: "#000" }, // Texto blanco para el botón
            },
            {
              key: "delete",
              text: "Eliminar",
              bold: true,
              danger: true,
              onClick: confirmDelete,
              style: { color: "#161618", backgroundColor: "#C70000",borderColor: "#000" }, // Texto blanco para el botón
            },
          ],
        ]}
        bodyStyle={{
          backgroundColor: "#161618", // Fondo negro
          borderColor: "#161618", // Borde oscuro
        }}
      />

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
    </View>
  );
};

export default DeleteRoutineScreen;
