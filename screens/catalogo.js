import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import SERVER_IP from '../components/config';

export default function Catalogo({ route }) {
  const { data, carga } = route.params;
  const { destino, origen, tipoTransporte, city } = data;
  const [operadores, setOperadores] = useState([]);

  const obtenerDatosOperador = async (ciudad, tipoTransporte) => {
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/buscar/operador/${ciudad}/${tipoTransporte}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Datos obtenidos del servidor:', data);
        return data;
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Error al obtener datos del servidor:', error);
    }
  };

  useEffect(() => {
    obtenerDatosOperador(city, tipoTransporte).then((data) => {
      setOperadores(data);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Información de operadores</Text>
        {operadores.map((operador, index) => (
          <View key={index} style={styles.operadorContainer}>
            <Text>Operador: {operador.user_name}</Text>
            <Text>Tipo de transporte: {operador.transportTipo}</Text>
            <Text>Color: {operador.transport_color}</Text>
            <Text>Descripción: {operador.transport_description}</Text>
            <Text>Año: {operador.transport_year}</Text>
            <Text>Placas: {operador.transport_plate}</Text>
            <Text>Ciudad: {operador.user_city}</Text>
            <Text>Email: {operador.user_email}</Text>
            <Image
              source={{ uri: operador.transport_photoUrl }}
              style={styles.imagenTransporte}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  container: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  operadorContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },
  imagenTransporte: {
    width: '100%',
    height: 200,
    marginTop: 10,
    resizeMode: 'cover',
  },
});
