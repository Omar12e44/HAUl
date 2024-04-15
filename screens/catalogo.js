import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import SERVER_IP from '../components/config';
import { useAuth } from '../context/auth';
import Navbar from '../components/navbar';
import { TouchableOpacity } from 'react-native';

export default function Catalogo({ route }) {
  const { data, carga } = route.params;
  const { tipoTransporte, city } = data;
  
  const [operadores, setOperadores] = useState([]);
  const [operadorSeleccionado, setOperadorSeleccionado] = useState(null);
  
  const { userId } = useAuth()

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
        console.log('Datos obtenidos del servidor de operadores encontrados que coinciden con los criterios:', data);
        return data;
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Error al obtener datos del servidor:', error);
    }
  };
  
  const handleSeleccionar = async ({operador}) => {
    console.log('operador que llega: ', operador.transport_driver)
    console.log('carga: ', carga)
    console.log('data: ', data)
    
    setOperadorSeleccionado(operador);
    
    const response = await handleCreateSolicitud({
      contratistaId: userId, 
      driverId: operador.transport_driver, 
      cargaId: carga.id, 
      origen: data.origen, 
      destino: data.destino
    })
    console.log('Respuesta de creacion de solicitud: ', response)
    if (response.ok) {
      // Navegar a la pantalla `onGoing` después de crear la solicitud
      navigation.navigate('onGoing', {
        operadorSeleccionado,
        carga,
        data,
      });
      Alert.alert('Solicitud Creada Correctamente!');
    } else {
      Alert.alert('Error al crear solicitud');
    }
  };
  
  const handleCreateSolicitud = async ({contratistaId, driverId, cargaId, origen, destino}) => {
    // Redireccionar a la pantalla de creación de solicitudes con los parametros necesarios
    // Agregar un idOperador y una horaLlegada para que se pueda completar la solicitud
    // Al presionar "Crear Solicitud" mostrará una alerta con el mensaje "Solicitud Creado Correctamente!"
    // Si no se completa correctamente mostrara "Faltan campos requeridos"
    // Se podría agregar validaciones como verificar si las ciudades son diferentes o si la hora es menor a la actual
    try{
      const response = await fetch(`http://${SERVER_IP}:3000/crearSolicitud/${contratistaId}/${driverId}/${cargaId}/${origen}/${destino}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
    })
      return response 
    }catch(error){
      console.log("ERROR AL CREAR SOLICITUD", error)
    }

    
  };

  useEffect(() => {
    obtenerDatosOperador(city, tipoTransporte).then((data) => {
      setOperadores(data);
    });
    console.log('User id from auth: ', userId);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Información de operadores</Text>
        {operadores.map((operador, index) => (
          <View key={index} style={styles.operadorContainer}>
            <View style={styles.infoTransporte}>
              <View>
                <Text>{operador.user_name}</Text>
                <Text>{operador.transport_color}</Text><Text>{operador.transport_year}</Text>
                <Text>{operador.transport_plate}</Text>
                <Text>{operador.user_city}</Text>
              </View>
              <Image
                source={{ uri: operador.transport_photoUrl }}
                style={styles.imagenTransporte}
              />
            </View>
            <TouchableOpacity onPress={() => handleSeleccionar({operador})}>
              <Text style={styles.botonSeleccion}>Seleccionar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
        <Navbar/>
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
    height: 100,
    width: 100,
    marginTop: 10,
    resizeMode: 'cover',
  },
  botonSeleccion: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  infoTransporte:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
