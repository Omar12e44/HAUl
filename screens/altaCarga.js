import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebaseConfig';
import SERVER_IP from "../components/config";
import { useAuth } from '../context/auth';

export default function AltaCarga() {
  const [peso, setPeso] = useState('');
  const [consideraciones, setConsideraciones] = useState('');
  const [largo, setLargo] = useState('');
  const [ancho, setAncho] = useState('');
  const [altura, setAltura] = useState('');
  const [cargas, setCargas] = useState([]); 
  const [destino, setDestino] = useState('');
  const {userId} = useAuth()
  const [nombre, setNombre] = useState()


  useEffect(() => {
    // Obtén la instancia del objeto de autenticación de Firebase
    const auth = getAuth(app);
  
    // Observa el estado de la autenticación para detectar cambios (inicio o cierre de sesión)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid; // Obtiene el UID del usuario autenticado
        console.log('UID del usuario autenticado:', uid);
        // Puedes almacenar el UID en un estado si es necesario
      } else {
        // Si no hay usuario autenticado, puedes manejarlo aquí
        console.log('No hay usuario autenticado');
      }
    });
  
    // Limpia el observador cuando el componente se desmonta
    return () => unsubscribe();
  }, []);



  useEffect(() => {
    // Query para obtener las cargas del usuario
    const fetchCargas = async () => {
      try {
        const response = await fetch(`http://${SERVER_IP}:3000/cargas/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCargas(data); // Almacena las cargas en la variable de estado
        } else {
          throw new Error('Este usario no tiene cargas, Registra tu primera carga');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Este usario no tiene cargas, Registra tu primera carga ');
      }
    };

    fetchCargas(); // Llama a la función para obtener las cargas del usuario
  }, [userId]);
  

  const guardarCarga = async () => {
    // Obtén la instancia del objeto de autenticación de Firebase
    const auth = getAuth(app);
  
    // Observa el estado de la autenticación para detectar cambios (inicio o cierre de sesión)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid; // Obtiene el UID del usuario autenticado
  
        // Verificar si algún campo está vacío
        if (!peso || !consideraciones || !largo || !ancho || !altura || !destino || !nombre) {
          Alert.alert('Todos los campos son requeridos');
          return;
        }
  
        try {
          const response = await fetch(`http://${SERVER_IP}:3000/cargar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: uid, // Incluye el UID del usuario
              peso: parseFloat(peso), // Convertir a número
              consideraciones,
              largo: parseFloat(largo), // Convertir a número
              ancho: parseFloat(ancho), // Convertir a número
              altura: parseFloat(altura), // Convertir a número
              destino,
              nombre: nombre
            }),
          });
  
          if (response.ok) {
            Alert.alert('Carga guardada exitosamente');
            // Limpiar los campos después de guardar la carga
            setPeso('');
            setConsideraciones('');
            setLargo('');
            setAncho('');
            setAltura('');
            setDestino('');
          } else {
            throw new Error('Error en el servidor');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error al guardar la carga');
        }
      } else {
        // Si no hay usuario autenticado, puedes manejarlo aquí
        console.log('No hay usuario autenticado');
      }
    });
  };

  const handleBorrarCarga = async (id) => {
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/cargas/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setCargas(prevCargas => prevCargas.filter(carga => carga.id !== id));
        Alert.alert('Carga eliminada exitosamente');
      } else {
        throw new Error('Error al borrar la carga');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error al borrar la carga');
    }
  };
  
  return (
    <View style={styles.carga}>
      <View style={styles.barnav}>
        <Image source={require('../assets/haul.png')} style={styles.profile} />
      </View>

      <View style={styles.fondo}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Alta de carga</Text>
        </View>
        <View style={styles.formulario}>
        <TextInput
            placeholder="Nombre:"
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            placeholder="Peso de carga:"
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric" // Teclado numérico
          />
          <TextInput
            placeholder="Consideraciones de carga:"
            style={styles.input}
            value={consideraciones}
            onChangeText={setConsideraciones}
          />
          <TextInput
            placeholder="Largo (m):"
            style={styles.input}
            value={largo}
            onChangeText={setLargo}
            keyboardType="numeric" // Teclado numérico
          />
          <TextInput
            placeholder="Ancho (m):"
            style={styles.input}
            value={ancho}
            onChangeText={setAncho}
            keyboardType="numeric" // Teclado numérico
          />
          <TextInput
            placeholder="Altura (m):"
            style={styles.input}
            value={altura}
            onChangeText={setAltura}
            keyboardType="numeric" // Teclado numérico
          />
          <TextInput
            placeholder="Destino:"
            style={styles.input}
            value={destino}
            onChangeText={setDestino}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={guardarCarga}>
          <Text style={styles.searchButtonText}>Guardar</Text>
        </TouchableOpacity>

        <ScrollView style={styles.scrollView}>
        {cargas.map((carga, index) => (
          <View key={index} style={styles.cargaItem}>
            <Text>{`Peso: ${carga.peso}, Consideraciones: ${carga.consideraciones}`}</Text>
            <Text>{`Status: ${carga.status}`}</Text>
            <Text>{`Dimensiones: ${carga.largo} x ${carga.ancho} x ${carga.altura}`}</Text>
            <Text>{`Destino: ${carga.destino}`}</Text>
            <Text>{`Comentarios: ${carga.comentarios}`}</Text>
            <TouchableOpacity onPress={() => handleBorrarCarga(carga.id)} style={styles.botonBorrar}>
              <Text style={styles.textoBotonBorrar}>Borrar</Text>
            </TouchableOpacity>
          </View>
        ))} 
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carga: {
    flex: 1,
  },
  formulario: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fondo: {
    paddingVertical: 20,
    backgroundColor: '#cccccc40',
    borderRadius: 30,
    marginVertical: 30,
  },
  profile: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  barnav: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'center',
  },
  tituloContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    paddingHorizontal: 15,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 10,
    padding: 10,
    width: 350,
    marginTop: 10,
  },
  searchButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scrollView: {
    width: '100%',
    maxHeight: 300, // Altura máxima del ScrollView
    borderWidth: 1, // Borde para resaltar el ScrollView
    borderColor: '#ddd', // Color del borde
    borderRadius: 10, // Borde redondeado
  },
  botonBorrar: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  textoBotonBorrar: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
