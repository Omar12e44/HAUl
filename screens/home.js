import SERVER_IP from "../components/config";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Text, StyleSheet, View, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Dimensions, FlatList, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox  from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import app from '../credenciales';
import Navbar from "../components/navbar";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import debounce from 'lodash.debounce';


export default function Home() {
  let typingTimer = useRef(null); 

  const auth = getAuth();
  const uid = auth.currentUser.uid;
  
  const [cargas, setCargas] = useState([]);
  const [transportOptions, setTransportOptions] = useState([]);

  const [selectingLocation, setSelectingLocation] = useState(false); 
  
  const [modalVisible, setModalVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const [destino, setDestino] = useState('');
  const [destinoFormateado, setDestinoFormateado] = useState('');
  
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  
  const estados =[
    'Penamiller',
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Coahuila',
    'Colima',
    'Ciudad de México',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
  ];
  
  const [selectedEstado, setSelectedEstado] = useState('');  
  
  const navigation = useNavigation();
  
  const [origin, setOrigin] = useState({
    latitude: 20.657003,
    longitude: -100.4006304,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  
  const [selectedCarga, setSelectedCarga] = useState(null);
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    tipoTransporte: '',
    city: '',
  });
  const mapRef = useRef(null);
  
  useEffect(() => {
    getLocationPermission();
    obtenerCargasUsuario(uid);
    obtenerOpcionesTransporte();
    getLocationPermission();
    handleLocation();
    return () => {
      clearTimeout(typingTimer.current);
    };
  }, []);
    
  const obtenerCargasUsuario = async (uid) => {
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/cargas/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const cargasData = await response.json();
        console.log("Cargas obtenidas:", cargasData);
        setCargas(cargasData);
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Error al obtener las cargas del usuario:', error);
    }
  };

  const obtenerOpcionesTransporte = async () => {
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/options/transport_type`);
      if (response.ok) {
        const options = await response.json();
        setTransportOptions(options);
      } else {
        throw new Error('Error al obtener las opciones de transporte');
      }
    } catch (error) {
      console.error('Error al obtener opciones de transporte:', error);
    }
  };

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Permiso denegado');
      return;
    }
  
    try {
      let location = await Location.getCurrentPositionAsync({});
  
      // Convert coordinates to formatted address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
  
      if (addressResponse.length > 0) {
        let address = addressResponse[0];
        let fullAddress = `${address.name}, ${address.street}, ${address.city}, ${address.region}, ${address.country}`;
        setFormData(prevState => ({
          ...prevState,
          origen: fullAddress,
          
        }));

        console.log(fullAddress);
      }
    } catch (error) {
      console.error('Error al obtener la ubicación actual:', error);
      alert('Error al obtener la ubicación actual');
    }
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
    setShowInputs(false);
  };



  const handleSearch = () => {
    if (!searching) {
      setShowForm(true);
      setShowInputs(true);
      setSearching(true);
    } else if (showInputs) {
      // Debounce the update of origin state
      const debouncedUpdateOrigin = debounce(() => {
        if (formData.origen !== '') {
          console.log('Origen actualizado:', formData.origen); // Log the updated origin
          console.log('Destino actualizado:', formData.destino);
          console.log('Carga seleccionada:', selectedCarga);
          console.log('Buscando... información que se manda:', formData);
          navigation.navigate('catalogo', {data: formData, carga: selectedCarga});
        }
      }, 1000); // Delay of 1 second
  
      debouncedUpdateOrigin();
    }
  };

  const handleSelectDestino = (data, details = null) => {
    console.log('Details terms: ', details.terms);
    console.log('Details terms: ', details.terms[1].value);
    if (details) {
      const { description } = details;
      console.log('Dirección seleccionada:', description);
      setFormData(prevState => ({
        ...prevState,
        destino: description,
      }));
    }
  };
  

  const handleSelect = (carga) => {
    setSelectedCarga(carga); 
    console.log('Carga seleccionada:', carga);

    setModalVisible(false);
    Alert.alert('Carga seleccionada', `Has seleccionado la carga #${carga.id}`);
  };

  const handleSelectCity = (city)  => {
    console.log('CIudad seleccionada: ', city);
    setFormData(prevState => ({...prevState,
      city: city
    }))
  }

  const handleLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso denegado');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
  
      // Actualiza el estado origin con las coordenadas de la ubicación actual
      setOrigin(currentLocation);
  
      // Mueve el mapa al marcador de la ubicación actual
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...currentLocation,
          latitudeDelta: 0.05, // Ajusta el zoom horizontal
          longitudeDelta: 0.05 // Ajusta el zoom vertical
        }, 1000); // Duración de la animación en milisegundos (opcional)
      }
  
      // También puedes obtener la dirección correspondiente a las coordenadas aquí si lo necesitas
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      if (addressResponse.length > 0) {
        let address = addressResponse[0];
        // Construir la dirección completa
        let fullAddress = `${address.name}, ${address.street}, ${address.city}, ${address.region}, ${address.country}`;
        // Establecer la dirección en el estado formData como el origen predeterminado
        setFormData(prevState => ({
          ...prevState,
          origen: fullAddress,
        }));
      }
    } catch (error) {
      console.error('Error al obtener la ubicación actual:', error);
      alert('Error al obtener la ubicación actual');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={origin}
        >
          <Marker
            coordinate={origin}
          />
        </MapView>
        
        <View style={styles.header}>
          <Image source={require('../assets/HaulLogo.png')} style={styles.profile} />
        </View>
        
        <KeyboardAvoidingView style={[styles.form, { marginTop: Dimensions.get('window').height * 0.3 }]} behavior="padding" enabled>
          
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
          
          {showInputs && (
            
            <View style={styles.formInputs}>
              <Picker
                selectedValue={formData.tipoTransporte}
                style={styles.formInput}
                onValueChange={(itemValue, itemIndex) =>
                  setFormData({...formData, tipoTransporte: itemValue})
                }
              >
              
              <Picker.Item label="Selecciona tipo de transporte..." value="" />
                {transportOptions.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>

              <Picker
              selectedValue={selectedEstado}
              onValueChange={handleSelectCity}
              style={styles.formInput}
            >
              <Picker.Item label="Selecciona un estado" value="" />
              {estados.map((estado, index) => (
                <Picker.Item key={index} label={estado} value={estado} />
              ))}
            </Picker>

              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.modalButtonText}>Seleccionar una Carga</Text>
              </TouchableOpacity>
              
              <GooglePlacesAutocomplete
                placeholder="Destino"
                onPress={(data, details = null) => handleSelectDestino(data,details)} 
                  // Aquí puedes manejar la selección de la dirección de destino
                
                query={{
                  key: 'AIzaSyDst622xZldGCfrlLLIBfBB1ozEt5ArbF8',
                  language: 'es', // Puedes especificar el idioma de las sugerencias
                }}
                styles={{
                  container: {
                    flex: 0,
                    width: '100%',
                  },
                  textInputContainer: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    marginTop: 10,
                    width: '100%',
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#ccc',
                    padding: 5,
                    width: '100%',
                  },//*//** */
                  listView: {
                    position: 'absolute',
                    top: 50,
                    left: 10,
                    right: 10,
                    backgroundColor: '#fff',
                    elevation: 3,
                    zIndex: 1000,
                    borderRadius: 5,
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
              />      

<GooglePlacesAutocomplete
  placeholder={formData.origen}
  value={formData.origen} // Asigna el valor del estado al input
  onChangeText={(text) => {
    clearTimeout(typingTimer.current);
    console.log('Texto actual del input:', text);
    // Actualiza el estado formData cuando se cambia el texto del input
    typingTimer.current = setTimeout(() => {
      // Actualizar la variable origen con el texto actual del input
      setFormData(prevState => ({
        ...prevState,
        origen: text,
      }));
    }, 1000); // Espera 1 segundo después de que el usuario haya dejado de escribir
  }}
  onPress={(data, details = null) => {
    // Aquí puedes manejar la selección de la dirección de origen
    if (details) {
      const { description } = details;
      console.log('Dirección seleccionada:', description);
      setFormData(prevState => ({
        ...prevState,
        origen: description,
      }));
    }
  }}
  query={{
    key: 'AIzaSyDst622xZldGCfrlLLIBfBB1ozEt5ArbF8', // Reemplaza con tu propia API key
    language: 'es', // Puedes especificar el idioma de las sugerencias
  }}
  styles={{
    container: {
      flex: 0,
      width: '80%', // Ancho ajustable según tu diseño
      marginRight: 10, // Margen derecho para separar el checkbox
    },
    textInputContainer: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      marginTop: 10,
      width: '100%',
    },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 38,
      color: '#5d5d5d',
      fontSize: 16,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#ccc',
      padding: 5,
      width: '100%',
    },
    listView: {
      position: 'absolute',
      top: 50,
      left: 10,
      right: 10,
      backgroundColor: '#fff',
      elevation: 3,
      zIndex: 1000,
      borderRadius: 5,
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  }}
/>

  </View>
      )}
        </KeyboardAvoidingView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mis Cargas</Text>
            <FlatList
              data={cargas}
              renderItem={({ item, index }) => (
                <View style={styles.cargaItem}>
                  <Text>Carga #{index + 1}</Text>
                  <Text>Altura: {item.altura}</Text>
                  <Text>Ancho: {item.ancho}</Text>
                  <Text>Consideraciones: {item.consideraciones}</Text>
                  <Text>Destino: {item.destino}</Text>
                  <Text>Largo: {item.largo}</Text>
                  <Text>Peso: {item.peso}</Text>
                  
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.selectButtonText}>Seleccionar</Text>
                  </TouchableOpacity>
               
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Navbar/>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  header: {
    fontSize: 36,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  profile: {
    marginTop: 50,
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },
  form: {
    alignItems: 'center',
    marginTop: 430,
    padding: 10,
    width: '100%',
    position: 'absolute',
  },
  formInputs: {
    alignItems: 'center',
    marginTop: 10,
  },
  formInput: {
    width: 280,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7Eb',
    borderRadius: 10,
    padding: 5,
    paddingLeft: 15,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 10,
    width: 150,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 10,
    width: 280,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cargaItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 10,
  },
  closeButton: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 10,
    width: 280,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});