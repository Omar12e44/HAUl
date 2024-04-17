//IOS= 296569950432-5icuhakdb8odtn3ms5kk9soaejau5nji.apps.googleusercontent.com
//Android = 296569950432-dj0h4p0rs99gmma9hl1dmtq9blju7n6s.apps.googleusercontent.com
import { useState } from "react";
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth' 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {  getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import {
 getFirestore,
 collection,
 addDoc,
 serverTimestamp,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDP83gBMFSEH4GapgAK_GHtCyhl61xTvFQ",
  authDomain: "haul-970a2.firebaseapp.com",
  projectId: "haul-970a2",
  storageBucket: "haul-970a2.appspot.com",
  messagingSenderId: "296569950432",
  appId: "1:296569950432:web:c3f6afd2a1d0dbe1f40085"
};  

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);



if (!getApps().length) {
  initializeApp(firebaseConfig);
 }
 
 const dbFirestore = getFirestore();
 
 const dbRealTime = getDatabase();

async function readDataRealTime() {
  const dataRef = ref(dbRealTime, "ubicacion_actual/");
  get(dataRef)
     .then((snapshot) => {
       if (snapshot.exists()) {
         const data = snapshot.val();
         insertDataInFirestore(data);
         return data
         console.log('data en firebase config: ', data)
       }
     }) 
     .catch((error) => {
       console.error(
         "Error al leer los datos de la base de tiempo real:",
         error
       );
     });
 }
 
 async function insertDataInFirestore(data) {
  try {
     const humedad = data.humidity !== undefined ? data.humidity : "Valor por defecto";
     const latitud = data.latitude !== undefined ? data.latitude : "Valor por defecto";
     const longitud = data.longitude !== undefined ? data.longitude : "Valor por defecto";
     const movimiento = data.pirPresence !== undefined ? data.pirPresence : "Valor por defecto";
     const temperatura = data.temperature !== undefined ? data.temperature : "Valor por defecto";
 
     await addDoc(collection(dbFirestore, "haul"), {
       Humedad: humedad,
       Latitud: latitud,
       Longitud: longitud,
       Movimiento: movimiento,
       Temperatura: temperatura,
       Tiempo: serverTimestamp(),
     });
     console.log("Datos insertados en Firestore");
  } catch (error) {
     console.error("Error al insertar datos en Firestore:", error);
  }
 }
 
 
 setInterval(readDataRealTime, 20000);
 
 export {
  dbRealTime,
  dbFirestore,
  readDataRealTime,
 };
