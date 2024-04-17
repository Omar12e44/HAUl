import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps'
import MapViewDirections from  'react-native-maps-directions';
import SERVER_IP from '../components/config';
import { readDataRealTime } from '../firebaseConfig';
import { useAuth } from './../hooks/useAuth';
import {GOOGLE_MAPS_KEY} from '@env'
import {useFonts} from 'expo-font'

const trailerIcon =  require('../assets/trailer2.png');

const OngoingTrips = ({route}) => {
  const [fontsLoaded] = useFonts({
    Inter: require('../assets/fonts/Inter.ttf')
  })
  const { gpsData, loading, readDataRealTime } = useAuth();
  const [isModalMaximized, setIsModalMaximized] = useState(true);
  const [driverData, setDriverData] = useState()
  const [coordinates, setCoordinates] = useState([]);
  const [transportData, setTransportData] = useState({})
  
  const {selectedTransporte} = route.params;

  const transporteId = selectedTransporte.transporteId
  const driverId = selectedTransporte.driverId
  const destino = selectedTransporte.destino

  const [currentGpsLocation, setCurrentGpsLocation] = useState({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
  })
  const [origin, setOrigin] = useState({
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
    console.log('')
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
      const response = await fetch(`http://${SERVER_IP}:3000/perfil/${driverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const newUserData = await response.json();
        console.log('usuarioObtenido', newUserData)
        return newUserData
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Error al obtener los transportes del usuario del usuario:', error);
    }
  }

  const getDirections = async () => {
    const origin = encodeURI(selectedTransporte.origen);
    const destination = encodeURI(selectedTransporte.destino);
    const googleMapsApiKey = '[YOUR_GOOGLE_MAPS_API_KEY]'; // Replace with your API key

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=<span class="math-inline">\{origin\}&destination\=</span>{destination}&key=${googleMapsApiKey}`);
      if (response.ok) {
        const data = await response.json();
        const route = data.routes[0];
        const points = route.legs[0].steps.map((step) => step.polyline.points);
        const decodedCoordinates = points.map((point) => Polyline.decode(point));
        setCoordinates(decodedCoordinates);
      } else {
        throw new Error('Error al obtener direcciones');
      }
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
    }
  };

  // useCallback(async () => {
  //   const newUserData = await getUserTransport();
  //   setTransportData(newUserData)
  //   console.log('transportData: ', transportData)
  //   cl
  // }, [toggleModal]);

  useEffect(()=>{
    getTransport()    
    getUserData()
    readDataRealTime()
    console.log('context data iot2: ', gpsData)
    console.log('apikeygoogleENV: ', GOOGLE_MAPS_KEY)
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
      
      <Text style={styles.header}>Dirigete hacia tu destino.</Text>
      
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
          coordinate={destination}
          onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
        />
        <MapViewDirections
          origin={currentGpsLocation}
          destination={destination}
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
            <Text style={styles.modalTitle}>Encuentra la carga que llevaras en {selectedTransporte.destino}</Text>
            {isModalMaximized && (
              <>
                <Text>Origen: {selectedTransporte.origen}</Text>
                <Text>Destino: {selectedTransporte.destino}</Text>
                <Text>Modelo:{}</Text>
                <Text>Latitud:{gpsData.latitude}</Text>
                <Text>Longitud:{gpsData.longitude}</Text>
                <Text>Movimiento:{gpsData.pirPresence}</Text>
                
                <Image
                    style={styles.tinyLogo}
                  source={{
                    uri: transportData ?  transportData.transport_photoUrl : 'https://i0.wp.com/dehumodels.com/wp-content/uploads/2021/03/Peterbilt-579-Negro-187-Tonkin-01.jpg?fit=2100%2C1562&ssl=1',
                  }}
                />
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
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
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
    paddingVertical: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 15,
    
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'Inter',
  },
});

export default OngoingTrips;
