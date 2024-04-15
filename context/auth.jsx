import { useEffect } from "react";
import { useState } from "react";
import { createContext, useContext } from "react";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from "../firebaseConfig";

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

    return (
        <AuthContext.Provider 
            value={{
                user,
                login,
                userId,
                loading,
                logInWithGoogle,
            }} 
        >
            {children}
         </AuthContext.Provider >
    )

}