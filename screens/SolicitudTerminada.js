import React, { useState, useEffect } from 'react';
import SERVER_IP from '../components/config';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from "react-native";

export function SolicitudTerminada({ route }) {
const {solicitudId} = route.params.solicitudId
 const [solicitud, setSolicitud] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await fetch(`http://${SERVER_IP}:3000/solicitud/solicitudId/${solicitudId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        if (!response.ok) {
          throw new Error('Error al obtener la solicitud');
        }
        const data = await response.json();
        console.log('solicituddata llega: ', data);
        setSolicitud(data);
      } catch (error) {
        console.error('Error al traer la solicitud:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
 }, [solicitudId]);


 return (
    <View style={styles.container}>
      <Text>VIAJE TERMINADO</Text>
    </View>
 );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      fontFamily: 'Inter',
      backgroundColor: 'white'
    },
})