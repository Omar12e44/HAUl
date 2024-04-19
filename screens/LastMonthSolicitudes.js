import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, ListItem } from 'react-native-elements';

const LastMonthSolicitudes = () => {
 const [solicitudes, setSolicitudes] = useState([]);
 const [destinosPopulares, setDestinosPopulares] = useState([]);

 useEffect(() => {
    fetch('http://localhost:3000/vista-usuarios-viajes-ultimo-mes')
      .then(response => response.json())
      .then(data => setSolicitudes(data))
      .catch(error => console.error(error));

    fetch('http://localhost:3000/destinos-populares-ultimo-mes')
      .then(response => response.json())
      .then(data => setDestinosPopulares(data))
      .catch(error => console.error(error));
 }, []);

 const renderSolicitudes = ({ item }) => (
    <Card>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.user_name}</ListItem.Title>
          <ListItem.Subtitle>{item.user_email}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </Card>
 );

 const renderDestinosPopulares = ({ item }) => (
    <Card>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.Destino}</ListItem.Title>
          <ListItem.Subtitle>Solicitudes: {item.NumeroDeSolicitudes}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </Card>
 );

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes del Último Mes</Text>
      <FlatList
        data={solicitudes}
        renderItem={renderSolicitudes}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No hay solicitudes para mostrar.</Text>
        }
      />
      <Text style={styles.title}>Destinos Populares</Text>
      <FlatList
        data={destinosPopulares}
        renderItem={renderDestinosPopulares}
        keyExtractor={item => item.Destino.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No hay destinos populares para mostrar.</Text>
        }
      />
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
 },
 title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
 },
 emptyListText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
 },
});

export default LastMonthSolicitudes;
