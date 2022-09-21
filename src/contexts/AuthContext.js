import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

//  Function AuthProvider uses authentication imported from firebase
export function AuthProvider({ children }) {

    //  track the current user and loading status using imported react functions
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    //  Function uses an authentication object to create a user
    function signup(email,password) {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        return userCredential.user;
      })
      .catch((error) => {
        console.log(`${error.code} ${error.message}`);
      });
    }

    //  Function uses an authentication object to login a user
    function login(email,password) {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        return userCredential.user;
      })
      .catch((error) => {
        console.log(`${error.code} ${error.message}`);
      });
    }

    //  Function to make user profile 
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    //  Encapsulate the current user, as well as login, and signup functionality
    const value = {
        currentUser,
        login,
        signup
    }
    
    //  Return the encapsulated user info in an authentication provider
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
  )
}
