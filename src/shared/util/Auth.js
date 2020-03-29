import React, {useEffect, useState, createContext } from "react"
import firebase from "../../firebase"


export const AuthContext = createContext()

export const AuthProvider = props => {
    const [currentUser, setCurrentUser] = useState()
    const [mode, setMode] = useState("user")
    const [remember, setRemember] = useState(false)

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            if(remember)
            localStorage.setItem("currentUser", JSON.stringify(user))
        })
    }, [remember])

    return (
        <AuthContext.Provider
            value={{
                currentUser: currentUser,
                setCurrentUser: setCurrentUser,
                mode: mode,
                setMode: setMode,
                remember,
                setRemember
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}