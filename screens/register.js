import React, { useState } from "react";
import { View, Image, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import SERVER_IP from "../components/config";
import app from '../credenciales';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(app);

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [UserName, setUserName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation = useNavigation();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const registro = async () => {
        try {
            if (password !== confirmPassword) {
                Alert.alert('Contraseñas no coinciden', 'Por favor, verifica tus contraseñas.');
                return;
            }
    
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            const response = await fetch(`http://${SERVER_IP}:3000/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user.uid,
                    nombre: UserName,
                    email: email
                }),
            });
    
            if (response.ok) {
                Alert.alert('Registro exitoso', '¡Tu cuenta ha sido creada!');
                navigation.navigate('login');
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error en el registro', 'Hubo un problema al intentar registrarse.');
        }
    }

    return (
        <View style={styles.padre}>
            <View>
                <Image source={require('../assets/haul.png')} style={styles.profile} />
                <Text style={styles.text}>Create an account</Text>
                <TouchableOpacity onPress={() => navigation.navigate('login')}>
                    <Text style={styles.crear}>¿Ya tienes una cuenta?</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tarjeta}>
                <View style={styles.cajaTexto}>
                    <TextInput
                        placeholder="Nombre"
                        style={{ paddingHorizontal: 15 }}
                        onChangeText={(text) => setUserName(text)}
                    />
                </View>
                <View style={styles.cajaTexto}>
                    <TextInput
                        placeholder="Email"
                        style={{ paddingHorizontal: 15 }}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                <View style={styles.cajaTexto}>
                    <TextInput
                        placeholder="Contraseña"
                        style={{ paddingHorizontal: 5 }}
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cajaTexto}>
                    <TextInput
                        placeholder="Confirmar Contraseña"
                        style={{ paddingHorizontal: 5 }}
                        secureTextEntry={!showConfirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                    />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                        <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBoton} onPress={registro}>
                        <Text style={styles.textoBoton}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    profile: {
        width: 150,
        height: 65,
        resizeMode: 'contain',
    },
    tarjeta: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        padding: 20,
        ShadowColor: '#000',
        ShadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cajaTexto: {
        paddingVertical: 20,
        backgroundColor: '#cccccc40',
        borderRadius: 30,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    padreBoton: {
        alignItems: 'center',
    },
    cajaBoton: {
        backgroundColor: '#525FE1',
        borderRadius: 30,
        paddingVertical: 20,
        width: 300,
        marginTop: 20
    },
    textoBoton: {
        textAlign: 'center',
        color: 'white'
    },
    text: {
        textAlign: "center",
    },
    crear: {
        textAlign: "center",
        color: "blue"
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
    },
});
