import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const tripsData = [
  {
    id: '1',
    origin: 'Origen 1',
    destination: 'Destino 1',
    date: '2024-04-10',
    status: 'Terminado',
    report: 'Reporte del viaje 1',
  },
  {
    id: '2',
    origin: 'Origen 2',
    destination: 'Destino 2',
    date: '2024-04-09',
    status: 'Terminado',
    report: 'Reporte del viaje 2',
  },
  // Agrega más datos de viajes según sea necesario
];

const History = () => {
  const renderTripItem = ({ item }) => (
    <View style={styles.tripCard}>
      <Text style={styles.tripInfo}>Origen: {item.origin}</Text>
      <Text style={styles.tripInfo}>Destino: {item.destination}</Text>
      <Text style={styles.tripInfo}>Fecha: {item.date}</Text>
      <Text style={styles.tripInfo}>Estado: {item.status}</Text>
      <Text style={styles.tripInfo}>Reporte: {item.report}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historial de Viajes</Text>
      <FlatList
        data={tripsData}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
  },
  tripInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default History;
