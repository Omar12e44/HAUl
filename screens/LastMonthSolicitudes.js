import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image } from 'react-native';
import SERVER_IP from '../components/config';
import Navbar from '../components/navbar';

const LastMonthSolicitudes = () => {
 const [solicitudes, setSolicitudes] = useState([]);
 const [destinosPopulares, setDestinosPopulares] = useState([]);

 useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch(`http://${SERVER_IP}:3000/solicitudes-last-month`);
        const data = await response.json();        
        console.log('dataview:', data)
        setSolicitudes(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error al obtener las solicitudes');
      }
    };

    const fetchDestinosPopulares = async () => {
      try {
        const response = await fetch(`http://${SERVER_IP}:3000/popular-destinations`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        console.log('data destinos:', data)
        setDestinosPopulares(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error al obtener los destinos populares');
      }
    };

    fetchSolicitudes();
    fetchDestinosPopulares();
 }, []);

 const renderSolicitudes = ({ item }) => (
    <View style={styles.cardContainer}>
        <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.cardItem}>
                <Text>{item.user_name}</Text>
                <Text>{item.user_email}</Text>
                <Image
                        source={{ uri: item.user_avatar_url }}
                        style={styles.imagenTransporte}
                    />
            </View>
            {/* <View style={styles.cardItem}>
                <Text>{item.user_name}</Text>
                <Text>{item.user_email}</Text>
                <Image
                        source={{ uri: item.user_avatar_url }}
                        style={styles.imagenTransporte}
                    />
            </View> */}
            
        </View>
       
    </View>
   );
   
   const renderDestinosPopulares = ({ item }) => (
    <View style={styles.cardContainer}>
       <View style={styles.cardItem}>
         <Text>{item.Destino}</Text>
         <Text>Solicitudes: {item.NumeroDeSolicitudes}</Text>
       </View>
    </View>
   );
   

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Viajes realizados <Text style={styles.span}>ultimo </Text>mes en HAUL</Text>
      <FlatList
        data={solicitudes}
        renderItem={renderSolicitudes}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No hay solicitudes para mostrar.</Text>
        }
      />
      <Text style={styles.title}>Destinos <Text style={styles.span2}>Populares</Text></Text>
      <FlatList
        data={destinosPopulares}
        renderItem={renderDestinosPopulares}
        keyExtractor={item => item.Destino.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No hay destinos populares para mostrar.</Text>
        }
      />
      <Navbar></Navbar>
    </View>
 );
};

const styles = StyleSheet.create({
    container: {
       flex: 1,
       backgroundColor: '#fff',
       padding: 30,
    },
    title: {
       fontSize: 24,
       fontWeight: 'bold',
       marginBottom: 20,
       marginTop: 20,
       textAlign: 'center'
    },
    span:{
        color:'#ff6b6b'
    },
    span2:{
        color:'#6366f1'
    },
    emptyListText: {
       textAlign: 'center',
       fontSize: 18,
       color: 'gray',
    },
    cardContainer: {
       backgroundColor: '#fff',
       marginBottom: 10,
       borderRadius: 5,
       elevation: 3, // Para sombras en Android
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
    },
    cardItem: {
       padding: 10,
    },
    imagenTransporte:{
        width: '100%',
        height: 100,
        width: 100,
        marginTop: 10,
        resizeMode: 'cover',
    }
   });
   

export default LastMonthSolicitudes;
