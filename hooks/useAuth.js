import { useContext } from "react"
import { AuthContext } from "../context/auth"

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) throw new Error('There is no auth provider.')
    return context
}
