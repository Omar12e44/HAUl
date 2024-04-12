import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../firebaseConfig';
import { View, StyleSheet, Text, TextInput, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from '../components/navbar';
import * as ImagePicker from 'expo-image-picker';
import SERVER_IP from "../components/config";
import { useAuth } from '../context/auth';



export default function Perfil() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({});
  const [newName, setNewName] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Estado para la imagen seleccionada
  const {userId} = useAuth()


  useEffect(() => {
    fetchUserInfo(userId)
    console.log('UserInfo: ', userInfo);
  },[]);

  const fetchUserInfo = (uid) => {
    fetch(`http://${SERVER_IP}:3000/perfil/${uid}`)
      .then(response => response.json())
      .then(data => {
        setUserInfo(data);
      })
      .catch(error => {
        console.error('Error al obtener la información del usuarioOO:', error);
        Alert.alert('Error', 'Error al obtener la información del usuario');
      });
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await auth.signOut();
      navigation.navigate('login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      Alert.alert('Error', 'Hubo un error al cerrar sesión');
    }
  }

  const handleChooseImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permiso denegado', 'Es necesario otorgar permisos para acceder a la galería de imágenes.');
        return;
      }
  
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!pickerResult.cancelled) {
        setProfileImage(pickerResult.uri); // Actualiza la imagen seleccionada
      }
    } catch (error) {
      console.error('Error al elegir la imagen:', error);
      Alert.alert('Error', 'Hubo un error al elegir la imagen');
    }
  };

  const actualizarNombre = () => {
    if (!newName) {
      Alert.alert('Por favor ingrese un nuevo nombre');
      return;
    }

    fetch(`http://${SERVER_IP}:3000/perfil/${userInfo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newName: newName,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setUserInfo(prevState => ({
          ...prevState,
          user_name: newName,
        }));
        Alert.alert('Nombre actualizado exitosamente');
      })
      .catch(error => {
        console.error('Error al actualizar el nombre:', error);
        Alert.alert('Error', 'Error al actualizar el nombre');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={24} color="purple" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        {/* Mostrar la imagen de perfil del usuario o la imagen por defecto */}
        <TouchableOpacity onPress={handleChooseImage}>
          <Image source={profileImage ? { uri: profileImage } : require('../assets/iconoDefecto.png')} style={styles.profileImage} />
        </TouchableOpacity>
        {userInfo.user_name && <Text style={styles.userInfo}>Nombre: {userInfo.user_name}</Text>}
        {userInfo.user_email && <Text style={styles.userInfo}>Email: {userInfo.user_email}</Text>}
        {userInfo.user_type && <Text style={styles.userInfo}>Tipo de usuario: {userInfo.user_type}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Nuevo nombre"
          value={newName}
          onChangeText={text => setNewName(text)}
        />
        <Button title="Actualizar nombre" onPress={actualizarNombre} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logoutButton: {
    padding: 10,
    marginTop: 5,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
    height: 40,
  },
});
