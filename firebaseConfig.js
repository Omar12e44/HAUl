//IOS= 296569950432-5icuhakdb8odtn3ms5kk9soaejau5nji.apps.googleusercontent.com
//Android = 296569950432-dj0h4p0rs99gmma9hl1dmtq9blju7n6s.apps.googleusercontent.com

import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth' 

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP83gBMFSEH4GapgAK_GHtCyhl61xTvFQ",
  authDomain: "haul-970a2.firebaseapp.com",
  projectId: "haul-970a2",
  storageBucket: "haul-970a2.appspot.com",
  messagingSenderId: "296569950432",
  appId: "1:296569950432:web:c3f6afd2a1d0dbe1f40085"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);