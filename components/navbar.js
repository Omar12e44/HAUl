import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';


const Navbar = () => {
  const navigation = useNavigation();

  const handleGoToHome = () => {
    navigation.navigate('home');
  };

  const handleGoToPerfil = () => {
    navigation.navigate('Perfil');
  };

  const handleGoToSettings = () => {
    navigation.navigate('Settings', {
      // Parámetros opcionales
    });
  };
  const handleGoToLoads = () => {
    navigation.navigate('altaCarga', {
      // Parámetros opcionales
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.button} onPress={handleGoToPerfil}>
          <AntDesign name="user" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGoToHome}>
          <Feather name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGoToHome}>
          <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGoToLoads}>
          <AntDesign name="upload" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 10, // Ajuste del espaciado horizontal
    paddingBottom: 10, // Ajuste del espaciado inferior
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribuye uniformemente los elementos
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10, // Bordes redondeados para un aspecto más agradable
    paddingVertical: 5, // Ajuste del espaciado vertical
    paddingHorizontal: 10, // Ajuste del espaciado horizontal
  },
  button: {},
});

export default Navbar;
