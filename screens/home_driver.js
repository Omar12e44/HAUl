import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from "react-native";
import { useAuth } from "../context/auth";
import { useNavigation } from '@react-navigation/native';
import SERVER_IP from "../components/config";
import Navbar from "../components/navbar";

const HomeDriver = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransporte, setSelectedTransporte] = useState({
    idSolicitud: '',
    cargaId: '',
    contratistaId: '',
    driverId: '',
    origen: '',

  })
  const [solicitudes,setSolicitudes] = useState([])
  const { userId } = useAuth()
  const navigation = useNavigation();
  

  const handlePress = (solicitud) => {
    const newSelectedTransporte = {
      idSolicitud: solicitud.id,
      cargaId: solicitud.carga_id,
      contratistaId: solicitud.contratista_id,
      driverId: solicitud.driver_id,
      origen: solicitud.origen,
      destino: solicitud.destino,
      transporteId: solicitud.transporte_id
    }

    setSelectedTransporte(newSelectedTransporte)
    setModalVisible(true);
  };

  const handleConfirm = () => {
    console.log('transporte que se manda al ongoing: ',  selectedTransporte)
    navigation.navigate('OnGoingMeet', {selectedTransporte: selectedTransporte});
    setModalVisible(false);
  };

  const getSolicitudesUser = async() => {
    try{
      const response = await fetch(`http://${SERVER_IP}:3000/solicitud/${userId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
      }
    })
    if (response.ok) {
      const data = await response.json();
      console.log("datos solicitudes",data)
      return data;
    }
    if  (!response.ok) throw new Error(data.message || "HTTP error!");
    }catch (error){
      console.log("Error al obtener solicitudes del usuario", error);
    } 
  }

  useEffect(()=>{
    getSolicitudesUser().then((data) => data ? setSolicitudes(data) : setSolicitudes([]));
    console.log(solicitudes)
  },[])

  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Solicitudes Disponibles</Text>
      
      {solicitudes.length > 0 && ( // Check if there are solicitudes before rendering the map
        solicitudes.map((solicitud) => (
          <TouchableOpacity activeOpacity={0.8} key={solicitud.id} onPress={() => handlePress(solicitud)}>
            <View style={styles.card}>
              {/* Content of the card with solicitud information */}
              <Text style={styles.cardText}>Origen: {solicitud.origen}</Text>
              <Text style={styles.cardText}>Destino: {solicitud.destino}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      {solicitudes.length === 0 && ( // Display a message if there are no solicitudes
        <Text style={styles.noRequestsText}>No hay solicitudes disponibles en este momento.</Text>
      )}

      
      {/* Modal para confirmar el viaje */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Confirmar viaje?</Text>
            <View style={styles.buttonContainer}>
              <Button title="Confirmar" onPress={handleConfirm} color="black" style={styles.button}/>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="black" style={styles.button} />
            </View>
          </View>
        </View>
      </Modal>
      <Navbar></Navbar>
    </ScrollView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  card: {
    width: "100%",
    height: 120,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 15,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0, // Aparece desde abajo
    width: '100%', // Ocupa todo el ancho de la pantalla
    height: '25%', // Altura hasta la mitad de la pantalla
    borderTopLeftRadius: 30, // Esquinas redondeadas arriba a la izquierda
    borderTopRightRadius: 30, // Esquinas redondeadas arriba a la derecha
    backgroundColor: 'white', // Color de fondo del modal
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      padding: 15,
  },
  modalContent: {
    marginLeft: 40,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
    maxHeight: "50%", // Ajusta la altura máxima del modal
    shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      padding: 15,
  },
  modalText: {
    borderRadius: 90,
    fontSize: 18,
    marginBottom: 20,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
 
});

export default HomeDriver;
