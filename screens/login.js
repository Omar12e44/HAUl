import React, { useState } from "react";
import { View, Image, StyleSheet, TextInput, TouchableOpacity, Text, Alert    } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import SERVER_IP from "../components/config";
import app from '../credenciales'

import { getAuth, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence } from 'firebase/auth';

const auth = getAuth(app)

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const logeo = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const response = await fetch(`http://${SERVER_IP}:3000/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user.uid,
                }),
            });

            if (response.ok) {
                navigation.navigate('home');
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('El usuario o la contraseña son incorrectos');
        }
    }

    return (
        <View style={styles.padre}>
            <View>
                <Image source={require('../assets/haul.png')} style={styles.profile} />
                <Text style={styles.text}>Welcome back</Text>
                <TouchableOpacity onPress={() => navigation.navigate('register')}>
                    <Text style={styles.crear}>¿Necesitas una cuenta?</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tarjeta}>
                <View style={styles.cajaTexto}>
                    <TextInput
                        placeholder="Email: "
                        onChangeText={(text) => setEmail(text)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.cajaTexto2}>
                    <TextInput
                        placeholder="Password: "
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBoton} onPress={logeo}>
                        <Text style={styles.textoBoton}>Sign In</Text>
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
        marginHorizontal: 'auto',
        width: 250,
        height: 90,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    text: {
        marginTop: 10,
        marginLeft:10,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "700",
    },
    crear: {
        marginLeft:10,
        textAlign: "center",
        color: "#3b82f6",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "700",
    },
    tarjeta: {
        margin: 20,
        backgroundColor: 'transparent',
        borderRadius: 20,
        width: '90%',
        padding: 20,
        marginTop:-1,
    },
    cajaTexto: {
        marginLeft: 5,
        width: 300,
        paddingVertical: 20,
        backgroundColor: 'white',
        borderRadius: 14,
        borderColor: '#f3f4f6',
        borderWidth: 1,
        marginVertical: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cajaTexto2: {
        marginLeft: 5,
        width: 300,
        paddingVertical: 20,
        backgroundColor: 'white',
        borderRadius: 14,
        borderColor: '#f3f4f6',
        borderWidth: 1,
        marginVertical: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -15,
    },
    padreBoton: {
        alignItems: 'center',
    },
    cajaBoton: {
        backgroundColor: '#818cf8',
        borderRadius: 30,
        paddingVertical: 20 ,
        width: 300,
        borderRadius: 14,
    },
    textoBoton: {
        textAlign: 'center',
        color: 'white',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
    },
    logo: {
        alignItems: "center",
    },
    input:{
        paddingHorizontal: 15,
        height:15,
    },
});
