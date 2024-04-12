import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const OngoingTrips = () => {
  const [isModalMaximized, setIsModalMaximized] = useState(true);
  const tripDetails = {
    from: 'Origen',
    to: 'Destino',
  };

  const modalMinimizedHeight = 50; // Valor numérico
  const modalMaximizedHeight = 200; // Valor numérico
  const animatedModalHeight = new Animated.Value(modalMaximizedHeight); // Valor inicial

  const toggleModal = () => {
    const toValue = isModalMaximized ? modalMinimizedHeight : modalMaximizedHeight;
    Animated.timing(animatedModalHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsModalMaximized(!isModalMaximized);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tu Viaje</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <Animated.View style={[styles.modalContainer, { height: animatedModalHeight }]}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles del Viaje</Text>
            {isModalMaximized && (
              <>
                <Text>Origen: {tripDetails.from}</Text>
                <Text>Destino: {tripDetails.to}</Text>
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: '70%',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 70,
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
  },
});

export default OngoingTrips;
