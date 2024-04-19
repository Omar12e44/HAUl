import { useEffect } from "react";
import { useState } from "react";
import { createContext, useContext } from "react";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword} from 'firebase/auth'
import { getDatabase, ref, get } from "firebase/database";
import { auth } from "../firebaseConfig";   
import SERVER_IP from "../components/config";

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) throw new Error('There is no auth provider.')
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(true)
    const [gpsData, setGpsData] = useState({})
    const [userType, setUserType] = useState({})

    useEffect(() => {
        onAuthStateChanged(auth, currentUser => {
            if(currentUser){
                setUser(currentUser)
                setUserId(currentUser.uid)
                setLoading(false)
            }
        })
    },[])

    const login  = async (email, password) => 
    signInWithEmailAndPassword(auth, email, password)

    const logInWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider()
        console.log(GoogleAuthProvider);
        return signInWithPopup(auth, googleProvider)
    }   

    const dbRealTime = getDatabase();

    function readDataRealTime() {
        const dataRef = ref(dbRealTime, "ubicacion_actual/");
        get(dataRef)
            .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setGpsData(data)
                console.log('data en firebase context: ', gpsData)
            }
            }) 
            .catch((error) => {
            console.error(
                "Error al leer los datos de la base de tiempo real:",
                error
            );
        });
    }
 
    const searchUserType =  async (userIdP) => {
        try {
          const response = await  fetch(`http://${SERVER_IP}:3000/userType/${userIdP}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const newUserType = await response.json();
            setUserType(newUserType)
            console.log('typeVERIFICAR: ', newUserType)
          } else {
            throw new Error('Error en el servidor');
          }
        } catch (error) {
          console.error('Error al obtener el usertype del usuario:', error);
        }
    }

    return (
        <AuthContext.Provider 
            value={{
                user,
                login,
                userId,
                loading,
                logInWithGoogle,
                gpsData,
                readDataRealTime,
                searchUserType,
                userType
            }} 
        >
            {children}
         </AuthContext.Provider >
    )

}