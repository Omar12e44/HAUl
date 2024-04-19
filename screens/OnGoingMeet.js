import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Image, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps'
import MapViewDirections from  'react-native-maps-directions';
import SERVER_IP from '../components/config';
import { readDataRealTime } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import {GOOGLE_MAPS_KEY} from '@env'
import {useFonts} from 'expo-font'
import { useNavigation } from '@react-navigation/native';



const trailerIcon =  require('../assets/trailer2.png');

const OnGoingMeet = ({route}) => {
  const [fontsLoaded] = useFonts({
    Inter: require('../assets/fonts/Inter.ttf')
  })
  const { gpsData,  readDataRealTime } = useAuth();
  const {selectedTransporte} = route.params;
  const transporteId = selectedTransporte.transporteId
  const driverId = selectedTransporte.driverId
  const contratistaId = selectedTransporte.contratistaId
  const destino = selectedTransporte.destino
  const cargaId = selectedTransporte.cargaId

  const [userData, setUserData ] = useState([])
  const [driverData, setDriverData] = useState()
  const [transportData, setTransportData] = useState({})
  const [cargaData, setCargaData] = useState({})
  const [isModalMaximized, setIsModalMaximized] = useState(true);

  const [currentGpsLocation, setCurrentGpsLocation] = useState({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
  })
  const [originMeet, setOriginMeet] = useState({
    latitude: 20.657003,
    longitude: -100.4006304,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [destination, setDestination] = useState({
    latitude: 20.584460147950757,
    longitude:  -100.39510093014118,
    latitudeDelta: 0.0522,
    longitudeDelta: 0.0221,
  })

  const modalMinimizedHeight = 50; // Valor numérico
  const modalMaximizedHeight = 350; // Valor numéric
  const animatedModalHeight = new Animated.Value(modalMaximizedHeight); // Valor inicial

  console.log('Transporte seleccionado: ', selectedTransporte)

  const toggleModal = () => {
    console.log('context data iot: en modal: ', gpsData)
    console.log('userData en MODAL: ', userData)
    console.log('se abrio el modal cordenadas del gps: ', currentGpsLocation)
    const toValue = isModalMaximized ? modalMinimizedHeight : modalMaximizedHeight;
    Animated.timing(animatedModalHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsModalMaximized(!isModalMaximized);
    });
  };

  const getTransport = async () => {
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/transports/${transporteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const newTransportData = await response.json();
        setTransportData(newTransportData);
        console.log('transporteObtenido', newTransportData)
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Error al obtener los transportes del usuario del usuario:', error);
    }
  };

  const getUserData =  async () => {
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/perfil/${contratistaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const newUserData = await response.json();
        setUserData(newUserData)
        console.log('usuarioObtenido', newUserData)
        return newUserData
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Error al obtener los transportes del usuario del usuario:', error);
    }
  }

  const getCargaData =  async () => {
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/carga/${cargaId}}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const newCargaData = await response.json();
        setCargaData(newCargaData[0])
        console.log('carga obtenida: ', newCargaData)
        console.log('cargaVERIFICAR: ', newCargaData[0])
        return newCargaData
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Error al obtener los transportes del usuario del usuario:', error);
    }
  }

  const handlePressButton = () => {
   
    navigation.navigate('OnGoingTrips', {selectedTransporte: selectedTransporte});
  }

  const getDirections = async () => {
    const origin = encodeURI(selectedTransporte.origen);
    const destination = encodeURI(selectedTransporte.destino);
    const googleMapsApiKey = 'AIzaSyDVnwtmwgsDQZNwoEddFkRHxlFW-up4e2A'; // Reemplaza con tu propia clave API
  
    try {
      const originResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${origin}&key=${googleMapsApiKey}`);
      if (originResponse.ok) {
        const originData = await originResponse.json();
        
        if (originData.results && originData.results.length > 0) {
          const originLocation = originData.results[0].geometry.location;
          const originCoordinates = {
            latitude: originLocation.lat,
            longitude: originLocation.lng
          };
          console.log("Coordenadas del origen:", originCoordinates);
          setOriginMeet(originCoordinates);
        } else {
          throw new Error('No se encontraron resultados de geocodificación para la dirección de origen especificada.');
        }
      } else {
        throw new Error('Error al obtener direcciones del origen');
      }
  
      const destinationResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${googleMapsApiKey}`);
      if (destinationResponse.ok) {
        const destinationData = await destinationResponse.json();
        
        if (destinationData.results && destinationData.results.length > 0) {
          const destinationLocation = destinationData.results[0].geometry.location;
          const destinationCoordinates = {
            latitude: destinationLocation.lat,
            longitude: destinationLocation.lng
          };
          console.log("Coordenadas del destino:", destinationCoordinates);
          setDestination(destinationCoordinates);
        } else {
          throw new Error('No se encontraron resultados de geocodificación para la dirección de destino especificada.');
        }
      } else {
        throw new Error('Error al obtener direcciones del destino');
      }
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
    }
  };

  const navigation = useNavigation();

  useEffect(()=>{
    getTransport()    
    getUserData()
    getDirections()
    getCargaData()
    readDataRealTime()
    console.log('context data iot2: ', gpsData)
    console.log('apikeygoogleENV: ', GOOGLE_MAPS_KEY)
    console.log('origin:', originMeet)
  },[])

  useEffect(() => {
    if (gpsData) {
       setCurrentGpsLocation({
         latitude: gpsData.latitude,
         longitude: gpsData.longitude,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421,
       });
    }
   }, [gpsData]);
  


  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Dirigete hacia tu carga.</Text>
      
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={currentGpsLocation}
      >
        {currentGpsLocation.latitude > 0 && <Marker
          draggable
          coordinate={currentGpsLocation}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
          image={trailerIcon}
        />}

        <Marker
        pinColor='blue'
          draggable
          coordinate={originMeet}
          onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
        />
        <MapViewDirections
          origin={currentGpsLocation}
          destination={originMeet}
          apikey={GOOGLE_MAPS_KEY}
          strokeColor='black'
          strokeWidth={5}
        />
        {/* <Polyline
        coordinates={[currentGpsLocation, destination]}
        strokeColor='pink'
        strokeWidth={8}
        /> */}
      </MapView>

      <Animated.View style={[styles.modalContainer, { height: animatedModalHeight }]}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContent}>
           <Text style={styles.modalTitle}>Encuentra la carga que llevaras en <Text style={styles.modalSpan}>{selectedTransporte.origen}</Text></Text>
            {isModalMaximized && (
              <>
                <Text style={{ fontSize: 17, fontWeight: 'bold', fontFamily: 'Inter'}}><Text style={{color: '#818cf8', fontSize: 17, fontWeight: 'bold', fontFamily: 'Inter',}} >Destino:</Text> {selectedTransporte.destino}</Text>
                
                <View style={{flex:1, justifyContent: 'space-around', flexDirection: 'row', alignItems:'center', marginTop: 40,}}>
                    <View style={{flex:1}}>
                        <Text style={{fontSize:20, fontWeight: '700'}}>{cargaData.nombre}</Text>
        
                        <Image
                            style={styles.tinyLogo}
                        source={{
                            uri: cargaData ?  cargaData.photoUrl : 'https://i0.wp.com/dehumodels.com/wp-content/uploads/2021/03/Peterbilt-579-Negro-187-Tonkin-01.jpg?fit=2100%2C1562&ssl=1',
                        }}
                        />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{fontSize:20, fontWeight: '700', marginTop: -5, marginBottom: 20}}>Contratista</Text>
                        <View style={{flex: 1, flexDirection: 'row' , gap: 10, alignItems:'center', marginTop: 10}}>
                          <Image
                              style={styles.tinyLogo}
                          source={{
                              uri: userData ?  userData.user_avatar_url : 'https://i0.wp.com/dehumodels.com/wp-content/uploads/2021/03/Peterbilt-579-Negro-187-Tonkin-01.jpg?fit=2100%2C1562&ssl=1',
                          }}
                          />
                          <Text style={{fontSize: 17, fontWeight: 'bold', fontFamily: 'Inter', color: '#6C7A89'}}>{userData ? userData.
                          user_name : 'sin nombre' }</Text>
                        </View>
                    </View>
                </View>
                <Button  title="LLEGO EL CONDUCTOR" onPress={handlePressButton}></Button>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    fontFamily: 'Inter',
    backgroundColor: 'white'
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius:  100,
    borderColor: 'gray',
    borderWidth: 1
  },
  header: {
    fontSize: 27,
    fontWeight: '700',
    textShadowColor: '#9ca3af', // Color de la sombra
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento horizontal y vertical de la sombra
    textShadowRadius: 3, // Radio de desenfoque de la sombra
    marginTop: 50,
    paddingBottom: 20,
    zIndex:10,
    position:'absolute',
    backgroundColor: 'transparent'  
  },
  map: {
    width: '100%',
    height: '100%',
    position: "absolute",
    zIndex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height:'100%',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fondo semitransparente
    zIndex: 10,
  },
  modalContent: {
    height:'100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 40,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 15,
    
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'Inter',
  },
  
  modalSpan: {
    color: '#6C7A89',
  }
});

export default OnGoingMeet;
