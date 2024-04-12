import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const tripsData = 
  {
    contratistaId: '',
    driver_id:'',
    carga_id:'',
    origin: '',
    destination: '',
    date1: '',
    date2: '',
    status: '',
    comentarios: '',
  }

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
